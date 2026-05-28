import { Router, Response } from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { Config } from '../models/Config'
import { User } from '../models/User'
import { LocalKnowledge } from '../models/LocalKnowledge'

// حدود الاستخدام اليومي حسب المستوى
const AI_LEVEL_LIMITS: Record<number, number> = { 1: 20, 2: 100, 3: 1500 }

// عداد الاستخدام في الذاكرة: key = "userId:YYYY-MM-DD"
const dailyUsage = new Map<string, number>()

function todayKey(userId: string): string {
  return `${userId}:${new Date().toISOString().split('T')[0]}`
}

function checkAndIncrement(userId: string, limit: number): boolean {
  const key = todayKey(userId)
  const current = dailyUsage.get(key) || 0
  if (current >= limit) return false
  dailyUsage.set(key, current + 1)
  return true
}

async function getAppGeminiKey(): Promise<string | null> {
  try {
    const doc = await Config.findOne({ configType: 'gemini' })
    const dbKey = doc?.items?.[0]?.labelAr || null
    if (dbKey) return dbKey
  } catch {}
  return process.env.GEMINI_API_KEY || null
}

const router = Router()

function buildSystemPrompt(role: string, wilaya?: string): string {
  const regionLine = wilaya
    ? `المستخدم من ولاية ${wilaya} — خصّص نصائحك حسب مناخ هذه المنطقة وظروفها الزراعية.`
    : 'خصّص نصائحك حسب المنطقة الجزائرية إن ذُكرت.'

  return `أنت خبير زراعي شامل متخصص في الزراعة الجزائرية، تغطي خبرتك كل مراحل السلسلة الزراعية:
• الإنتاج: زراعة المحاصيل، الري، التسميد، تشخيص الأمراض والآفات، مواعيد الزراعة والحصاد
• ما بعد الحصاد: التخزين، الفرز، التعبئة، تقليل الهدر
• التسويق والبيع: تسعير المحاصيل، قنوات البيع، أسواق الجملة والتجزئة، التفاوض مع المشترين
• الاقتصاد الزراعي: حساب التكاليف والأرباح، المنح والدعم الحكومي الجزائري

قواعد الإجابة:
- أجب بالعربية الفصحى البسيطة أو الدارجة الجزائرية.
- اجعل إجابتك موجزة ومركّزة (لا تتجاوز 150 كلمة إلا عند الضرورة القصوى).
- استند إلى معلومات حديثة وموثوقة.
- قدّم نصائح عملية وقابلة للتطبيق مباشرة.
- ${regionLine}
- لا تذكر اسم الولاية أو المنطقة صراحةً في ردك، بل استخدم عبارات مثل "في منطقتكم" أو "بالنسبة لمنطقتكم" أو "في ظروف منطقتكم".

تعليمات الحفظ التلقائي:
إذا كانت إجابتك تحتوي على معلومة زراعية محلية مهمة وفريدة (اسم صنف محلي، ممارسة تقليدية، موعد زراعة خاص بالمنطقة، سعر موسمي، إلخ)، أضف في نهاية ردك هذا الوسم بالضبط على سطر منفصل:
[SAVE:الموضوع|المحتوى المختصر في جملة أو جملتين]
مثال: [SAVE:صنف طماطم محلي|صنف الدويري منتشر في تيزي وزو، يتميز بمقاومته للحرارة وينضج في 70 يوم]
إذا لم تكن المعلومة فريدة أو محلية أو لم تتأكد منها، لا تضيف هذا الوسم أبداً.`
}

