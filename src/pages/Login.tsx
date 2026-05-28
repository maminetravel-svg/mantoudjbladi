import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { Phone, Eye, EyeOff, LogIn, RefreshCw, ArrowRight, Lock, Check, ChevronDown } from 'lucide-react'
import { showToast } from '../components/Shared/Toast'
import { apiForgotPassword, apiResetPassword } from '../api/auth'
import { GoogleLogin } from '@react-oauth/google'
import { api, setToken } from '../api/client'
import { getCommunesByWilayaName } from '../data/algeriaLocations'

const TractorSVG = () => (
  <svg viewBox="0 0 120 80" className="w-32 h-20" xmlns="http://www.w3.org/2000/svg">
    <rect x="30" y="20" width="55" height="30" rx="5" fill="#2D6A4F" />
    <rect x="65" y="10" width="25" height="25" rx="4" fill="#1B4332" />
    <rect x="69" y="13" width="17" height="15" rx="3" fill="#87CEEB" opacity="0.8" />
    <rect x="85" y="5" width="4" height="10" rx="2" fill="#15803d" />
    <ellipse cx="87" cy="5" rx="3" ry="2" fill="#16a34a" />
    <circle cx="40" cy="55" r="20" fill="#15803d" stroke="#16a34a" strokeWidth="3" />
    <circle cx="40" cy="55" r="12" fill="#16a34a" />
    <circle cx="40" cy="55" r="5" fill="#15803d" />
    <line x1="40" y1="43" x2="40" y2="35" stroke="#15803d" strokeWidth="2" />
    <line x1="40" y1="67" x2="40" y2="75" stroke="#15803d" strokeWidth="2" />
    <line x1="28" y1="55" x2="20" y2="55" stroke="#15803d" strokeWidth="2" />
    <line x1="52" y1="55" x2="60" y2="55" stroke="#15803d" strokeWidth="2" />
    <circle cx="78" cy="60" r="12" fill="#15803d" stroke="#16a34a" strokeWidth="2" />
    <circle cx="78" cy="60" r="6" fill="#16a34a" />
    <circle cx="78" cy="60" r="3" fill="#15803d" />
    <line x1="5" y1="72" x2="115" y2="72" stroke="#16a34a" strokeWidth="2" />
    <path d="M5 72 Q20 65 35 72 Q50 65 65 72 Q80 65 95 72 Q110 65 115 72" stroke="#2D6A4F" strokeWidth="1.5" fill="none" />
    <circle cx="108" cy="12" r="8" fill="#22c55e" opacity="0.9" />
    <line x1="108" y1="2" x2="108" y2="0" stroke="#22c55e" strokeWidth="1.5" />
    <line x1="118" y1="12" x2="120" y2="12" stroke="#22c55e" strokeWidth="1.5" />
    <line x1="108" y1="22" x2="108" y2="24" stroke="#22c55e" strokeWidth="1.5" />
    <line x1="98" y1="12" x2="96" y2="12" stroke="#22c55e" strokeWidth="1.5" />
    <line x1="8" y1="72" x2="6" y2="60" stroke="#AED581" strokeWidth="1.5" />
    <ellipse cx="6" cy="58" rx="3" ry="5" fill="#7CB342" transform="rotate(-10 6 58)" />
    <line x1="14" y1="72" x2="13" y2="62" stroke="#AED581" strokeWidth="1.5" />
    <ellipse cx="13" cy="60" rx="2" ry="4" fill="#7CB342" transform="rotate(5 13 60)" />
  </svg>
)

type Screen = 'login' | 'forgot_phone' | 'forgot_otp' | 'forgot_reset' | 'google_setup'
type LoginTab = 'login' | 'demo'

