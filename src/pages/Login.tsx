import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { Phone, Eye, EyeOff, LogIn, RefreshCw, ArrowRight, Lock, Check, ChevronDown, Download, Users, Globe, Wrench } from 'lucide-react'
import { showToast } from '../components/Shared/Toast'
import { apiForgotPassword, apiResetPassword } from '../api/auth'
import { GoogleLogin } from '@react-oauth/google'
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth'
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
  const isCapacitor = import.meta.env.VITE_CAPACITOR === 'true'

  // Landing & Stats states
  const [stats, setStats] = useState({ crops: 0, equipment: 0, lands: 0, farmers: 0, wilayas: 48 })
  const [landingConfig, setLandingConfig] = useState<Record<string, { labelAr: string; isActive: boolean }>>({
    heroTitle: { labelAr: 'منصة منتوج بلادي الرقمية', isActive: true },
    heroSubtitle: { labelAr: 'التسويق يبدأ من يوم البذور. منصتكم الموثوقة لتسويق وتصفح المحاصيل الفلاحية والمعدات والأراضي الفلاحية في الجزائر.', isActive: true },
    apkUrl: { labelAr: '/apk/mantoudj-bladi.apk', isActive: true },
    showStats: { labelAr: 'true', isActive: true },
    contactPhone: { labelAr: '0555000000', isActive: true },
  })

  // Fetch configs and stats on mount
  useEffect(() => {
    api.get<any[]>('/api/config/landing')
      .then(items => {
        if (items && Array.isArray(items)) {
          const cfg: any = {}
          items.forEach(item => {
            cfg[item.key] = { labelAr: item.labelAr, isActive: item.isActive }
          })
          setLandingConfig(prev => ({ ...prev, ...cfg }))
        }
      })
      .catch(err => console.warn('Failed to load landing config:', err))

    api.get<any>('/api/public-stats')
      .then(data => {
        if (data) setStats(data)
      })
      .catch(err => console.warn('Failed to load public stats:', err))
  }, [])

  useEffect(() => {
    if (isCapacitor) {
      try {
        GoogleAuth.initialize()
      } catch (e) {
        console.warn('GoogleAuth initialization warning:', e)
      }
    }
  }, [])

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

  const handleNativeGoogleLogin = async () => {
    setLoading(true)
    try {
      const user = await GoogleAuth.signIn()
      if (!user || !user.authentication.idToken) {
        throw new Error('لم يتم استلام كود التعريف من قوقل')
      }
      const data = await api.post<any>('/api/auth/google', {
        idToken: user.authentication.idToken,
      })
      await handleGoogleSuccess(data)
    } catch (err: any) {
      console.error('[Native Google Sign-in Error]', err)
      const errMsg = err?.message || ''
      if (err?.code === '12501' || errMsg.includes('cancel') || errMsg.includes('canceled')) {
        // User cancelled
      } else {
        showToast(errMsg || 'فشل الدخول بـ Google', 'error')
      }
    } finally {
      setLoading(false)
    }
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
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f0fdf4]" dir="rtl">
      {/* ── Left/Right Split: Showcase & Branding (Desktop: 60%, Mobile: stacked top) ── */}
      <div
        className="w-full md:w-3/5 min-h-[500px] md:min-h-screen relative flex flex-col justify-between p-4 md:py-8 md:px-10 text-white overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 10% 20%, #2d8a55 0%, #1b633a 65%, #0e3d23 100%)'
        }}
      >
        {/* Floating brand-colored gradient glow balls for premium SaaS look */}
        <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] rounded-full bg-emerald-500 opacity-20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-amber-500 opacity-15 blur-[120px] pointer-events-none" />
        <div className="absolute top-[35%] left-[15%] w-[250px] h-[250px] rounded-full bg-red-500 opacity-10 blur-[100px] pointer-events-none" />

        {/* Brand Top Header */}
        <div className="relative z-10 flex items-center justify-end">
          <div className="text-xs font-black px-4.5 py-2.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-emerald-300">
            النسخة v1.2
          </div>
        </div>

        {/* Hero Area + Live Mockup */}
        <div className="relative z-10 my-auto flex flex-col lg:flex-row items-center gap-8 md:gap-10 py-4 md:py-4">
          {/* Hero text side */}
          <div className="flex-1 text-right space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-black animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>عالم فلاحي متكامل بين يديك</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
              {landingConfig.heroTitle?.labelAr || 'منصة منتوج بلادي الرقمية'}
            </h1>

            <p className="text-gray-300 text-sm md:text-base leading-relaxed font-medium">
              {landingConfig.heroSubtitle?.labelAr || 'التسويق يبدأ من يوم البذور. منصتكم الموثوقة لتسويق وتصفح المحاصيل الفلاحية والمعدات والأراضي الفلاحية في الجزائر.'}
            </p>

            {/* Features checkmarks list */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 flex-shrink-0">
                  <Check size={14} className="stroke-[3]" />
                </div>
                <span className="text-sm font-bold text-gray-200">تواصل مباشر وسريع بين الفلاح والمشتري بدون أي عمولات</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 flex-shrink-0">
                  <Check size={14} className="stroke-[3]" />
                </div>
                <span className="text-sm font-bold text-gray-200">تسويق المحاصيل والبحث عن العتاد والأراضي الفلاحية بكل سهولة</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 flex-shrink-0">
                  <Check size={14} className="stroke-[3]" />
                </div>
                <span className="text-sm font-bold text-gray-200">تصفح وعروض فورية تشمل 58 ولاية جزائرية بدعم كامل باللغة العربية</span>
              </div>
            </div>

            {/* Android badge and support buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href={landingConfig.apkUrl?.labelAr || '/apk/mantoudj-bladi.apk'}
                className="flex items-center gap-3 bg-white hover:bg-emerald-50 border-2 border-emerald-400/20 text-emerald-950 px-5 py-3 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-950/20 group"
                download
              >
                <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                  <Download size={20} className="stroke-[3]" />
                </div>
                <div className="text-right font-sans">
                  <span className="text-[10px] text-emerald-700/80 block font-black">تحميل مباشر لنظام أندرويد</span>
                  <span className="text-sm font-black block text-emerald-900">تطبيق الـ APK</span>
                </div>
              </a>

              <a
                href={`tel:${landingConfig.contactPhone?.labelAr || '0555000000'}`}
                className="flex items-center gap-3 bg-white hover:bg-emerald-50 border-2 border-emerald-400/20 text-emerald-950 px-5 py-3 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-950/20 group"
              >
                <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                  <Phone size={20} className="stroke-[3]" />
                </div>
                <div className="text-right font-sans">
                  <span className="text-[10px] text-emerald-700/80 block font-black">الدعم الفني والتقني</span>
                  <span className="text-sm font-black block text-emerald-900 font-mono">
                    {landingConfig.contactPhone?.labelAr || '0555000000'}
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Interactive CSS App Mockup (Hidden on small screens) */}
          <div className="hidden lg:block relative flex-shrink-0">
            {/* Glow effect behind the phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-[450px] bg-emerald-500/20 rounded-full blur-[70px] pointer-events-none" />

            {/* Smart Phone Wrapper */}
            <div className="w-[260px] h-[510px] bg-zinc-950 rounded-[40px] p-[8px] border-4 border-zinc-800 shadow-2xl relative">
              {/* Speaker / Notch area */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full flex items-center justify-between px-4 z-30">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                <div className="w-16 h-1 bg-zinc-800 rounded-full" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-950 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>

              {/* Mock Screen Content */}
              <div className="w-full h-full bg-[#f8fafc] rounded-[40px] overflow-hidden relative border border-black/50 flex flex-col justify-between" dir="rtl">
                {/* Mock Status Bar */}
                <div className="bg-emerald-700 text-white text-[9px] px-6 pt-6.5 pb-2 flex justify-between items-center z-20 font-sans">
                  <span>09:41</span>
                  <div className="flex items-center gap-1">
                    <span>5G</span>
                    <div className="w-3.5 h-1.5 border border-white rounded-xs p-px flex items-center">
                      <div className="w-full h-full bg-white rounded-3xs" />
                    </div>
                  </div>
                </div>

                {/* Mock App Header */}
                <div className="bg-emerald-600 text-white px-4 py-2.5 flex items-center justify-between shadow-sm z-20">
                  <div className="flex items-center gap-2">
                    <img src="/app_icon.png" alt="Icon" className="w-8 h-8 rounded-lg bg-white p-0.5 object-contain" />
                    <div>
                      <span className="font-extrabold text-xs block text-white">منتوج بلادي</span>
                      <span className="text-[8px] text-emerald-200 block">سوق فلاحي مباشر</span>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px]">👤</div>
                </div>

                {/* Scrollable Feed Mock */}
                <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#f8fafc]">
                  {/* Banner */}
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-3 text-white text-right space-y-1 shadow-sm">
                    <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-bold">جديد 🌾</span>
                    <p className="font-extrabold text-[11px]">سوق الفلاحة الجزائري المباشر</p>
                    <p className="text-[8px] text-emerald-100">تصفح المحاصيل، العتاد والأراضي الفلاحية</p>
                  </div>

                  {/* Listings Title */}
                  <div className="flex items-center justify-between text-right px-1">
                    <span className="text-[10px] font-black text-gray-800">أحدث العروض المعروضة</span>
                    <span className="text-[8px] text-emerald-600 font-bold">عرض الكل</span>
                  </div>

                  {/* Mock Item 1 */}
                  <div className="bg-white rounded-xl p-2.5 border border-gray-100 shadow-xs flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-lg shadow-sm">🍅</div>
                    <div className="flex-1 text-right">
                      <h4 className="font-black text-[11px] text-gray-800">طماطم بومرداس حمراء</h4>
                      <p className="text-[8px] text-gray-400">الكمية: 15 قنطار • بلدية لقاطة</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-[8px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-sm font-bold">محصول فلاحي</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-600">جديد</span>
                  </div>

                  {/* Mock Item 2 */}
                  <div className="bg-white rounded-xl p-2.5 border border-gray-100 shadow-xs flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-lg shadow-sm">🥔</div>
                    <div className="flex-1 text-right">
                      <h4 className="font-black text-[11px] text-gray-800">بطاطا الوادي ممتازة</h4>
                      <p className="text-[8px] text-gray-400">الكمية: 40 قنطار • قمار</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-[8px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-sm font-bold">طلب حجز</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-600">نشط</span>
                  </div>

                  {/* Mock Item 3 */}
                  <div className="bg-white rounded-xl p-2.5 border border-gray-100 shadow-xs flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-lg shadow-sm">🍊</div>
                    <div className="flex-1 text-right">
                      <h4 className="font-black text-[11px] text-gray-800">برتقال الحمضيات معسكر</h4>
                      <p className="text-[8px] text-gray-400">الكمية: 10 قنطار • سيق</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-[8px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-sm font-bold">عرض بيع</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-600">قريب</span>
                  </div>
                </div>

                {/* Navbar */}
                <div className="bg-white border-t border-gray-100 px-4 py-2 flex justify-between items-center text-center text-gray-400 z-20">
                  <div className="flex-1 text-emerald-600">
                    <div className="text-xs">🌾</div>
                    <span className="text-[8px] font-bold">المحاصيل</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-400">🚜</div>
                    <span className="text-[8px]">العتاد</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-400">🗺️</div>
                    <span className="text-[8px]">الأراضي</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-400">🔔</div>
                    <span className="text-[8px]">التنبيهات</span>
                  </div>
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-zinc-300 rounded-full z-30" />
              </div>
            </div>
          </div>
        </div>

        {/* Showcase Footer (Stats Dashboard Panel) */}
        {landingConfig.showStats?.labelAr !== 'false' && (
          <div className="relative z-10 pt-6 border-t border-white/10">
            <div className="space-y-3">
              <p className="text-xs font-bold text-emerald-400 tracking-wide uppercase">أرقام المنصة الحية 📈</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {/* Crops */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-right backdrop-blur-md hover:bg-white/10 transition-all duration-350 group">
                  <span className="text-xl mb-1 block group-hover:scale-110 transition-transform">🌾</span>
                  <span className="text-lg md:text-xl font-black block font-mono text-white tracking-tight">
                    {stats.crops}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">محصول معروض</span>
                </div>

                {/* Farmers */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-right backdrop-blur-md hover:bg-white/10 transition-all duration-350 group">
                  <span className="text-xl mb-1 block group-hover:scale-110 transition-transform">👨‍🌾</span>
                  <span className="text-lg md:text-xl font-black block font-mono text-white tracking-tight">
                    {stats.farmers}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">فلاح مسجل</span>
                </div>

                {/* Equipment */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-right backdrop-blur-md hover:bg-white/10 transition-all duration-350 group">
                  <span className="text-xl mb-1 block group-hover:scale-110 transition-transform">🚜</span>
                  <span className="text-lg md:text-xl font-black block font-mono text-white tracking-tight">
                    {stats.equipment}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">معدة زراعية</span>
                </div>

                {/* Lands */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-right backdrop-blur-md hover:bg-white/10 transition-all duration-350 group">
                  <span className="text-xl mb-1 block group-hover:scale-110 transition-transform">🗺️</span>
                  <span className="text-lg md:text-xl font-black block font-mono text-white tracking-tight">
                    {stats.lands}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">أرض معروضة</span>
                </div>

                {/* Wilayas */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-right backdrop-blur-md hover:bg-white/10 transition-all duration-350 col-span-2 sm:col-span-1">
                  <span className="text-xl mb-1 block">📍</span>
                  <span className="text-lg md:text-xl font-black block font-mono text-white tracking-tight">
                    {stats.wilayas}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">ولاية مغطاة</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Small desktop copyrights */}
        <div className="relative z-10 flex justify-between items-center text-[10px] text-white/40 mt-6 pt-4 border-t border-white/5">
          <span>جميع الحقوق محفوظة © {new Date().getFullYear()} منتوج فلاح بلادي</span>
          <span>التسويق يبدأ من يوم البذور</span>
        </div>
      </div>

      {/* ── Right Side: Authentication Forms (Desktop: 40%, Mobile: stacked bottom) ── */}
      <div
        className="w-full md:w-2/5 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #e8f5e9 100%)'
        }}
      >
        <div className="w-full max-w-md space-y-6 relative z-10">
          {/* Clean glassmorphic card for Login form */}
          <div className="bg-white/80 rounded-3xl shadow-xl border border-white/60 pt-4 pb-6 px-6 md:pt-6 md:pb-8 md:px-8 backdrop-blur-lg">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center -mt-2 -mb-4 md:-mt-4 md:-mb-8 overflow-hidden">
                <img
                  src="/logo_mfb.png"
                  alt="منتوج فلاح بلادي"
                  className="h-40 md:h-56 w-auto object-contain drop-shadow-md filter brightness-105"
                />
              </div>
              <h2 className="font-black text-gray-800 text-xl">تسجيل الدخول للمنصة</h2>
              <p className="text-gray-450 text-xs mt-1">مرحباً بك مجدداً في سوقك الفلاحي الرقمي</p>
            </div>

            {/* Elegant Segmented Controls for tabs */}
            <div className="flex p-1 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 mb-6">
              <button
                onClick={() => setTab('login')}
                className={`flex-1 py-2.5 rounded-xl font-black text-sm transition-all duration-200 ${
                  tab === 'login'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                تسجيل الدخول
              </button>
              <button
                onClick={() => setTab('demo')}
                className={`flex-1 py-2.5 rounded-xl font-black text-sm transition-all duration-200 ${
                  tab === 'demo'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                نسخة تجريبية
              </button>
            </div>

            {/* TAB: Standard Login */}
            {tab === 'login' && (
              <div className="space-y-4">
                {/* Phone number */}
                <div>
                  <label className="text-xs font-black text-gray-500 mb-1.5 block">رقم الهاتف</label>
                  <div className="relative">
                    <Phone size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="0550 123 456"
                      type="tel"
                      dir="ltr"
                      className="w-full rounded-2xl border-2 border-gray-150 pl-4 pr-11 py-3 text-sm font-mono font-bold focus:outline-none focus:border-emerald-500 transition-colors bg-gray-50/50 focus:bg-white text-right"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <button
                      onClick={() => {
                        setForgotPhone(phone)
                        setScreen('forgot_phone')
                      }}
                      className="text-xs text-emerald-600 font-extrabold hover:text-emerald-700 transition-colors"
                    >
                      نسيت كلمة المرور؟
                    </button>
                    <label className="text-xs font-black text-gray-500">كلمة المرور</label>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border-2 border-gray-150 pl-11 pr-11 py-3 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-colors bg-gray-50/50 focus:bg-white text-right"
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleLogin()
                      }}
                    />
                    <button
                      onClick={() => setShowPassword(p => !p)}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      type="button"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  onClick={handleLogin}
                  disabled={loading || phone.length < 9 || !password}
                  className="w-full py-4 rounded-2xl text-white font-black text-base flex items-center justify-center gap-2 mt-2 transition-all duration-300 shadow-lg shadow-emerald-700/20 active:scale-[0.98]"
                  style={{
                    background: (loading || phone.length < 9 || !password)
                      ? '#cbd5e1'
                      : 'linear-gradient(135deg, #15803d, #22c55e)'
                  }}
                >
                  {loading ? <RefreshCw size={18} className="animate-spin" /> : <LogIn size={18} />}
                  {loading ? 'جارٍ التحقق...' : 'تسجيل الدخول'}
                </button>

                {/* Social Google divider */}
                <div className="relative flex items-center gap-2 my-4">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-[10px] text-gray-400 font-bold">أو الدخول عبر</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Google Sign-in */}
                {isCapacitor ? (
                  <button
                    onClick={handleNativeGoogleLogin}
                    disabled={loading}
                    className="w-full py-3.5 rounded-2xl border border-gray-200 flex items-center justify-center gap-3 font-bold text-sm text-gray-700 bg-white hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    حساب Google
                  </button>
                ) : import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
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
                    className="w-full py-3.5 rounded-2xl border border-gray-200 flex items-center justify-center gap-3 font-bold text-sm text-gray-400 opacity-60 bg-white"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    حساب Google
                  </button>
                )}
              </div>
            )}

            {/* TAB: Demo accounts selection */}
            {tab === 'demo' && (
              <div className="space-y-3.5">
                <p className="text-xs text-gray-400 font-bold text-center mb-2">
                  سجل دخولك بنقرة واحدة لتجربة المنصة بأدوار مختلفة:
                </p>

                {/* Farmer */}
                <button
                  onClick={() => handleDemoLogin('0550123456', 'farmer123', 'farmer')}
                  disabled={loading}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-amber-200 bg-amber-50/20 hover:bg-amber-50 hover:border-amber-400 active:scale-[0.99] transition-all duration-200 text-right group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">👨‍🌾</span>
                    <div className="text-right">
                      <span className="text-sm font-black text-gray-800 block">فلاح جزائري (تجريبي)</span>
                      <span className="text-[10px] text-gray-400 block">عرض المحاصيل وإدارة الأرض الفلاحية</span>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-amber-600 rotate-180 transition-transform group-hover:translate-x-[-4px]" />
                </button>

                {/* Buyer */}
                <button
                  onClick={() => handleDemoLogin('0550123457', 'buyer123', 'buyer')}
                  disabled={loading}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-blue-200 bg-blue-50/20 hover:bg-blue-50 hover:border-blue-400 active:scale-[0.99] transition-all duration-200 text-right group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">🏭</span>
                    <div className="text-right">
                      <span className="text-sm font-black text-gray-800 block">مشتري / مصنع (تجريبي)</span>
                      <span className="text-[10px] text-gray-400 block">تصفح العروض، الطلب والشراء المباشر</span>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-blue-600 rotate-180 transition-transform group-hover:translate-x-[-4px]" />
                </button>

                {/* Agent */}
                <button
                  onClick={() => handleDemoLogin('0550123458', 'agent123', 'agent')}
                  disabled={loading}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50/20 hover:bg-emerald-50 hover:border-emerald-400 active:scale-[0.99] transition-all duration-200 text-right group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">🤝</span>
                    <div className="text-right">
                      <span className="text-sm font-black text-gray-800 block">وسيط معتمد (تجريبي)</span>
                      <span className="text-[10px] text-gray-400 block">متابعة الفلاحين، إحصائيات وعمولات</span>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-emerald-600 rotate-180 transition-transform group-hover:translate-x-[-4px]" />
                </button>
              </div>
            )}

            {/* Bottom Actions Registration link */}
            <div className="text-center pt-4 mt-6 border-t border-gray-100/80">
              <p className="text-gray-500 text-sm">
                مستخدم جديد؟{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-emerald-600 font-extrabold hover:underline transition-all"
                >
                  إنشاء حساب مجاناً
                </button>
              </p>
            </div>
          </div>

          {/* Support call for mobile views */}
          <div className="block md:hidden text-center py-2">
            <a
              href={`tel:${landingConfig.contactPhone?.labelAr || '0555000000'}`}
              className="inline-flex items-center gap-2 text-emerald-800 text-xs font-black bg-white/60 border border-emerald-100 px-4 py-2 rounded-xl backdrop-blur-xs"
            >
              <span>📞 الدعم الفني:</span>
              <span className="font-mono">{landingConfig.contactPhone?.labelAr || '0555000000'}</span>
            </a>
          </div>

          {/* Small copyrights for mobile view */}
          <p className="text-gray-400 text-[9px] text-center block md:hidden">
            جميع الحقوق محفوظة © {new Date().getFullYear()} منتوج فلاح بلادي
          </p>
        </div>
      </div>

      {/* Invisible reCAPTCHA container for Firebase Phone Auth */}
      <div id="recaptcha-container" />
    </div>
  )
}
