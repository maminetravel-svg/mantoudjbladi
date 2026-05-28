import React, { useState, useRef, useEffect, lazy, Suspense } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import { EquipmentCategory, EQUIPMENT_CATEGORIES, WILAYAS } from '../../types'
import { compressImage } from '../../utils/imageCompression'
import { Camera, Plus, Trash2, Video, Image as ImageIcon, Check, MapPin } from 'lucide-react'
import { apiUploadVideo } from '../../api/uploads'
import { showToast } from '../../components/Shared/Toast'

const MapPicker = lazy(() => import('../../components/Shared/MapPicker'))

const CATEGORY_EMOJIS: Record<EquipmentCategory, string> = {
  'معدات ري': '💧',
  'جرارات': '🚜',
  'بيوت بلاستيكية': '🏠',
  'أسمدة': '🌿',
  'بذور': '🌱',
}

export default function EditEquipment() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { currentUser, updateEquipment, equipment, equipmentTypeImages } = useAppStore()

  const [name, setName] = useState('')
  const [category, setCategory] = useState<EquipmentCategory | ''>('')
  const [pricePerDay, setPricePerDay] = useState('')
  const [wilaya, setWilaya] = useState('')
  const [phone, setPhone] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [videos, setVideos] = useState<string[]>([])
  const [coverMediaType, setCoverMediaType] = useState<'image' | 'video'>('image')
  const [gpsLat, setGpsLat] = useState<number | null>(null)
  const [gpsLng, setGpsLng] = useState<number | null>(null)
  const [showMapPicker, setShowMapPicker] = useState(false)
  const [compressing, setCompressing] = useState(false)
  const [videoLoading, setVideoLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const videoGalleryRef = useRef<HTMLInputElement>(null)
  const videoCameraRef = useRef<HTMLInputElement>(null)

  const existingEq = equipment.find(e => e.id === id)

  useEffect(() => {
    if (existingEq) {
      setCategory(existingEq.category)
      setName(existingEq.name)
      setDescription(existingEq.description)
      setPricePerDay(existingEq.pricePerDay ? existingEq.pricePerDay.toString() : '')
      setWilaya(existingEq.wilaya)
      setPhone(existingEq.phone)
      setImages(existingEq.images ?? [])
      setVideos(existingEq.videos ?? [])
      setCoverMediaType(existingEq.coverMediaType ?? 'image')
      setGpsLat(existingEq.gpsLat ?? null)
      setGpsLng(existingEq.gpsLng ?? null)
    }
  }, [existingEq])

  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')
  const basePath = isAdmin ? '/admin' : currentUser?.role === 'buyer' ? '/buyer' : currentUser?.role === 'farmer' ? '/farmer' : '/agent'

  const handleAddImage = async (file: File) => {
    setCompressing(true)
    try {
      const result = await compressImage(file)
      setImages(prev => [...prev, result.base64])
    } catch {
      const reader = new FileReader()
      reader.onload = e => setImages(prev => [...prev, e.target?.result as string])
      reader.readAsDataURL(file)
    } finally {
      setCompressing(false)
    }
  }

  const handleAddVideo = async (file: File) => {
    setVideoLoading(true)
    try {
      const url = await apiUploadVideo(file)
      setVideos(prev => {
        const next = [...prev, url]
        if (images.length === 0) setCoverMediaType('video')
        return next
      })
    } catch (e: any) {
      alert(e.message || 'فشل رفع الفيديو')
    } finally {
      setVideoLoading(false)
    }
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'اسم المعدة مطلوب'
    if (!category) e.category = 'نوع المعدة مطلوب'
    if (!wilaya) e.wilaya = 'الولاية مطلوبة'
    if (!phone.trim()) e.phone = 'رقم الهاتف مطلوب'
    if (!description.trim()) e.description = 'الوصف مطلوب'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      await updateEquipment(id!, {
        category: category as EquipmentCategory,
        name,
        description,
        pricePerDay: pricePerDay ? parseInt(pricePerDay) : undefined,
        wilaya,
        phone,
        images,
        videos,
        coverMediaType,
        gpsLat: gpsLat ?? undefined,
        gpsLng: gpsLng ?? undefined,
      })
      showToast('تم حفظ التعديلات بنجاح ✅')
      navigate(`${basePath}/equipment`)
    } catch (err) {
      console.error(err)
      showToast('حدث خطأ أثناء تعديل الإعلان', 'error')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-sage-50 pb-24" dir="rtl">
      <div
        className="px-4 pt-10 pb-5"
        style={{ background: 'linear-gradient(135deg, #2D6A4F 0%, #1B4332 100%)' }}
      >
        <button onClick={() => navigate(-1)} className="text-white mb-3 flex items-center gap-1">
          {/* <ArrowRight size={20} /> */}
          <span className="text-sm font-bold">رجوع</span>
        </button>
        <h1 className="text-white text-2xl font-black">🔧 تعديل معدة / أداة</h1>
        <p className="text-sage-300 text-sm mt-1">عدّل تفاصيل إعلانك</p>
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-5 space-y-5">
        {/* Category */}
        <div>
          <label className="block text-gray-700 font-black mb-2 text-base">نوع المعدة</label>
          <div className="grid grid-cols-3 gap-2">
            {EQUIPMENT_CATEGORIES.map(cat => (
              <button
                type="button"
                key={cat}
                onClick={() => setCategory(cat)}
                className={`relative rounded-2xl overflow-hidden transition-all aspect-square flex flex-col items-center justify-center p-2 pb-3 ${
                  category === cat
                    ? 'ring-2 ring-primary-500 shadow-lg scale-95'
                    : 'border border-gray-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-1'
                }`}
              >
                {/* Visual Area */}
                <div className="absolute inset-0 z-0 p-2 pb-8">
                  <div className="w-full h-full bg-sage-50/50 rounded-xl flex items-center justify-center overflow-hidden">
                    {equipmentTypeImages[cat] ? (
                      <img src={equipmentTypeImages[cat]} alt={cat} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <span className="text-6xl drop-shadow-md">{CATEGORY_EMOJIS[cat] || '⚙️'}</span>
                    )}
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="relative z-20 mt-auto">
                  <span className={`block px-4 py-1.5 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.08)] text-xs font-black transition-colors ${
                    category === cat
                        ? 'bg-primary-500 text-white'
                        : 'bg-white/95 backdrop-blur-sm text-gray-800 border border-gray-100'
                  }`}>
                    {cat}
                  </span>
                </div>
              </button>
            ))}
          </div>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        {/* Name */}
        <div>
          <label className="block text-gray-700 font-black mb-1.5 text-base">اسم المعدة / الإعلان</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="مثال: بيع وتركيب بيوت بلاستيكية"
            className={`w-full border-2 rounded-xl px-4 py-3 text-right text-base bg-white focus:outline-none focus:border-primary-500 ${
              errors.name ? 'border-red-400' : 'border-gray-200'
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-black mb-1.5 text-base">الوصف</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            placeholder="اكتب وصفاً مفصلاً للمعدة أو الخدمة..."
            className={`w-full border-2 rounded-xl px-4 py-3 text-right text-base bg-white focus:outline-none focus:border-primary-500 resize-none ${
              errors.description ? 'border-red-400' : 'border-gray-200'
            }`}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Price */}
        <div>
          <label className="block text-gray-700 font-black mb-1.5 text-base">السعر (دج) - اختياري</label>
          <input
            type="number"
            value={pricePerDay}
            onChange={e => setPricePerDay(e.target.value)}
            placeholder="اتركه فارغاً إذا كان قابلاً للتفاوض"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-right text-base bg-white focus:outline-none focus:border-primary-500"
          />
        </div>

        {/* Wilaya */}
        <div>
          <label className="block text-gray-700 font-black mb-1.5 text-base">الولاية</label>
          <select
            value={wilaya}
            onChange={e => setWilaya(e.target.value)}
            className={`w-full border-2 rounded-xl px-4 py-3 text-right text-base bg-white focus:outline-none focus:border-primary-500 ${
              errors.wilaya ? 'border-red-400' : 'border-gray-200'
            }`}
          >
            <option value="">اختر الولاية</option>
            {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
          {errors.wilaya && <p className="text-red-500 text-sm mt-1">{errors.wilaya}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-700 font-black mb-1.5 text-base">رقم الهاتف</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="0550000000"
            className={`w-full border-2 rounded-xl px-4 py-3 text-right text-base bg-white focus:outline-none focus:border-primary-500 ${
              errors.phone ? 'border-red-400' : 'border-gray-200'
            }`}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-800 text-base mb-3 flex items-center gap-2">
            <Camera size={16} className="text-primary-600" />
            صور المعدة ({images.length})
          </h3>
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-3">
              {images.map((img, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden">
                  <img src={img} className="w-full h-24 object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-1 left-1 bg-red-500 text-white rounded-full p-1"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={compressing}
            className="w-full border-2 border-dashed border-primary-300 bg-primary-50 rounded-xl py-4 flex items-center justify-center gap-2"
          >
            {compressing ? (
              <><div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /><span className="text-primary-600 font-bold text-sm">جاري الضغط...</span></>
            ) : (
              <><Plus size={18} className="text-primary-600" /><span className="text-primary-700 font-bold text-sm">إضافة صورة</span></>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => { Array.from(e.target.files || []).forEach(f => handleAddImage(f)); e.target.value = '' }} />
        </div>

        {/* Videos */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <label className="block text-gray-700 font-black mb-2 text-base">
            <Video size={16} className="inline ml-1 text-red-500" />
            فيديوهات توضيحية للمعدة ({videos.length})
          </label>

          {videos.length > 0 && (
            <div className="space-y-2 mb-2">
              {videos.map((v, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden bg-black">
                  <video src={v} controls className="w-full rounded-xl max-h-48 object-cover" />
                  <button
                    type="button"
                    onClick={() => setVideos(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1 shadow z-10"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => videoGalleryRef.current?.click()}
              disabled={videoLoading}
              className="border-2 border-dashed border-red-300 bg-red-50 rounded-xl py-4 flex flex-col items-center justify-center gap-1.5 hover:bg-red-100 transition-all"
            >
              {videoLoading ? (
                <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-2xl">📁</span>
                  <span className="text-red-700 font-bold text-sm">إرفاق فيديو</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => videoCameraRef.current?.click()}
              disabled={videoLoading}
              className="border-2 border-dashed border-red-300 bg-red-50 rounded-xl py-4 flex flex-col items-center justify-center gap-1.5 hover:bg-red-100 transition-all"
            >
              {videoLoading ? (
                <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-2xl">🎥</span>
                  <span className="text-red-700 font-bold text-sm">تصوير فيديو</span>
                </>
              )}
            </button>
          </div>
          <input
            ref={videoGalleryRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleAddVideo(f); e.target.value = '' }}
          />
          <input
            ref={videoCameraRef}
            type="file"
            accept="video/*"
            capture="environment"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleAddVideo(f); e.target.value = '' }}
          />
        </div>

        {/* Cover media selector */}
        {images.length > 0 && videos.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-black text-gray-800 text-base mb-3">🎯 ما يظهر أولاً في البطاقة</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCoverMediaType('image')}
                className="rounded-2xl p-4 flex flex-col items-center gap-2 border-2 transition-all"
                style={{
                  borderColor: coverMediaType === 'image' ? '#22c55e' : '#e5e7eb',
                  background: coverMediaType === 'image' ? '#f0fdf4' : '#fff',
                }}
              >
                <ImageIcon size={28} className={coverMediaType === 'image' ? 'text-green-600' : 'text-gray-400'} />
                <span className={`font-black text-sm ${coverMediaType === 'image' ? 'text-green-700' : 'text-gray-500'}`}>صورة</span>
                {coverMediaType === 'image' && (
                  <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setCoverMediaType('video')}
                className="rounded-2xl p-4 flex flex-col items-center gap-2 border-2 transition-all"
                style={{
                  borderColor: coverMediaType === 'video' ? '#ef4444' : '#e5e7eb',
                  background: coverMediaType === 'video' ? '#fff5f5' : '#fff',
                }}
              >
                <Video size={28} className={coverMediaType === 'video' ? 'text-red-500' : 'text-gray-400'} />
                <span className={`font-black text-sm ${coverMediaType === 'video' ? 'text-red-600' : 'text-gray-500'}`}>فيديو</span>
                {coverMediaType === 'video' && (
                  <span className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* GPS Location */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-800 text-base mb-3 flex items-center gap-2">
            <MapPin size={16} className="text-primary-600" />
            الموقع على الخريطة (اختياري)
          </h3>
          {gpsLat ? (
            <div className="flex items-center justify-between bg-green-50 rounded-xl px-3 py-2">
              <button type="button" onClick={() => setShowMapPicker(true)} className="text-xs text-primary-600 font-bold underline">تغيير</button>
              <span className="text-green-700 font-bold text-sm">{gpsLat.toFixed(4)}°N, {gpsLng!.toFixed(4)}°E</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowMapPicker(true)}
              className="w-full border-2 border-dashed border-primary-300 bg-primary-50 rounded-xl py-4 flex items-center justify-center gap-2 text-primary-700 font-bold text-sm"
            >
              <MapPin size={18} />
              تحديد الموقع على الخريطة
            </button>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-500 text-white rounded-2xl py-4 font-black text-xl shadow-lg hover:bg-primary-600 active:scale-95 transition-all disabled:opacity-60"
        >
          {loading ? 'جاري الحفظ...' : 'حفظ التعديلات 🔧'}
        </button>
      </form>

      {showMapPicker && (
        <Suspense fallback={null}>
          <MapPicker
            lat={gpsLat}
            lng={gpsLng}
            onChange={(lat, lng) => { setGpsLat(lat); setGpsLng(lng); setShowMapPicker(false) }}
            onClose={() => setShowMapPicker(false)}
          />
        </Suspense>
      )}
    </div>
  )
}