// POST /api/ai/ask
router.post('/ask', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { message, image, history = [] } = req.body
    if (!message?.trim() && !image) return res.status(400).json({ error: 'الرسالة مطلوبة' })
    if (message?.length > 2000) return res.status(400).json({ error: 'الرسالة طويلة جداً (الحد 2000 حرف)' })

    // جلب بيانات المستخدم الكاملة (مستوى الاشتراك + المفتاح الخاص + الولاية)
    const user = await User.findById(req.userId).select('wilaya aiLevel geminiKey').lean()
    const wilaya: string | undefined = (user as any)?.wilaya || undefined
    const aiLevel: number = (user as any)?.aiLevel || 1
    const userGeminiKey: string | undefined = (user as any)?.geminiKey || undefined

    // التحقق من الحد اليومي
    const dailyLimit = AI_LEVEL_LIMITS[aiLevel] || 20
    if (!checkAndIncrement(req.userId!, dailyLimit)) {
      return res.status(429).json({ error: 'DAILY_LIMIT_REACHED' })
    }

    // تحديد مفتاح API المستخدَم
    let apiKey: string | null = null
    if (aiLevel === 3 && userGeminiKey) {
      apiKey = userGeminiKey
    } else {
      apiKey = await getAppGeminiKey()
    }
    if (!apiKey) {
      return res.status(503).json({ error: 'خدمة الذكاء الاصطناعي غير متوفرة حالياً' })
    }

    // جلب المعرفة المحلية ذات الصلة
    let localKnowledge = ''
    try {
      const keywords = (message || '').slice(0, 80)
      const filter: any = { verified: true }
      if (wilaya) filter.$or = [{ wilaya }, { wilaya: { $exists: false } }, { wilaya: '' }]
      const entries = await LocalKnowledge.find(
        { ...filter, $text: { $search: keywords } },
        { score: { $meta: 'textScore' } }
      ).sort({ score: { $meta: 'textScore' } }).limit(4).lean()
      if (entries.length > 0) {
        localKnowledge = '\n\nمعلومات محلية موثوقة من مستخدمين في المنطقة:\n' +
          entries.map((e: any) => `- ${e.topic}: ${e.content}${e.wilaya ? ` (${e.wilaya})` : ''}`).join('\n')
      }
    } catch {}

    const role = req.userRole || 'default'
    const systemInstruction = buildSystemPrompt(role, wilaya) + localKnowledge

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', systemInstruction })

    const chatHistory = (history as any[]).slice(-6).map((msg: any) => {
      const parts: any[] = []
      if (msg.image && msg.role === 'user') {
        const base64Data = msg.image.replace(/^data:image\/\w+;base64,/, '')
        const mimeMatch = msg.image.match(/^data:(image\/\w+);base64,/)
        const mimeType = mimeMatch?.[1] || 'image/jpeg'
        parts.push({ inlineData: { mimeType, data: base64Data } })
      }
      if (msg.content) parts.push({ text: msg.content })
      if (parts.length === 0) parts.push({ text: '' })
      return { role: msg.role === 'user' ? 'user' : 'model', parts }
    })

    const chat = model.startChat({ history: chatHistory })

    const parts: any[] = []
    if (image) {
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '')
      const mimeMatch = image.match(/^data:(image\/\w+);base64,/)
      const mimeType = mimeMatch?.[1] || 'image/jpeg'
      parts.push({ inlineData: { mimeType, data: base64Data } })
    }
    parts.push({ text: message || 'حلل هذه الصورة وأخبرني بحالة المحصول' })

    const result = await chat.sendMessage(parts)
    let response = result.response.text()

    // حفظ المعلومة المحلية تلقائياً إن وُجدت
    let autoSaved = false
    const saveMatch = response.match(/\[SAVE:([^\|]+)\|([^\]]+)\]/)
    if (saveMatch) {
      response = response.replace(/\s*\[SAVE:[^\]]+\]\s*$/, '').trim()
      try {
        await LocalKnowledge.create({
          topic: saveMatch[1].trim(),
          content: saveMatch[2].trim(),
          wilaya: wilaya || undefined,
          userId: req.userId!,
          verified: false,
        })
        autoSaved = true
      } catch {}
    }

    res.json({ response, role, wilaya, autoSaved, aiLevel, remaining: dailyLimit - (dailyUsage.get(todayKey(req.userId!)) || 0) })
  } catch (err: any) {
    console.error('[AI Error]', err?.message || err)
    if (err?.message?.includes('API_KEY') || err?.message?.includes('API key')) {
      return res.status(503).json({ error: 'مفتاح الذكاء الاصطناعي غير صالح' })
    }
    if (err?.message?.includes('429') || err?.message?.includes('quota') || err?.message?.includes('Too Many Requests')) {
      return res.status(429).json({ error: 'DAILY_LIMIT_REACHED' })
    }
    res.status(500).json({ error: 'خطأ في خدمة الذكاء الاصطناعي' })
  }
})

// GET /api/ai/status
router.get('/status', requireAuth, (_req: AuthRequest, res: Response) => {
  const available = !!process.env.GEMINI_API_KEY
  res.json({ available })
})

export default router