const WILAYAS_LIST = [
  '01 - أدرار', '02 - الشلف', '03 - الأغواط', '04 - أم البواقي', '05 - باتنة',
  '06 - بجاية', '07 - بسكرة', '08 - بشار', '09 - البليدة', '10 - البويرة',
  '11 - تمنراست', '12 - تبسة', '13 - تلمسان', '14 - تيارت', '15 - تيزي وزو',
  '16 - الجزائر', '17 - الجلفة', '18 - جيجل', '19 - سطيف', '20 - سعيدة',
  '21 - سكيكدة', '22 - سيدي بلعباس', '23 - عنابة', '24 - قالمة', '25 - قسنطينة',
  '26 - الأبيض مدغاشن', '27 - ورقلة', '28 - وهران', '29 - البيض', '30 - إليزي',
  '31 - برج بوعريريج', '32 - بومرداس', '33 - الطارف', '34 - تندوف', '35 - تيسمسيلت',
  '36 - الوادي', '37 - خنشلة', '38 - سوق أهراس', '39 - تيبازة', '40 - ميلة',
  '41 - عين الدفلى', '42 - النعامة', '43 - عين تموشنت', '44 - غرداية', '45 - غليزان',
  '46 - المنيعة', '47 - تيميمون', '48 - برج باجي مختار',
]

const ROLE_OPTIONS = [
  { value: 'farmer', label: 'فلاح', emoji: '👨‍🌾', desc: 'سجّل محاصيلك وتواصل مع الوسطاء', color: '#d97706' },
  { value: 'buyer',  label: 'مشتري / مصنع', emoji: '🏭', desc: 'تصفح المحاصيل واحجز ما تحتاجه', color: '#2563eb' },
  { value: 'agent',  label: 'وسيط معتمد', emoji: '🤝', desc: 'أدر الفلاحين وسوّق محاصيلهم', color: '#2D6A4F' },
]

