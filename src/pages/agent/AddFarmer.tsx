import React, { useState, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import { WILAYAS as WILAYA_NAMES } from '../../types'
import { WILAYAS } from '../../data/algeriaLocations'
import { ArrowRight, MapPin, Phone, User, Check, Map } from 'lucide-react'

const MapPicker = lazy(() => import('../../components/Shared/MapPicker'))

const WILAYA_COORDS: Record<string, [number, number]> = {
  'أدرار': [27.87, -0.29], 'الشلف': [36.16, 1.33], 'الأغواط': [33.8, 2.86],
  'أم البواقي': [35.88, 7.11], 'باتنة': [35.56, 6.17], 'بجاية': [36.75, 5.07],
  'بسكرة': [34.85, 5.73], 'بشار': [31.62, -2.22], 'البليدة': [36.47, 2.83],
  'البويرة': [36.37, 3.9], 'تمنراست': [22.78, 5.52], 'تبسة': [35.4, 8.12],
  'تلمسان': [34.88, -1.32], 'تيارت': [35.37, 1.32], 'تيزي وزو': [36.72, 4.05],
  'الجزائر': [36.74, 3.06], 'الجلفة': [34.67, 3.26], 'جيجل': [36.82, 5.77],
  'سطيف': [36.19, 5.41], 'سعيدة': [34.83, 0.15], 'سكيكدة': [36.88, 6.9],
  'سيدي بلعباس': [35.19, -0.64], 'عنابة': [36.9, 7.77], 'قالمة': [36.46, 7.43],
  'قسنطينة': [36.37, 6.61], 'المدية': [36.26, 2.75], 'مستغانم': [35.94, 0.09],
  'المسيلة': [35.7, 4.54], 'معسكر': [35.4, 0.14], 'ورقلة': [31.95, 5.33],
  'وهران': [35.7, -0.63], 'البيض': [33.69, 1.01], 'إليزي': [26.52, 8.47],
  'برج بوعريريج': [36.07, 4.76], 'بومرداس': [36.76, 3.48], 'الطارف': [36.77, 8.31],
  'تندوف': [27.67, -8.14], 'تيسمسيلت': [35.61, 1.81], 'الوادي': [33.37, 6.86],
  'خنشلة': [35.44, 7.14], 'سوق أهراس': [36.28, 7.95], 'تيبازة': [36.6, 2.47],
  'ميلة': [36.45, 6.26], 'عين الدفلى': [36.26, 1.97], 'النعامة': [33.27, -0.31],
  'عين تموشنت': [35.3, -1.14], 'غرداية': [32.49, 3.67], 'غليزان': [35.97, 0.57],
}

function getCommunesForWilaya(wilayaName: string) {
  const w = WILAYAS.find(w => w.nameAr === wilayaName)
  return w?.communes ?? []
}

export default function AddFarmer() {
  const navigate = useNavigate()
  const { addFarmer } = useAppStore()

  const [form, setForm] = useState({
    name: '',
    phone: '',
    wilaya: '',
    commune: '',
    specialization: '',
  })
  const [gpsLat, setGpsLat] = useState<number | null>(null)
  const [gpsLng, setGpsLng] = useState<number | null>(null)
  const [showMapPicker, setShowMapPicker] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = 'الاسم مطلوب'
    if (!form.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب'
    else if (!/^0[5-7]\d{8}$/.test(form.phone)) newErrors.phone = 'رقم الهاتف غير صحيح'
    if (!form.wilaya) newErrors.wilaya = 'الولاية مطلوبة'
    return newErrors
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // Fallback to wilaya coordinates if no GPS selected
    const wilayaCoords = form.wilaya ? WILAYA_COORDS[form.wilaya] : null
    const finalLat = gpsLat ?? wilayaCoords?.[0] ?? 36.5
    const finalLng = gpsLng ?? wilayaCoords?.[1] ?? 3.0

    addFarmer({
      name: form.name,
      phone: form.phone,
      wilaya: form.wilaya,
      commune: form.commune,
      specialization: form.specialization,
      gpsLat: finalLat,
      gpsLng: finalLng,
      trustScore: 4.0,
      dealsCompleted: 0,
    })

    setSubmitted(true)
    setTimeout(() => navigate('/agent'), 1500)
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sage-50" dir="rtl">
        <div className="text-center px-6">
          <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Check size={48} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-primary-700">تم تسجيل الفلاح!</h2>
          <p className="text-gray-500 mt-2">سيتم مزامنة البيانات تلقائياً</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sage-50" dir="rtl">
      {/* Header */}
      <div
        className="px-4 pt-10 pb-5"
        style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' }}
      >
        <button onClick={() => navigate(-1)} className="text-white mb-3 flex items-center gap-1">
          <ArrowRight size={20} />
          <span className="text-sm font-bold">رجوع</span>
        </button>
        <h1 className="text-white text-2xl font-black">👨‍🌾 تسجيل فلاح جديد</h1>
        <p className="text-earth-200 text-sm mt-1">أضف فلاحاً إلى شبكتك</p>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-5 space-y-4">
        {/* Name */}
        <div>
          <label className="block text-gray-700 font-black mb-1.5 text-base">
            <User size={16} className="inline ml-1 text-primary-500" />
            الاسم الكامل
          </label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="مثال: محمد بن عيسى"
            className={`w-full border-2 rounded-xl px-4 py-3 text-right text-base bg-white focus:outline-none focus:border-primary-500 transition-colors ${
              errors.name ? 'border-red-400' : 'border-gray-200'
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-700 font-black mb-1.5 text-base">
            <Phone size={16} className="inline ml-1 text-primary-500" />
            رقم الهاتف
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            placeholder="0550 000 000"
            className={`w-full border-2 rounded-xl px-4 py-3 text-right text-base bg-white focus:outline-none focus:border-primary-500 transition-colors ${
              errors.phone ? 'border-red-400' : 'border-gray-200'
            }`}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        {/* Wilaya */}
        <div>
          <label className="block text-gray-700 font-black mb-1.5 text-base">
            الولاية
          </label>
          <select
            value={form.wilaya}
            onChange={e => setForm({ ...form, wilaya: e.target.value, commune: '' })}
            className={`w-full border-2 rounded-xl px-4 py-3 text-right text-base bg-white focus:outline-none focus:border-primary-500 transition-colors ${
              errors.wilaya ? 'border-red-400' : 'border-gray-200'
            }`}
          >
            <option value="">اختر الولاية</option>
            {WILAYA_NAMES.map(w => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
          {errors.wilaya && <p className="text-red-500 text-sm mt-1">{errors.wilaya}</p>}
        </div>

        {/* Commune */}
        {form.wilaya && (
          <div>
            <label className="block text-gray-700 font-black mb-1.5 text-base">
              البلدية
            </label>
            <select
              value={form.commune}
              onChange={e => setForm({ ...form, commune: e.target.value })}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-right text-base bg-white focus:outline-none focus:border-primary-500 transition-colors"
            >
              <option value="">اختر البلدية</option>
              {getCommunesForWilaya(form.wilaya).map(c => (
                <option key={c.code} value={c.nameAr}>{c.nameAr}</option>
              ))}
            </select>
          </div>
        )}

        {/* Specialization */}
        <div>
          <label className="block text-gray-700 font-black mb-1.5 text-base">
            التخصص الفلاحي
          </label>
          <input
            type="text"
            value={form.specialization}
            onChange={e => setForm({ ...form, specialization: e.target.value })}
            placeholder="مثال: طماطم وفلفل"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-right text-base bg-white focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>

        {/* Map Location (optional) */}
        <div>
          <label className="block text-gray-700 font-black mb-1.5 text-base">
            <MapPin size={16} className="inline ml-1 text-primary-500" />
            الموقع الجغرافي
            <span className="text-gray-400 font-normal text-sm mr-2">(اختياري)</span>
          </label>

          {gpsLat ? (
            <div className="border-2 border-green-400 bg-green-50 rounded-xl p-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowMapPicker(true)}
                className="text-green-600 text-sm font-bold underline"
              >
                تغيير
              </button>
              <div className="flex items-center gap-2 text-green-700 font-bold">
                <Check size={16} className="text-green-500" />
                <span className="text-sm">{gpsLat}°N, {gpsLng}°E</span>
                <MapPin size={16} />
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowMapPicker(true)}
              className="w-full border-2 border-dashed border-primary-300 bg-primary-50 rounded-xl px-4 py-5 flex flex-col items-center gap-2 hover:bg-primary-100 transition-all"
            >
              <Map size={28} className="text-primary-500" />
              <span className="font-black text-primary-700 text-base">حدد موقع الفلاح على الخريطة</span>
              <span className="text-xs text-gray-400">اضغط لفتح الخريطة — إذا تركته فارغاً سيُستخدم موقع الولاية</span>
            </button>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white rounded-2xl py-4 font-black text-xl shadow-lg hover:bg-earth-600 active:scale-95 transition-all mt-4"
        >
          تسجيل الفلاح 👨‍🌾
        </button>
      </form>

      {/* Map Picker Modal */}
      {showMapPicker && (
        <Suspense fallback={
          <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white font-bold">جاري تحميل الخريطة...</div>
          </div>
        }>
          <MapPicker
            lat={gpsLat}
            lng={gpsLng}
            onChange={(lat, lng) => { setGpsLat(lat); setGpsLng(lng) }}
            onClose={() => setShowMapPicker(false)}
          />
        </Suspense>
      )}
    </div>
  )
}
