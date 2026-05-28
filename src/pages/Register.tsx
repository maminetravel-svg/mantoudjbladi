import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { UserRole, WILAYAS } from '../types'
import { getCommunesByWilayaName } from '../data/algeriaLocations'
import { ArrowRight, Phone, User, MapPin, ChevronDown, Check, Eye, EyeOff, Lock, RefreshCw } from 'lucide-react'
import { showToast } from '../components/Shared/Toast'
import { apiSendRegisterOtp } from '../api/auth'

type Step = 'role' | 'info' | 'otp'

const ROLE_CONFIG = {
  farmer: {
    label: 'فلاح',
    emoji: '👨‍🌾',
    color: '#d97706',
    bg: '#fef3c7',
    border: '#fde68a',
    desc: 'سجّل محاصيلك وتواصل مع الوسطاء والمشترين',
  },
  buyer: {
    label: 'مشتري / مصنع',
    emoji: '🏭',
    color: '#2563eb',
    bg: '#dbeafe',
    border: '#bfdbfe',
    desc: 'تصفح المحاصيل واحجز ما تحتاجه مباشرة',
  },
  agent: {
    label: 'وسيط معتمد',
    emoji: '🤝',
    color: '#2D6A4F',
    bg: '#dcfce7',
    border: '#bbf7d0',
    desc: 'أدر الفلاحين وتعاقد مع المشترين',
  },
}

// FAKE_OTP removed in favor of dynamic generated OTP

