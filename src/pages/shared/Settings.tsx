import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import { WILAYAS } from '../../types'
import { getCommunesByWilayaName } from '../../data/algeriaLocations'
import { ArrowRight, Bot, Key, Eye, EyeOff, Check, Trash2, User, Phone, MapPin, Star, ChevronDown, Navigation, Edit2, Save, X } from 'lucide-react'
import { showToast } from '../../components/Shared/Toast'

export default function Settings() {
  const navigate = useNavigate()
  const { currentUser, geminiApiKey, setGeminiApiKey, updateUser, logout } = useAppStore()

  // Gemini key state
  const [keyInput, setKeyInput] = useState(geminiApiKey)
  const [showKey, setShowKey] = useState(false)
  const [keySaved, setKeySaved] = useState(false)

  // Profile edit state
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(currentUser?.name || '')
  const [phone, setPhone] = useState(currentUser?.phone || '')
  const [wilaya, setWilaya] = useState(currentUser?.wilaya || '')
  const [commune, setCommune] = useState(currentUser?.commune || '')
  const [facebookUrl, setFacebookUrl] = useState(currentUser?.facebookUrl || '')
  const [tiktokUrl, setTiktokUrl] = useState(currentUser?.tiktokUrl || '')
  const [showWilaya, setShowWilaya] = useState(false)
  const [wilayaSearch, setWilayaSearch] = useState('')
  const [showCommune, setShowCommune] = useState(false)
  const [communeSearch, setCommuneSearch] = useState('')
  const [saving, setSaving] = useState(false)

  // Location state
  const [locLoading, setLocLoading] = useState(false)
  const [gpsLat, setGpsLat] = useState(currentUser?.gpsLat || 0)
  const [gpsLng, setGpsLng] = useState(currentUser?.gpsLng || 0)

  useEffect(() => {
    setName(currentUser?.name || '')
    setPhone(currentUser?.phone || '')
    setWilaya(currentUser?.wilaya || '')
    setCommune(currentUser?.commune || '')
    setGpsLat(currentUser?.gpsLat || 0)
    setGpsLng(currentUser?.gpsLng || 0)
    setFacebookUrl(currentUser?.facebookUrl || '')
    setTiktokUrl(currentUser?.tiktokUrl || '')
  }, [currentUser])

  const handleSaveProfile = async () => {
    if (!name.trim()) { showToast('أدخل الاسم', 'error'); return }
    if (phone && phone.length < 9) { showToast('رقم الهاتف غير صحيح', 'error'); return }
    setSaving(true)
    await new Promise(r => setTimeout(r, 500))
    const result = await updateUser({ name: name.trim(), phone: phone.trim(), wilaya, commune, gpsLat, gpsLng, facebookUrl: facebookUrl.trim(), tiktokUrl: tiktokUrl.trim() })
    setSaving(false)
    if (result === 'phone_taken') {
      showToast('رقم الهاتف مستخدم من حساب آخر', 'error')
    } else {
      showToast('✅ تم حفظ المعلومات', 'success')
      setEditing(false)
    }
  }

  const handleGetLocation = () => {
    if (!navigator.geolocation) { showToast('المتصفح لا يدعم تحديد الموقع', 'error'); return }
    setLocLoading(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setGpsLat(pos.coords.latitude)
        setGpsLng(pos.coords.longitude)
        setLocLoading(false)
        showToast('✅ تم تحديد موقعك', 'success')
      },
      () => {
        setLocLoading(false)
        showToast('لم يتم السماح بالوصول للموقع', 'error')
      }
    )
  }

  const handleSaveKey = () => {
    if (!keyInput.trim()) { showToast('أدخل المفتاح', 'error'); return }
    setGeminiApiKey(keyInput.trim())
    setKeySaved(true)
    showToast('✅ تم حفظ مفتاح Gemini', 'success')
    setTimeout(() => setKeySaved(false), 3000)
  }

  const roleLabel = currentUser?.role === 'farmer' ? 'فلاح' : currentUser?.role === 'buyer' ? 'مشتري' : 'وسيط'
  const roleColor = currentUser?.role === 'farmer' ? '#d97706' : currentUser?.role === 'buyer' ? '#2563eb' : '#2D6A4F'
  const filteredWilayas = WILAYAS.filter(w => w.includes(wilayaSearch))
  const communes = getCommunesByWilayaName(wilaya)
  const filteredCommunes = communes.filter(c => c.nameAr.includes(communeSearch) || c.nameFr.toLowerCase().includes(communeSearch.toLowerCase()))

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="px-4 pt-10 pb-6" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
        <button onClick={() => navigate(-1)} className="text-white mb-4 flex items-center gap-1">
          <ArrowRight size={20} />
          <span className="text-sm font-bold">رجوع</span>
        </button>
        <h1 className="text-white text-2xl font-black">⚙️ الإعدادات</h1>

        {/* User card */}
        {currentUser && (
          <div className="mt-4 bg-white bg-opacity-10 rounded-2xl p-4 flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black text-white flex-shrink-0"
              style={{ background: roleColor }}
            >
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="text-white font-black text-lg">{currentUser.name}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: roleColor + 'aa' }}>
                  {roleLabel}
                </span>
                <span className="text-gray-300 text-xs">{currentUser.wilaya}</span>
                {currentUser.commune && <span className="text-gray-400 text-xs">· {currentUser.commune}</span>}
              </div>
            </div>
            <button
              onClick={() => setEditing(e => !e)}
              className="w-9 h-9 rounded-full bg-white bg-opacity-20 flex items-center justify-center"
            >
              {editing ? <X size={16} color="white" /> : <Edit2 size={16} color="white" />}
            </button>
          </div>
        )}
      </div>

      <div className="px-4 py-5 space-y-4">

        {/* ── Profile Edit Section ── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <button
              onClick={() => setEditing(e => !e)}
              className="flex items-center gap-1 text-sm font-bold"
              style={{ color: editing ? '#ef4444' : '#2D6A4F' }}
            >
              {editing ? <><X size={14} /> إلغاء</> : <><Edit2 size={14} /> تعديل</>}
            </button>
            <div className="flex items-center gap-2">
              <User size={18} className="text-gray-600" />
              <h2 className="font-black text-gray-800">الملف الشخصي</h2>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Name */}
            <div>
              <label className="text-xs font-black text-gray-500 mb-1 block">الاسم الكامل</label>
              {editing ? (
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm font-bold focus:outline-none focus:border-primary-400"
                  placeholder="الاسم الكامل"
                />
              ) : (
                <p className="text-gray-800 font-bold text-sm py-2">{currentUser?.name || '—'}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-black text-gray-500 mb-1 flex items-center gap-1">
                <Phone size={11} /> رقم الهاتف
              </label>
              {editing ? (
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  type="tel"
                  dir="ltr"
                  className="w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm font-mono font-bold focus:outline-none focus:border-primary-400"
                  placeholder="0550 123 456"
                />
              ) : (
                <p className="text-gray-800 font-bold text-sm py-2" dir="ltr">{currentUser?.phone || '—'}</p>
              )}
            </div>

            {/* Wilaya */}
            <div>
              <label className="text-xs font-black text-gray-500 mb-1 flex items-center gap-1">
                <MapPin size={11} /> الولاية
              </label>
              {editing ? (
                <div className="relative">
                  <button
                    onClick={() => setShowWilaya(!showWilaya)}
                    className="w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm font-bold text-right flex items-center justify-between"
                    style={{ color: wilaya ? '#1a1a1a' : '#9ca3af' }}
                  >
                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${showWilaya ? 'rotate-180' : ''}`} />
                    <span>{wilaya || 'اختر الولاية'}</span>
                  </button>
                  {showWilaya && (
                    <div className="absolute top-full right-0 left-0 z-50 bg-white border-2 border-gray-200 rounded-xl shadow-xl mt-1">
                      <div className="p-2 border-b border-gray-100">
                        <input
                          value={wilayaSearch}
                          onChange={e => setWilayaSearch(e.target.value)}
                          placeholder="ابحث..."
                          className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-40 overflow-y-auto">
                        {filteredWilayas.map(w => (
                          <button
                            key={w}
                            onClick={() => { setWilaya(w); setCommune(''); setShowWilaya(false); setWilayaSearch('') }}
                            className="w-full text-right px-3 py-2 text-sm font-bold hover:bg-primary-50 flex items-center justify-between"
                          >
                            <span style={{ color: w === wilaya ? '#2D6A4F' : '#374151' }}>{w}</span>
                            {w === wilaya && <Check size={13} className="text-primary-500" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-800 font-bold text-sm py-2">{currentUser?.wilaya || '—'}</p>
              )}
            </div>

            {/* Commune */}
            <div>
              <label className="text-xs font-black text-gray-500 mb-1 flex items-center gap-1">
                <MapPin size={11} /> البلدية
              </label>
              {editing ? (
                <div className="relative">
                  <button
                    onClick={() => wilaya && setShowCommune(!showCommune)}
                    className="w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm font-bold text-right flex items-center justify-between"
                    style={{ color: commune ? '#1a1a1a' : '#9ca3af', opacity: wilaya ? 1 : 0.5 }}
                  >
                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${showCommune ? 'rotate-180' : ''}`} />
                    <span>{commune || (wilaya ? 'اختر البلدية' : 'اختر الولاية أولاً')}</span>
                  </button>
                  {showCommune && wilaya && (
                    <div className="absolute top-full right-0 left-0 z-50 bg-white border-2 border-gray-200 rounded-xl shadow-xl mt-1">
                      <div className="p-2 border-b border-gray-100">
                        <input
                          value={communeSearch}
                          onChange={e => setCommuneSearch(e.target.value)}
                          placeholder="ابحث عن البلدية..."
                          className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-40 overflow-y-auto">
                        <button
                          onClick={() => { setCommune(''); setShowCommune(false); setCommuneSearch('') }}
                          className="w-full text-right px-3 py-2 text-sm text-gray-400 hover:bg-gray-50"
                        >
                          بدون بلدية
                        </button>
                        {filteredCommunes.map(c => (
                          <button
                            key={c.code}
                            onClick={() => { setCommune(c.nameAr); setShowCommune(false); setCommuneSearch('') }}
                            className="w-full text-right px-3 py-2 text-sm font-bold hover:bg-primary-50 flex items-center justify-between"
                          >
                            <span style={{ color: commune === c.nameAr ? '#2D6A4F' : '#374151' }}>{c.nameAr}</span>
                            {commune === c.nameAr && <Check size={13} className="text-primary-500" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-800 font-bold text-sm py-2">{currentUser?.commune || '—'}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="text-xs font-black text-gray-500 mb-1 flex items-center gap-1">
                <Navigation size={11} /> الموقع الجغرافي
              </label>
              {gpsLat !== 0 && gpsLng !== 0 ? (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-mono" dir="ltr">
                    {gpsLat.toFixed(4)}, {gpsLng.toFixed(4)}
                  </span>
                  <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                    <Check size={12} /> موقع محدد
                  </span>
                </div>
              ) : (
                <p className="text-gray-400 text-sm py-1">لم يتم تحديد الموقع</p>
              )}
              {editing && (
                <button
                  onClick={handleGetLocation}
                  disabled={locLoading}
                  className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white"
                  style={{ background: locLoading ? '#9ca3af' : '#2D6A4F' }}
                >
                  <Navigation size={15} />
                  {locLoading ? 'جارٍ التحديد...' : 'تحديد موقعي الآن'}
                </button>
              )}
            </div>

            {/* Facebook URL */}
            <div>
              <label className="text-xs font-black text-gray-500 mb-1 flex items-center gap-1">
                <span style={{ fontSize: 13 }}>📘</span> رابط فيسبوك / Messenger
              </label>
              {editing ? (
                <input
                  value={facebookUrl}
                  onChange={e => setFacebookUrl(e.target.value.slice(0, 200))}
                  type="url"
                  dir="ltr"
                  className="w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-primary-400"
                  placeholder="https://facebook.com/yourpage"
                />
              ) : (
                <p className="text-gray-800 text-sm py-2 break-all" dir="ltr">
                  {currentUser?.facebookUrl || <span className="text-gray-400">—</span>}
                </p>
              )}
            </div>

            {/* TikTok URL */}
            <div>
              <label className="text-xs font-black text-gray-500 mb-1 flex items-center gap-1">
                <span style={{ fontSize: 13 }}>🎵</span> رابط TikTok
              </label>
              {editing ? (
                <input
                  value={tiktokUrl}
                  onChange={e => setTiktokUrl(e.target.value.slice(0, 200))}
                  type="url"
                  dir="ltr"
                  className="w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-primary-400"
                  placeholder="https://tiktok.com/@yourname"
                />
              ) : (
                <p className="text-gray-800 text-sm py-2 break-all" dir="ltr">
                  {currentUser?.tiktokUrl || <span className="text-gray-400">—</span>}
                </p>
              )}
            </div>

            {/* Save button */}
            {editing && (
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="w-full py-3 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2"
                style={{ background: saving ? '#9ca3af' : '#2D6A4F' }}
              >
                <Save size={16} />
                {saving ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
              </button>
            )}
          </div>
        </div>

        {/* ── Gemini AI Key ── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <Bot size={18} className="text-primary-600" />
            <h2 className="font-black text-gray-800">المساعد الزراعي الذكي</h2>
          </div>
          <div className="p-4 space-y-3">
            <div className="bg-blue-50 rounded-xl p-3 flex gap-3">
              <span className="text-2xl">✨</span>
              <div>
                <p className="font-black text-blue-800 text-sm">Google Gemini AI</p>
                <p className="text-blue-600 text-xs mt-0.5">احصل على مفتاح مجاني من <span className="font-black underline">aistudio.google.com</span></p>
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-gray-600 mb-1.5 flex items-center gap-1">
                <Key size={12} /> مفتاح Gemini API
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    value={keyInput}
                    onChange={e => { setKeyInput(e.target.value); setKeySaved(false) }}
                    type={showKey ? 'text' : 'password'}
                    placeholder="AIzaSy..."
                    className="w-full rounded-xl border-2 border-gray-200 px-3 py-2.5 text-sm font-mono pr-10 focus:outline-none focus:border-primary-400"
                    dir="ltr"
                  />
                  <button onClick={() => setShowKey(p => !p)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {geminiApiKey && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-green-600 font-bold">مفتاح محفوظ ونشط</span>
                </div>
              )}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleSaveKey}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm text-white"
                  style={{ background: keySaved ? '#16a34a' : '#2D6A4F' }}
                >
                  {keySaved ? <Check size={16} /> : <Key size={16} />}
                  {keySaved ? 'تم الحفظ' : 'حفظ المفتاح'}
                </button>
                {geminiApiKey && (
                  <button
                    onClick={() => { setGeminiApiKey(''); setKeyInput(''); showToast('تم حذف المفتاح', 'info') }}
                    className="px-4 py-2.5 rounded-xl border-2 border-red-200 text-red-500 font-bold text-sm flex items-center gap-1"
                  >
                    <Trash2 size={15} /> حذف
                  </button>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
              <p className="text-xs font-black text-gray-700">كيفية الحصول على المفتاح:</p>
              {['افتح aistudio.google.com', 'سجّل دخول بحساب Google', 'اضغط "Get API key" ثم "Create API key"', 'انسخ المفتاح والصقه هنا'].map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary-500 text-white text-xs flex items-center justify-center flex-shrink-0 font-black">{i + 1}</span>
                  <span className="text-xs text-gray-600">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── MB-ID ── */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-2xl p-4">
          <p className="text-green-200 text-xs font-bold mb-1">
            {currentUser?.mbId ? 'رقم ملفك الشخصي (MB-ID)' : 'معرّف حسابك'}
          </p>
          <p className="text-white text-xl font-black tracking-widest break-all" dir="ltr">
            {currentUser?.mbId || (currentUser as any)?._id || currentUser?.id || '—'}
          </p>
          <p className="text-green-200 text-xs mt-1">شارك هذا الرقم مع الوسيط ليتمكن من الربط بحسابك</p>
        </div>

        {/* ── Account Info (read-only) ── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <Star size={18} className="text-yellow-500" />
            <h2 className="font-black text-gray-800">إحصائيات الحساب</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { label: 'نوع الحساب', value: roleLabel },
              { label: 'نقاط الثقة', value: `${currentUser?.trustScore ?? 0} / 5` },
              { label: 'الصفقات المنجزة', value: `${currentUser?.dealsCount ?? 0} صفقة` },
            ].map((item, i) => (
              <div key={i} className="px-4 py-3 flex items-center justify-between">
                <span className="text-gray-800 font-bold text-sm">{item.value}</span>
                <span className="text-gray-500 text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── App info ── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-50">
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-gray-500 text-sm">1.0.0</span>
              <span className="text-gray-700 font-bold text-sm">الإصدار</span>
            </div>
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-green-600 font-bold text-sm">نشط</span>
              <span className="text-gray-700 font-bold text-sm">حالة الخدمة</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => { logout(); navigate('/') }}
          className="w-full py-3.5 bg-red-50 border-2 border-red-200 text-red-600 font-black rounded-2xl text-base"
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  )
}
