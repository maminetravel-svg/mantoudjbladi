import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import { Lock, Phone, Eye, EyeOff, RefreshCw } from 'lucide-react'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { loginByPhone, currentUser } = useAppStore()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Already logged in as admin
  if (currentUser && (currentUser as any).isAdmin) {
    navigate('/app-admin', { replace: true })
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone || !password) { setError('أدخل رقم الهاتف وكلمة المرور'); return }
    setError('')
    setLoading(true)
    const result = await loginByPhone(phone.trim(), password)
    setLoading(false)
    if (result === 'ok') {
      const user = useAppStore.getState().currentUser
      if (user && (user as any).isAdmin) {
        navigate('/app-admin', { replace: true })
      } else {
        // Not admin — log out and show error
        useAppStore.getState().logout()
        setError('ليس لديك صلاحية الوصول إلى لوحة التحكم')
      }
    } else if (result === 'wrong_password') {
      setError('كلمة المرور غير صحيحة')
    } else if (result === 'not_found') {
      setError('رقم الهاتف غير مسجل')
    } else {
      setError('حدث خطأ، حاول مجدداً')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)' }}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="relative w-full max-w-md px-6">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white bg-opacity-10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-white border-opacity-20">
            <span className="text-4xl">🌾</span>
          </div>
          <h1 className="text-white text-2xl font-black tracking-wide">منتوج فلاح بلادي</h1>
          <p className="text-blue-300 text-sm mt-1 font-medium">لوحة التحكم — الإدارة</p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-7 border border-white border-opacity-15 shadow-2xl"
        >
          <h2 className="text-white font-black text-lg mb-5 text-center">تسجيل دخول المشرف</h2>

          {/* Phone */}
          <div className="mb-4">
            <label className="text-blue-200 text-xs font-bold mb-1.5 block">رقم الهاتف</label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="05XXXXXXXX"
                dir="ltr"
                autoComplete="username"
                className="w-full rounded-xl bg-white bg-opacity-15 border border-white border-opacity-20 px-4 py-3 text-white placeholder-blue-300 placeholder-opacity-60 font-bold focus:outline-none focus:border-blue-400 focus:bg-opacity-20"
              />
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" />
            </div>
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="text-blue-200 text-xs font-bold mb-1.5 block">كلمة المرور</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full rounded-xl bg-white bg-opacity-15 border border-white border-opacity-20 px-4 py-3 pr-11 text-white placeholder-blue-300 placeholder-opacity-60 font-bold focus:outline-none focus:border-blue-400 focus:bg-opacity-20"
              />
              <Lock size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 bg-red-500 bg-opacity-20 border border-red-400 border-opacity-40 rounded-xl px-4 py-2.5 text-red-200 text-sm font-bold text-center">
              ⚠️ {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl font-black text-white flex items-center justify-center gap-2 transition-all"
            style={{ background: loading ? 'rgba(255,255,255,0.2)' : 'linear-gradient(135deg, #1d4ed8, #2563eb)' }}
          >
            {loading ? <RefreshCw size={18} className="animate-spin" /> : <Lock size={18} />}
            {loading ? 'جارٍ التحقق...' : 'دخول'}
          </button>
        </form>

        <p className="text-center text-blue-400 text-xs mt-6 opacity-60">
          منتوج فلاح بلادي © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