const STEPS: Step[] = ['role', 'info', 'otp']
const STEP_LABELS = ['نوع الحساب', 'معلوماتك', 'التحقق']

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAppStore()

  const [step, setStep] = useState<Step>('role')
  const [role, setRole] = useState<UserRole | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [wilaya, setWilaya] = useState('')
  const [commune, setCommune] = useState('')
  const [showWilaya, setShowWilaya] = useState(false)
  const [wilayaSearch, setWilayaSearch] = useState('')
  const [showCommune, setShowCommune] = useState(false)
  const [communeSearch, setCommuneSearch] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  const stepIndex = STEPS.indexOf(step)

  const filteredWilayas = WILAYAS.filter(w => w.includes(wilayaSearch))
  const communes = getCommunesByWilayaName(wilaya)
  const filteredCommunes = communes.filter(c => c.nameAr.includes(communeSearch) || c.nameFr.toLowerCase().includes(communeSearch.toLowerCase()))

  const handleRoleSelect = (r: UserRole) => {
    setRole(r)
    setStep('info')
  }

  const validateInfo = () => {
    if (!name.trim() || name.trim().length < 3) {
      showToast('الاسم يجب أن يكون 3 أحرف على الأقل', 'error'); return false
    }
    if (!phone.trim() || phone.length < 9) {
      showToast('أدخل رقم هاتف صحيح (9 أرقام على الأقل)', 'error'); return false
    }
    if (!password || password.length < 6) {
      showToast('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error'); return false
    }
    if (password !== confirmPassword) {
      showToast('كلمتا المرور غير متطابقتين', 'error'); return false
    }
    if (!wilaya) {
      showToast('اختر ولايتك', 'error'); return false
    }
    return true
  }

  const handleSendOtp = async () => {
    if (!validateInfo()) return
    setLoading(true)
    try {
      await apiSendRegisterOtp(phone.trim())
      setStep('otp')
      showToast('✅ تم إرسال رمز التحقق إلى هاتفك', 'success')
    } catch (e: any) {
      const msg = e.message || ''
      if (msg.includes('مسجل مسبقاً') || msg.includes('PHONE_EXISTS')) {
        showToast('رقم الهاتف مسجل مسبقاً', 'error')
      } else {
        showToast('فشل إرسال الرمز، تحقق من رقم الهاتف وحاول مجدداً', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    setLoading(true)
    const result = await register(name.trim(), phone.trim(), password, wilaya, role!, commune, otp)
    setLoading(false)
    if (result === 'phone_taken') {
      showToast('رقم الهاتف مسجل مسبقاً — إذا سجّل وسيط حسابك، اضغط "نسيت كلمة المرور" في صفحة الدخول', 'error')
      setStep('info')
      navigate('/login')
      return
    }
    if (typeof result === 'string') {
      showToast(result, 'error')
      return
    }
    showToast(`✅ مرحباً ${(result as any).name}! تم إنشاء حسابك`, 'success')
    const r = result as any
    if (r.role === 'agent') navigate('/agent')
    else if (r.role === 'buyer') navigate('/buyer')
    else navigate('/farmer')
  }

  const goBack = () => {
    if (step === 'role') navigate('/')
    else if (step === 'info') setStep('role')
    else setStep('info')
  }

  const passwordStrength = () => {
    if (!password) return null
    if (password.length < 6) return { label: 'ضعيفة', color: '#ef4444', width: '33%' }
    if (password.length < 10 && !/[0-9]/.test(password)) return { label: 'متوسطة', color: '#f59e0b', width: '66%' }
    return { label: 'قوية', color: '#22c55e', width: '100%' }
  }
  const strength = passwordStrength()

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(160deg, #1B4332 0%, #2D6A4F 40%, #16a34a 100%)' }}
      dir="rtl"
    >
      {/* Header */}
      <div className="px-4 pt-12 pb-5 flex items-center gap-3">
        <button
          onClick={goBack}
          className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center"
        >
          <ArrowRight size={20} color="white" />
        </button>
        <div>
          <h1 className="text-white font-black text-xl">إنشاء حساب جديد</h1>
          <p className="text-green-200 text-sm">{STEP_LABELS[stepIndex]}</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="px-6 mb-5">
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all ${
                  step === s ? 'bg-white text-primary-700 shadow-lg' :
                  i < stepIndex ? 'bg-green-400 text-white' :
                  'bg-white bg-opacity-20 text-white text-opacity-50'
                }`}>
                  {i < stepIndex ? <Check size={14} /> : i + 1}
                </div>
                <span className={`text-xs font-bold ${step === s ? 'text-white' : 'text-white text-opacity-50'}`}>
                  {STEP_LABELS[i]}
                </span>
              </div>
              {i < 2 && (
                <div className={`flex-1 h-0.5 rounded mb-4 ${i < stepIndex ? 'bg-green-400' : 'bg-white bg-opacity-20'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 bg-white rounded-t-3xl px-5 pt-6 pb-10 overflow-y-auto">

        {/* ── Step 1: Role ── */}
        {step === 'role' && (
          <div className="space-y-3">
            <p className="text-gray-500 text-sm font-bold mb-4 text-center">أنا أنضم كـ:</p>
            {(Object.entries(ROLE_CONFIG) as [UserRole, typeof ROLE_CONFIG.farmer][]).map(([r, cfg]) => (
              <button
                key={r}
                onClick={() => handleRoleSelect(r)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all active:scale-95 hover:shadow-md"
                style={{ borderColor: cfg.border, background: cfg.bg }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-sm"
                  style={{ background: cfg.color + '22' }}
                >
                  {cfg.emoji}
                </div>
                <div className="text-right flex-1">
                  <div className="font-black text-lg" style={{ color: cfg.color }}>{cfg.label}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{cfg.desc}</div>
                </div>
                <div style={{ color: cfg.color }} className="text-2xl font-black">←</div>
              </button>
            ))}

            <div className="text-center pt-2">
              <p className="text-gray-500 text-sm">
                لديك حساب؟{' '}
                <button onClick={() => navigate('/')} className="text-primary-600 font-black">
                  سجّل الدخول
                </button>
              </p>
            </div>
          </div>
        )}

        {/* ── Step 2: Info ── */}
        {step === 'info' && role && (
          <div className="space-y-4">
            {/* Role badge */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl inline-flex mb-1"
              style={{ background: ROLE_CONFIG[role].bg, border: `1px solid ${ROLE_CONFIG[role].border}` }}
            >
              <span className="text-lg">{ROLE_CONFIG[role].emoji}</span>
              <span className="font-black text-sm" style={{ color: ROLE_CONFIG[role].color }}>
                {ROLE_CONFIG[role].label}
              </span>
              <button
                onClick={() => setStep('role')}
                className="text-xs font-bold mr-1 opacity-60 hover:opacity-100"
                style={{ color: ROLE_CONFIG[role].color }}
              >
                (تغيير)
              </button>
            </div>

            {/* Name */}
            <div>
              <label className="text-xs font-black text-gray-600 mb-1.5 flex items-center gap-1">
                <User size={12} /> الاسم الكامل
              </label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="مثال: يوسف عطلاوي"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary-400"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-black text-gray-600 mb-1.5 flex items-center gap-1">
                <Phone size={12} /> رقم الهاتف
              </label>
              <div className="relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">+213</span>
                <input
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="0550 123 456"
                  type="tel"
                  dir="ltr"
                  className="w-full rounded-xl border-2 border-gray-200 pl-4 pr-14 py-3 text-sm font-mono font-bold focus:outline-none focus:border-primary-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-black text-gray-600 mb-1.5 flex items-center gap-1">
                <Lock size={12} /> كلمة المرور
              </label>
              <div className="relative">
                <input
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="6 أحرف على الأقل"
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 pr-4 pl-10 text-sm font-bold focus:outline-none focus:border-primary-400"
                />
                <button
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  type="button"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Password strength bar */}
              {strength && (
                <div className="mt-1.5">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: strength.width, background: strength.color }}
                    />
                  </div>
                  <p className="text-xs font-bold mt-0.5" style={{ color: strength.color }}>
                    قوة كلمة المرور: {strength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-black text-gray-600 mb-1.5 flex items-center gap-1">
                <Lock size={12} /> تأكيد كلمة المرور
              </label>
              <div className="relative">
                <input
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="أعد كتابة كلمة المرور"
                  className={`w-full rounded-xl border-2 px-4 py-3 pl-10 text-sm font-bold focus:outline-none transition-colors ${
                    confirmPassword && password !== confirmPassword
                      ? 'border-red-300 focus:border-red-400'
                      : confirmPassword && password === confirmPassword
                      ? 'border-green-300 focus:border-green-400'
                      : 'border-gray-200 focus:border-primary-400'
                  }`}
                />
                <button
                  onClick={() => setShowConfirm(p => !p)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  type="button"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {confirmPassword && (
                  <div className="absolute left-9 top-1/2 -translate-y-1/2">
                    {password === confirmPassword
                      ? <Check size={14} className="text-green-500" />
                      : <span className="text-red-500 text-xs font-black">✗</span>
                    }
                  </div>
                )}
              </div>
            </div>

            {/* Wilaya */}
            <div>
              <label className="text-xs font-black text-gray-600 mb-1.5 flex items-center gap-1">
                <MapPin size={12} /> الولاية
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowWilaya(!showWilaya)}
                  className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-bold text-right flex items-center justify-between focus:outline-none focus:border-primary-400"
                  style={{ color: wilaya ? '#1a1a1a' : '#9ca3af' }}
                >
                  <ChevronDown size={16} className={`text-gray-400 transition-transform ${showWilaya ? 'rotate-180' : ''}`} />
                  <span>{wilaya || 'اختر ولايتك'}</span>
                </button>
                {showWilaya && (
                  <div className="absolute top-full right-0 left-0 z-50 bg-white border-2 border-gray-200 rounded-xl shadow-xl mt-1">
                    <div className="p-2 border-b border-gray-100">
                      <input
                        value={wilayaSearch}
                        onChange={e => setWilayaSearch(e.target.value)}
                        placeholder="ابحث عن الولاية..."
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-primary-400"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-44 overflow-y-auto">
                      {filteredWilayas.map(w => (
                        <button
                          key={w}
                          onClick={() => { setWilaya(w); setCommune(''); setShowWilaya(false); setWilayaSearch('') }}
                          className="w-full text-right px-4 py-2.5 text-sm font-bold hover:bg-primary-50 transition-colors flex items-center justify-between"
                        >
                          <span style={{ color: w === wilaya ? '#2D6A4F' : '#374151' }}>{w}</span>
                          {w === wilaya && <Check size={14} className="text-primary-500" />}
                        </button>
                      ))}
                      {filteredWilayas.length === 0 && (
                        <p className="text-center text-gray-400 text-sm py-4">لا توجد نتائج</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Commune */}
            {wilaya && (
              <div>
                <label className="text-xs font-black text-gray-600 mb-1.5 flex items-center gap-1">
                  <MapPin size={12} /> البلدية
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowCommune(!showCommune)}
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-bold text-right flex items-center justify-between focus:outline-none focus:border-primary-400"
                    style={{ color: commune ? '#1a1a1a' : '#9ca3af' }}
                  >
                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${showCommune ? 'rotate-180' : ''}`} />
                    <span>{commune || 'اختر البلدية (اختياري)'}</span>
                  </button>
                  {showCommune && (
                    <div className="absolute top-full right-0 left-0 z-50 bg-white border-2 border-gray-200 rounded-xl shadow-xl mt-1">
                      <div className="p-2 border-b border-gray-100">
                        <input
                          value={communeSearch}
                          onChange={e => setCommuneSearch(e.target.value)}
                          placeholder="ابحث عن البلدية..."
                          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-primary-400"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-44 overflow-y-auto">
                        <button
                          onClick={() => { setCommune(''); setShowCommune(false); setCommuneSearch('') }}
                          className="w-full text-right px-4 py-2.5 text-sm text-gray-400 hover:bg-gray-50"
                        >
                          بدون بلدية
                        </button>
                        {filteredCommunes.map(c => (
                          <button
                            key={c.code}
                            onClick={() => { setCommune(c.nameAr); setShowCommune(false); setCommuneSearch('') }}
                            className="w-full text-right px-4 py-2.5 text-sm font-bold hover:bg-primary-50 transition-colors flex items-center justify-between"
                          >
                            <span style={{ color: commune === c.nameAr ? '#2D6A4F' : '#374151' }}>{c.nameAr}</span>
                            {commune === c.nameAr && <Check size={14} className="text-primary-500" />}
                          </button>
                        ))}
                        {filteredCommunes.length === 0 && (
                          <p className="text-center text-gray-400 text-sm py-4">لا توجد نتائج</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Send OTP button */}
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl text-white font-black text-base mt-2 flex items-center justify-center gap-2"
              style={{ background: loading ? '#9ca3af' : '#2D6A4F' }}
            >
              {loading ? (
                <><RefreshCw size={18} className="animate-spin" /> جارٍ التحقق...</>
              ) : (
                <><Phone size={18} /> إرسال رمز التحقق</>
              )}
            </button>
          </div>
        )}

        {/* ── Step 3: OTP ── */}
        {step === 'otp' && (
          <div className="space-y-5">
            <div className="text-center py-4">
              <div className="text-6xl mb-3">📱</div>
              <p className="font-black text-gray-800 text-xl">أدخل رمز التحقق</p>
              <p className="text-gray-500 text-sm mt-2">
                أُرسل رمز إلى{' '}
                <span className="font-black text-primary-600" dir="ltr">{phone}</span>
              </p>
              <button
                onClick={() => setStep('info')}
                className="text-xs text-gray-400 font-bold mt-1 underline"
              >
                تغيير الرقم
              </button>
            </div>



            {/* OTP input */}
            <input
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="- - - - - -"
              type="tel"
              dir="ltr"
              className="w-full rounded-2xl border-2 border-gray-200 px-4 py-4 text-center text-4xl font-black tracking-widest focus:outline-none focus:border-primary-400"
              onKeyDown={e => { if (e.key === 'Enter' && otp.length === 6) handleVerify() }}
            />

            {/* Verify button */}
            <button
              onClick={handleVerify}
              disabled={otp.length < 6}
              className="w-full py-3.5 rounded-2xl text-white font-black text-base flex items-center justify-center gap-2"
              style={{ background: otp.length < 6 ? '#9ca3af' : '#2D6A4F' }}
            >
              <Check size={18} />
              تأكيد وإنشاء الحساب
            </button>

            {/* Resend */}
            <button
              onClick={handleSendOtp}
              className="w-full py-2 text-primary-600 font-bold text-sm flex items-center justify-center gap-1"
            >
              <RefreshCw size={14} />
              إعادة إرسال الرمز
            </button>
          </div>
        )}

        {/* Login link (footer) */}
        {step !== 'role' && (
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              لديك حساب؟{' '}
              <button onClick={() => navigate('/')} className="text-primary-600 font-black">
                سجّل الدخول
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