export default function Login() {
  const navigate = useNavigate()
  const { loginByPhone, currentUser } = useAppStore()

  // Navigate as soon as currentUser is set — works even in Capacitor WebView
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'agent') navigate('/agent', { replace: true })
      else if (currentUser.role === 'buyer') navigate('/buyer', { replace: true })
      else navigate('/farmer', { replace: true })
    }
  }, [currentUser])

  // Login
  const [tab, setTab] = useState<LoginTab>('login')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // Forgot password flow
  const [screen, setScreen] = useState<Screen>('login')
  const [forgotPhone, setForgotPhone] = useState('')
  const [forgotOtp, setForgotOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const { rehydrateUser } = useAppStore()

  // Google Setup state
  const [googlePending, setGooglePending] = useState<any>(null)
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [selectedWilaya, setSelectedWilaya] = useState<string>('')
  const [googlePhone, setGooglePhone] = useState<string>('')
  const [googleName, setGoogleName] = useState<string>('')
  const [googleCommune, setGoogleCommune] = useState<string>('')
  const [showGoogleCommune, setShowGoogleCommune] = useState(false)
  const [googleCommuneSearch, setGoogleCommuneSearch] = useState('')

  const handleGoogleSuccess = async (data: any) => {
    if (data.needsSetup) {
      setGooglePending(data)
      setGoogleName(data.name || '')
      setScreen('google_setup')
      setLoading(false)
      return
    }
    setToken(data.token)
    await rehydrateUser()
    showToast('✅ أهلاً بعودتك!', 'success')
    setLoading(false)
    const user = useAppStore.getState().currentUser
    if (user?.role === 'agent') navigate('/agent')
    else if (user?.role === 'buyer') navigate('/buyer')
    else navigate('/farmer')
  }

  const handleGoogleSetupComplete = async () => {
    if (!googleName.trim()) {
      showToast('أدخل اسمك', 'error'); return
    }
    if (!selectedRole || !selectedWilaya) {
      showToast('اختر دورك وولايتك', 'error'); return
    }
    if (!googlePhone.trim() || googlePhone.trim().length < 9) {
      showToast('أدخل رقم هاتف صحيح', 'error'); return
    }
    setLoading(true)
    try {
      const data = await api.post<any>('/api/auth/google', {
        idToken: googlePending.idToken,
        wilaya: selectedWilaya.split(' - ')[1] || selectedWilaya,
        role: selectedRole,
        phone: googlePhone.trim(),
        name: googleName.trim(),
        commune: googleCommune,
      })
      setToken(data.token)
      await rehydrateUser()
      showToast('✅ تم إنشاء حسابك بنجاح!', 'success')
      const user = useAppStore.getState().currentUser
      if (user?.role === 'agent') navigate('/agent')
      else if (user?.role === 'buyer') navigate('/buyer')
      else navigate('/farmer')
    } catch (err: any) {
      showToast(err?.message || 'حدث خطأ', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    if (!phone.trim() || phone.length < 9) { showToast('أدخل رقم هاتف صحيح', 'error'); return }
    if (!password.trim()) { showToast('أدخل كلمة المرور', 'error'); return }
    setLoading(true)
    const result = await loginByPhone(phone.trim(), password)
    setLoading(false)
    if (result === 'ok') {
      showToast('✅ أهلاً بعودتك!', 'success')
      const user = useAppStore.getState().currentUser
      const dest = user?.role === 'agent' ? '/agent' : user?.role === 'buyer' ? '/buyer' : '/farmer'
      setTimeout(() => { window.location.replace(dest) }, 300)
    } else if (result === 'wrong_password') {
      showToast('كلمة المرور غير صحيحة', 'error')
    } else if (result === 'not_found') {
      showToast('رقم الهاتف غير مسجل', 'error')
    } else if (result === 'error') {
      showToast('تعذر الاتصال بالخادم', 'error')
    } else {
      showToast(result, 'error')
    }
  }

  const handleDemoLogin = async (phone: string, password: string, role: string) => {
    setLoading(true)
    const result = await loginByPhone(phone, password)
    setLoading(false)
    if (result === 'ok') {
      if (role === 'agent') navigate('/agent')
      else if (role === 'buyer') navigate('/buyer')
      else navigate('/farmer')
    } else {
      showToast('تعذر تسجيل الدخول التجريبي', 'error')
    }
  }

  // ── Forgot password steps ──
  const handleSendForgotOtp = async () => {
    if (!forgotPhone.trim() || forgotPhone.replace(/\D/g, '').length < 9) { showToast('أدخل رقم هاتف صحيح', 'error'); return }
    setLoading(true)
    try {
      await apiForgotPassword(forgotPhone.trim())
      setOtpSent(true)
      setScreen('forgot_otp')
      showToast('📱 تم إرسال رمز التحقق عبر SMS', 'success')
    } catch {
      showToast('تعذر الإرسال، حاول مجدداً', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyForgotOtp = () => {
    if (!forgotOtp || forgotOtp.length < 6) { showToast('أدخل رمز التحقق المكون من 6 أرقام', 'error'); return }
    setScreen('forgot_reset')
  }

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) { showToast('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error'); return }
    if (newPassword !== confirmPassword) { showToast('كلمتا المرور غير متطابقتين', 'error'); return }
    setLoading(true)
    try {
      await apiResetPassword(forgotPhone.trim(), forgotOtp, newPassword)
      showToast('✅ تم تغيير كلمة المرور بنجاح', 'success')
      setPhone(forgotPhone.trim())
      setPassword(newPassword)
      setForgotPhone(''); setForgotOtp(''); setNewPassword(''); setConfirmPassword('')
      setOtpSent(false)
      setScreen('login')
    } catch (err: any) {
      const msg = err?.message || 'رمز التحقق غير صحيح أو منتهي الصلاحية'
      showToast(msg, 'error')
      if (msg.includes('منتهي')) setScreen('forgot_phone')
    } finally {
      setLoading(false)
    }
  }

  const backgroundStyle = {
    background: 'linear-gradient(160deg, #1B4332 0%, #2D6A4F 30%, #16a34a 70%, #15803d 100%)'
  }

  // ════════════════════════════════════════════
  // FORGOT PASSWORD SCREENS
  // ════════════════════════════════════════════
  // ── شاشة اختيار الدور والولاية عند أول تسجيل بـ Google ──
  if (screen === 'google_setup') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #1B4332 0%, #2D6A4F 30%, #16a34a 70%, #15803d 100%)' }}>
        <div className="relative z-10 w-full max-w-sm px-6" dir="rtl">
          <div className="text-center mb-6">
            <p className="text-green-200 text-sm">مرحباً {googlePending?.name} 👋</p>
            <h2 className="text-white font-black text-2xl mt-1">أكمل إنشاء حسابك</h2>
          </div>
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-5 space-y-4">
              {/* الاسم */}
              <div>
                <label className="text-xs font-black text-gray-500 mb-1 block">الاسم الكامل</label>
                <input
                  type="text"
                  value={googleName}
                  onChange={e => setGoogleName(e.target.value)}
                  placeholder="أدخل اسمك"
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary-400 text-right"
                />
              </div>
              {/* اختيار الدور */}
              <div>
                <label className="text-xs font-black text-gray-500 mb-2 block">ما دورك في المنصة؟</label>
                <div className="space-y-2">
                  {ROLE_OPTIONS.map(r => (
                    <button
                      key={r.value}
                      onClick={() => setSelectedRole(r.value)}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-right"
                      style={{
                        borderColor: selectedRole === r.value ? r.color : '#e5e7eb',
                        background: selectedRole === r.value ? r.color + '15' : 'white',
                      }}
                    >
                      <span className="text-2xl">{r.emoji}</span>
                      <div className="flex-1">
                        <p className="font-black text-sm text-gray-800">{r.label}</p>
                        <p className="text-xs text-gray-400">{r.desc}</p>
                      </div>
                      {selectedRole === r.value && <Check size={16} style={{ color: r.color }} />}
                    </button>
                  ))}
                </div>
              </div>
              {/* اختيار الولاية */}
              <div>
                <label className="text-xs font-black text-gray-500 mb-1 block">الولاية</label>
                <select
                  value={selectedWilaya}
                  onChange={e => { setSelectedWilaya(e.target.value); setGoogleCommune('') }}
                  className="w-full rounded-xl border-2 border-gray-200 px-3 py-3 text-sm font-bold focus:outline-none focus:border-primary-400 bg-white"
                >
                  <option value="">-- اختر الولاية --</option>
                  {WILAYAS_LIST.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              {/* البلدية */}
              {selectedWilaya && (() => {
                const wilayaName = selectedWilaya.split(' - ')[1] || selectedWilaya
                const communeList = getCommunesByWilayaName(wilayaName)
                const filtered = communeList.filter(c => c.nameAr.includes(googleCommuneSearch) || c.nameFr.toLowerCase().includes(googleCommuneSearch.toLowerCase()))
                return (
                  <div>
                    <label className="text-xs font-black text-gray-500 mb-1 block">البلدية (اختياري)</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowGoogleCommune(!showGoogleCommune)}
                        className="w-full rounded-xl border-2 border-gray-200 px-3 py-3 text-sm font-bold text-right flex items-center justify-between focus:outline-none focus:border-primary-400"
                        style={{ color: googleCommune ? '#1a1a1a' : '#9ca3af' }}
                      >
                        <ChevronDown size={16} className={`text-gray-400 transition-transform ${showGoogleCommune ? 'rotate-180' : ''}`} />
                        <span>{googleCommune || 'اختر البلدية'}</span>
                      </button>
                      {showGoogleCommune && (
                        <div className="absolute top-full right-0 left-0 z-50 bg-white border-2 border-gray-200 rounded-xl shadow-xl mt-1">
                          <div className="p-2 border-b border-gray-100">
                            <input
                              value={googleCommuneSearch}
                              onChange={e => setGoogleCommuneSearch(e.target.value)}
                              placeholder="ابحث..."
                              className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none"
                              autoFocus
                            />
                          </div>
                          <div className="max-h-40 overflow-y-auto">
                            <button type="button" onClick={() => { setGoogleCommune(''); setShowGoogleCommune(false); setGoogleCommuneSearch('') }}
                              className="w-full text-right px-3 py-2 text-sm text-gray-400 hover:bg-gray-50">بدون بلدية</button>
                            {filtered.map(c => (
                              <button type="button" key={c.code}
                                onClick={() => { setGoogleCommune(c.nameAr); setShowGoogleCommune(false); setGoogleCommuneSearch('') }}
                                className="w-full text-right px-3 py-2 text-sm font-bold hover:bg-primary-50 flex items-center justify-between"
                              >
                                <span style={{ color: googleCommune === c.nameAr ? '#2D6A4F' : '#374151' }}>{c.nameAr}</span>
                                {googleCommune === c.nameAr && <Check size={13} style={{ color: '#2D6A4F' }} />}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })()}
              {/* رقم الهاتف */}
              <div>
                <label className="text-xs font-black text-gray-500 mb-1 block">رقم الهاتف</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={googlePhone}
                    onChange={e => setGooglePhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="05XXXXXXXX"
                    maxLength={10}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary-400 text-right"
                  />
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <button
                onClick={handleGoogleSetupComplete}
                disabled={loading || !googleName.trim() || !selectedRole || !selectedWilaya || googlePhone.length < 9}
                className="w-full py-3.5 rounded-2xl text-white font-black text-base flex items-center justify-center gap-2"
                style={{ background: (loading || !selectedRole || !selectedWilaya) ? '#9ca3af' : '#2D6A4F' }}
              >
                {loading ? <RefreshCw size={18} className="animate-spin" /> : <Check size={18} />}
                {loading ? 'جارٍ الإنشاء...' : 'إنشاء الحساب'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (screen !== 'login') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden" style={backgroundStyle}>
        <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20">
          <svg viewBox="0 0 400 80" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0 80 Q50 60 100 80 Q150 60 200 80 Q250 60 300 80 Q350 60 400 80 L400 80 L0 80Z" fill="#AED581" />
          </svg>
        </div>

        <div className="relative z-10 w-full max-w-sm px-6" dir="rtl">
          {/* Back button */}
          <button
            onClick={() => {
              if (screen === 'forgot_phone') setScreen('login')
              else if (screen === 'forgot_otp') setScreen('forgot_phone')
              else setScreen('forgot_otp')
            }}
            className="flex items-center gap-2 text-white mb-6"
          >
            <ArrowRight size={20} />
            <span className="font-bold text-sm">رجوع</span>
          </button>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-5 pt-6 pb-4 border-b border-gray-100 text-center">
              <div className="text-4xl mb-2">🔑</div>
              <h2 className="font-black text-gray-800 text-xl">استعادة كلمة المرور</h2>
              <p className="text-gray-400 text-xs mt-1">
                {screen === 'forgot_phone' && 'أدخل رقم هاتفك المسجل'}
                {screen === 'forgot_otp' && 'أدخل رمز التحقق المُرسل'}
                {screen === 'forgot_reset' && 'اختر كلمة مرور جديدة'}
              </p>
            </div>

            {/* Step indicators */}
            <div className="flex px-5 pt-4 gap-2">
              {['forgot_phone', 'forgot_otp', 'forgot_reset'].map((s, i) => (
                <div
                  key={s}
                  className="flex-1 h-1.5 rounded-full transition-all"
                  style={{
                    background: screen === s ? '#2D6A4F' :
                      ['forgot_phone', 'forgot_otp', 'forgot_reset'].indexOf(screen) > i ? '#86efac' : '#e5e7eb'
                  }}
                />
              ))}
            </div>

            <div className="p-5 space-y-4">

              {/* ── Step 1: Phone ── */}
              {screen === 'forgot_phone' && (
                <>
                  <div>
                    <label className="text-xs font-black text-gray-500 mb-1 block">رقم الهاتف المسجل</label>
                    <div className="relative">
                      <Phone size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        value={forgotPhone}
                        onChange={e => setForgotPhone(e.target.value.replace(/[^\d+]/g, '').slice(0, 15))}
                        placeholder="0550 123 456 أو +213550123456"
                        type="tel"
                        dir="ltr"
                        className="w-full rounded-xl border-2 border-gray-200 pl-4 pr-10 py-3 text-sm font-mono font-bold focus:outline-none focus:border-primary-400"
                        onKeyDown={e => { if (e.key === 'Enter') handleSendForgotOtp() }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSendForgotOtp}
                    disabled={loading || forgotPhone.replace(/\D/g, '').length < 9}
                    className="w-full py-3.5 rounded-2xl text-white font-black text-base flex items-center justify-center gap-2"
                    style={{ background: (loading || forgotPhone.replace(/\D/g, '').length < 9) ? '#9ca3af' : '#2D6A4F' }}
                  >
                    {loading ? <RefreshCw size={18} className="animate-spin" /> : <Phone size={18} />}
                    {loading ? 'جارٍ الإرسال...' : 'إرسال رمز التحقق'}
                  </button>
                </>
              )}

              {/* ── Step 2: OTP ── */}
              {screen === 'forgot_otp' && (
                <>
                  <div className="text-center py-2">
                    <p className="text-gray-600 text-sm font-bold">
                      أُرسل رمز التحقق إلى <span className="text-primary-600 font-black" dir="ltr">{forgotPhone}</span>
                    </p>
                    <p className="text-gray-400 text-xs mt-1">تحقق من رسائلك، صالح لمدة 15 دقيقة</p>
                  </div>
                  <input
                    value={forgotOtp}
                    onChange={e => setForgotOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="- - - - - -"
                    type="tel"
                    dir="ltr"
                    className="w-full rounded-2xl border-2 border-gray-200 px-4 py-4 text-center text-4xl font-black tracking-widest focus:outline-none focus:border-primary-400"
                    onKeyDown={e => { if (e.key === 'Enter' && forgotOtp.length === 6) handleVerifyForgotOtp() }}
                  />
                  <button
                    onClick={handleVerifyForgotOtp}
                    disabled={forgotOtp.length < 6}
                    className="w-full py-3.5 rounded-2xl text-white font-black text-base flex items-center justify-center gap-2"
                    style={{ background: forgotOtp.length < 6 ? '#9ca3af' : '#2D6A4F' }}
                  >
                    <Check size={18} /> تحقق من الرمز
                  </button>
                  <button
                    onClick={handleSendForgotOtp}
                    disabled={loading}
                    className="w-full text-center text-primary-600 font-bold text-sm py-1"
                  >
                    إعادة إرسال الرمز
                  </button>
                </>
              )}

              {/* ── Step 3: New password ── */}
              {screen === 'forgot_reset' && (
                <>
                  <div>
                    <label className="text-xs font-black text-gray-500 mb-1 flex items-center gap-1">
                      <Lock size={11} /> كلمة المرور الجديدة
                    </label>
                    <div className="relative">
                      <input
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        type={showNew ? 'text' : 'password'}
                        placeholder="6 أحرف على الأقل"
                        className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pl-10 text-sm font-bold focus:outline-none focus:border-primary-400"
                      />
                      <button onClick={() => setShowNew(p => !p)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" type="button">
                        {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-black text-gray-500 mb-1 flex items-center gap-1">
                      <Lock size={11} /> تأكيد كلمة المرور
                    </label>
                    <div className="relative">
                      <input
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="أعد كتابة كلمة المرور"
                        className={`w-full rounded-xl border-2 px-4 py-3 pl-10 text-sm font-bold focus:outline-none transition-colors ${
                          confirmPassword && newPassword !== confirmPassword
                            ? 'border-red-300 focus:border-red-400'
                            : confirmPassword && newPassword === confirmPassword
                            ? 'border-green-300 focus:border-green-400'
                            : 'border-gray-200 focus:border-primary-400'
                        }`}
                      />
                      <button onClick={() => setShowConfirm(p => !p)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" type="button">
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      {confirmPassword && (
                        <div className="absolute left-9 top-1/2 -translate-y-1/2">
                          {newPassword === confirmPassword
                            ? <Check size={14} className="text-green-500" />
                            : <span className="text-red-500 text-xs font-black">✗</span>
                          }
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleResetPassword}
                    disabled={loading || !newPassword || newPassword !== confirmPassword}
                    className="w-full py-3.5 rounded-2xl text-white font-black text-base flex items-center justify-center gap-2"
                    style={{ background: (loading || !newPassword || newPassword !== confirmPassword) ? '#9ca3af' : '#2D6A4F' }}
                  >
                    {loading ? <RefreshCw size={18} className="animate-spin" /> : <Check size={18} />}
                    {loading ? 'جارٍ الحفظ...' : 'حفظ كلمة المرور الجديدة'}
                  </button>
                </>
              )}

            </div>
          </div>
        </div>

      </div>
    )
  }

  // ════════════════════════════════════════════
  // MAIN LOGIN SCREEN
  // ════════════════════════════════════════════
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden" style={backgroundStyle}>
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white opacity-5 -translate-x-32 -translate-y-32" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white opacity-5 translate-x-48 translate-y-48" />
      <div className="absolute bottom-0 left-0 right-0 h-24 opacity-20">
        <svg viewBox="0 0 400 80" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0 80 Q50 60 100 80 Q150 60 200 80 Q250 60 300 80 Q350 60 400 80 L400 80 L0 80Z" fill="#AED581" />
          <path d="M0 80 Q50 70 100 80 Q150 70 200 80 Q250 70 300 80 Q350 70 400 80 L400 80 L0 80Z" fill="#7CB342" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 w-full max-w-sm" dir="rtl">
        <div className="mb-3 drop-shadow-2xl"><TractorSVG /></div>
        <h1 className="text-4xl font-black text-white text-center mb-1 drop-shadow-lg">منتوج فلاح بلادي</h1>
        <div className="flex items-center gap-2 mb-1">
          <div className="h-0.5 w-12 bg-green-300 opacity-70" />
          <span className="text-2xl">🌱</span>
          <div className="h-0.5 w-12 bg-green-300 opacity-70" />
        </div>
        <p className="text-green-200 text-base text-center mb-5 font-semibold">التسويق يبدأ من يوم البذور</p>

        {/* Single form without Tabs */}
        <div className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden mt-2">
          <div className="p-5">
              <div className="space-y-3">
                {/* Phone */}
                <div>
                  <label className="text-xs font-black text-gray-500 mb-1 block">رقم الهاتف</label>
                  <div className="relative">
                    <Phone size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="0550 123 456"
                      type="tel"
                      dir="ltr"
                      className="w-full rounded-xl border-2 border-gray-200 pl-4 pr-10 py-3 text-sm font-mono font-bold focus:outline-none focus:border-primary-400"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <button
                      onClick={() => { setForgotPhone(phone); setScreen('forgot_phone') }}
                      className="text-xs text-primary-500 font-black"
                    >
                      نسيت كلمة المرور؟
                    </button>
                    <label className="text-xs font-black text-gray-500">كلمة المرور</label>
                  </div>
                  <div className="relative">
                    <input
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pl-10 text-sm font-bold focus:outline-none focus:border-primary-400"
                      onKeyDown={e => { if (e.key === 'Enter') handleLogin() }}
                    />
                    <button onClick={() => setShowPassword(p => !p)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" type="button">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Login button */}
                <button
                  onClick={handleLogin}
                  disabled={loading || phone.length < 9 || !password}
                  className="w-full py-3.5 rounded-2xl text-white font-black text-base flex items-center justify-center gap-2 mt-1"
                  style={{ background: (loading || phone.length < 9 || !password) ? '#9ca3af' : '#2D6A4F' }}
                >
                  {loading ? <RefreshCw size={18} className="animate-spin" /> : <LogIn size={18} />}
                  {loading ? 'جارٍ التحقق...' : 'دخول'}
                </button>

                {/* Google Sign-In */}
                <div className="relative flex items-center gap-2 my-1">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-bold">أو</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>
                {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
                  <div className="flex justify-center">
                    <GoogleLogin
                      width="100%"
                      text="signin_with"
                      onSuccess={async (credentialResponse) => {
                        if (!credentialResponse.credential) return
                        setLoading(true)
                        try {
                          const data = await api.post<any>('/api/auth/google', {
                            idToken: credentialResponse.credential,
                          })
                          await handleGoogleSuccess(data)
                        } catch (err: any) {
                          showToast(err?.message || 'فشل الدخول بـ Google', 'error')
                        } finally {
                          setLoading(false)
                        }
                      }}
                      onError={() => showToast('تعذر الاتصال بـ Google', 'error')}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => showToast('سيتم تفعيل الدخول بـ Google قريباً', 'info')}
                    className="w-full py-3 rounded-2xl border-2 border-gray-200 flex items-center justify-center gap-3 font-bold text-sm text-gray-600 opacity-70"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    الدخول بـ Google
                  </button>
                )}

                <div className="text-center pt-1">
                  <p className="text-gray-500 text-sm">
                    مستخدم جديد؟{' '}
                    <button onClick={() => navigate('/register')} className="text-primary-600 font-black">
                      إنشاء حساب مجاناً
                    </button>
                  </p>
                </div>
              </div>
          </div>
        </div>

        <p className="text-white text-opacity-50 text-xs text-center mt-5">منتوج فلاح بلادي</p>
      </div>
      {/* Invisible reCAPTCHA container for Firebase Phone Auth */}
      <div id="recaptcha-container" />
    </div>
  )
}
