import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Send, Camera, X, Loader, Bot, User, BookmarkPlus, Check } from 'lucide-react'
import { compressImage } from '../../utils/imageCompression'
import { api } from '../../api/client'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  image?: string
  loading?: boolean
}

async function askBackendAI(
  history: Message[],
  message: string,
  image?: string | null
): Promise<{ response: string; autoSaved: boolean }> {
  const text = message || (image ? 'حلل هذا المحصول وأخبرني بحالته' : '')
  const chatHistory = history
    .filter(m => !m.loading && m.id !== '0')
    .map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content, image: m.image || undefined }))

  const data = await api.post<{ response: string; autoSaved?: boolean }>('/api/ai/ask', {
    message: text,
    image: image || undefined,
    history: chatHistory,
  })
  return { response: data.response, autoSaved: data.autoSaved ?? false }
}

const QUICK_QUESTIONS = [
  'كيف أعرف أن محصولي مصاب بمرض؟',
  'ما هو أفضل وقت للري؟',
  'كيف أحسن جودة التربة؟',
  'ما هي أعراض نقص الأزوت؟',
  'كيف أكافح الآفات طبيعياً؟',
]

export default function FarmerAI() {
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'مرحباً! أنا مساعدك الزراعي الذكي 🌱\n\nيمكنني مساعدتك في:\n• تشخيص أمراض المحاصيل من الصور 📸\n• نصائح الري والتسميد\n• مواعيد الزراعة والحصاد\n• حلول المشاكل الزراعية\n\nأرسل سؤالك أو صورة من حقلك!',
    },
  ])
  const [input, setInput] = useState('')
  const [pendingImage, setPendingImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  // حفظ المعرفة المحلية
  const [saveModal, setSaveModal] = useState<string | null>(null) // message content
  const [saveTopic, setSaveTopic] = useState('')
  const [saveContent, setSaveContent] = useState('')
  const [saveLoading, setSaveLoading] = useState(false)
  const [savedMsgIds, setSavedMsgIds] = useState<Set<string>>(new Set())
  const [autoSavedToast, setAutoSavedToast] = useState(false)

  useEffect(() => {
    if (!autoSavedToast) return
    const t = setTimeout(() => setAutoSavedToast(false), 3000)
    return () => clearTimeout(t)
  }, [autoSavedToast])

  const openSaveModal = (msg: Message) => {
    setSaveTopic('')
    setSaveContent(msg.content.slice(0, 400))
    setSaveModal(msg.id)
  }

  const handleSaveKnowledge = async () => {
    if (!saveTopic.trim() || !saveContent.trim()) return
    setSaveLoading(true)
    try {
      await api.post('/api/knowledge', { topic: saveTopic.trim(), content: saveContent.trim() })
      setSavedMsgIds(prev => new Set([...prev, saveModal!]))
      setSaveModal(null)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ، حاول مجدداً'
      alert(`⚠️ ${msg}`)
    } finally {
      setSaveLoading(false)
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const pickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const result = await compressImage(file)
    setPendingImage(result.base64)
    e.target.value = ''
  }

  const send = async () => {
    if (loading || (!input.trim() && !pendingImage)) return

    const text = input.trim()
    const img = pendingImage
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, image: img || undefined }
    const loadingMsg: Message = { id: Date.now().toString() + 'l', role: 'assistant', content: '', loading: true }

    setMessages(prev => [...prev, userMsg, loadingMsg])
    setInput('')
    setPendingImage(null)
    setLoading(true)

    try {
      const { response, autoSaved } = await askBackendAI(messages.filter(m => !m.loading), text, img)
      setMessages(prev => prev.map(m => m.loading ? { ...m, content: response, loading: false } : m))
      if (autoSaved) setAutoSavedToast(true)
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'حدث خطأ، حاول مجدداً'
      const isDailyLimit = errMsg.includes('DAILY_LIMIT_REACHED') || errMsg.includes('429')
      const displayMsg = isDailyLimit
        ? '🔒 لقد وصلت إلى الحد اليومي للاستخدام (20 سؤال/يوم).\n\nيجب أن ترقّي حسابك للمتابعة. تواصل مع الإدارة للحصول على اشتراك مميز ⭐'
        : `⚠️ ${errMsg}`
      setMessages(prev => prev.map(m => m.loading ? { ...m, content: displayMsg, loading: false } : m))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f0fdf4' }} dir="rtl">
      {/* Header */}
      <div className="px-4 pt-10 pb-4 flex items-center gap-3" style={{ background: 'linear-gradient(135deg, #2D6A4F 0%, #1B4332 100%)' }}>
        <button onClick={() => navigate(-1)} className="text-white">
          <ArrowRight size={22} />
        </button>
        <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center flex-shrink-0">
          <Bot size={22} color="white" />
        </div>
        <div className="flex-1">
          <h1 className="text-white font-black text-lg">المساعد الزراعي الذكي</h1>
          <p className="text-green-200 text-xs">مدعوم بـ Google Gemini AI ✨</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 pb-44">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
              msg.role === 'assistant' ? 'bg-primary-500' : 'bg-amber-500'
            }`}>
              {msg.role === 'assistant' ? <Bot size={16} color="white" /> : <User size={16} color="white" />}
            </div>
            <div className="flex flex-col gap-1 max-w-[82%]">
              <div className={`rounded-2xl p-3 ${
                msg.role === 'user'
                  ? 'bg-primary-500 text-white rounded-tr-sm'
                  : 'bg-white shadow-sm border border-gray-100 rounded-tl-sm'
              }`}>
                {msg.image && (
                  <img src={msg.image} alt="" className="rounded-xl mb-2 max-h-48 w-full object-cover" />
                )}
                {msg.loading ? (
                  <div className="flex items-center gap-2">
                    <Loader size={16} className="animate-spin text-primary-500" />
                    <span className="text-gray-400 text-sm">جارٍ التحليل...</span>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap"
                    style={{ color: msg.role === 'user' ? 'white' : '#1a1a1a' }}>
                    {msg.content}
                  </p>
                )}
              </div>
              {/* زر حفظ المعلومة — يظهر على ردود المساعد فقط */}
              {msg.role === 'assistant' && !msg.loading && msg.id !== '0' && msg.content.trim() && (
                <div className="flex justify-start">
                  {savedMsgIds.has(msg.id) ? (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-bold px-2">
                      <Check size={12} /> تم الحفظ
                    </span>
                  ) : (
                    <button
                      onClick={() => openSaveModal(msg)}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-primary-600 px-2 py-0.5 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                      <BookmarkPlus size={13} /> احفظ كمعلومة
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Quick questions */}
      {messages.length <= 1 && (
        <div className="fixed bottom-32 left-0 right-0 max-w-md mx-auto px-4 pb-2 flex gap-2 overflow-x-auto z-10 bg-transparent" style={{ scrollbarWidth: 'none' }}>
          {QUICK_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => setInput(q)}
              className="flex-shrink-0 bg-white border border-primary-200 text-primary-700 text-xs font-bold px-3 py-2 rounded-xl shadow-sm"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 px-4 py-3">
        {pendingImage && (
          <div className="mb-2 relative inline-block">
            <img src={pendingImage} alt="" className="h-16 w-16 object-cover rounded-xl border border-gray-200" />
            <button onClick={() => setPendingImage(null)}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <X size={10} color="white" />
            </button>
          </div>
        )}
        <div className="flex items-end gap-2">
          <button
            onClick={() => fileRef.current?.click()}
            className="w-10 h-10 rounded-xl bg-primary-50 border border-primary-200 flex items-center justify-center flex-shrink-0"
          >
            <Camera size={18} className="text-primary-600" />
          </button>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="اكتب سؤالك أو أرسل صورة..."
            className="flex-1 resize-none rounded-2xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-primary-400 max-h-24"
            rows={1}
            style={{ fontFamily: 'inherit' }}
          />
          <button
            onClick={send}
            disabled={loading || (!input.trim() && !pendingImage)}
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors"
            style={{ background: (loading || (!input.trim() && !pendingImage)) ? '#e5e7eb' : '#2D6A4F' }}
          >
            {loading
              ? <Loader size={16} color="#9ca3af" className="animate-spin" />
              : <Send size={16} color={(!input.trim() && !pendingImage) ? '#9ca3af' : 'white'} />
            }
          </button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={pickImage} />
      </div>

      {/* Auto-save toast */}
      {autoSavedToast && (
        <div style={{ position: 'fixed', top: 70, left: '50%', transform: 'translateX(-50%)', zIndex: 9998, background: '#2D6A4F', color: 'white', borderRadius: 12, padding: '10px 18px', fontSize: 13, fontWeight: 'bold', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Check size={15} /> تم حفظ معلومة مفيدة تلقائياً ✨
        </div>
      )}

      {/* Save Knowledge Modal */}
      {saveModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} dir="rtl">
          <div style={{ background: 'white', borderRadius: 20, padding: 24, width: '100%', maxWidth: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
            <h3 className="text-base font-black text-gray-800 mb-4">💾 حفظ معلومة محلية</h3>
            <div className="mb-3">
              <label className="text-xs text-gray-500 font-bold mb-1 block">الموضوع</label>
              <input
                value={saveTopic}
                onChange={e => setSaveTopic(e.target.value)}
                placeholder="مثال: اسم صنف الطماطم المحلي"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-400"
                style={{ fontFamily: 'inherit' }}
              />
            </div>
            <div className="mb-4">
              <label className="text-xs text-gray-500 font-bold mb-1 block">المحتوى</label>
              <textarea
                value={saveContent}
                onChange={e => setSaveContent(e.target.value)}
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary-400 resize-none"
                style={{ fontFamily: 'inherit' }}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveKnowledge}
                disabled={saveLoading || !saveTopic.trim() || !saveContent.trim()}
                className="flex-1 py-2.5 rounded-xl text-sm font-black text-white transition-colors"
                style={{ background: (saveLoading || !saveTopic.trim() || !saveContent.trim()) ? '#9ca3af' : '#2D6A4F' }}
              >
                {saveLoading ? 'جارٍ الحفظ...' : 'حفظ'}
              </button>
              <button
                onClick={() => setSaveModal(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold border border-gray-200 text-gray-600"
              >
                إلغاء
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">ستُراجع هذه المعلومة قبل استخدامها في المساعد الذكي</p>
          </div>
        </div>
      )}
    </div>
  )
}
