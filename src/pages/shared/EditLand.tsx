import React, { useState, useRef, lazy, Suspense, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import { LandGoal, PriceType, WILAYAS, LAND_DOCUMENTS, LAND_FEATURES } from '../../types'
import { compressImage } from '../../utils/imageCompression'
import { ArrowRight, Check, MapPin, Map, Camera, Plus, Trash2, Video, Image as ImageIcon } from 'lucide-react'
import { apiUploadVideo } from '../../api/uploads'
import { showToast } from '../../components/Shared/Toast'

const MapPicker = lazy(() => import('../../components/Shared/MapPicker'))

export default function EditLand() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { currentUser, updateLand, lands } = useAppStore()

  const [area, setArea] = useState('')
  const [wilaya, setWilaya] = useState('')
  const [documents, setDocuments] = useState('')
  const [features, setFeatures] = useState<string[]>([])
  const [price, setPrice] = useState('')
  const [priceType, setPriceType] = useState<PriceType>('قابل للتفاوض')
  const [goal, setGoal] = useState<LandGoal>('بيع')
  const [description, setDescription] = useState('')
  const [phone, setPhone] = useState('')
  const [gpsLat, setGpsLat] = useState<number | null>(null)
  const [gpsLng, setGpsLng] = useState<number | null>(null)
  const [showMapPicker, setShowMapPicker] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [videos, setVideos] = useState<string[]>([])
  const [coverMediaType, setCoverMediaType] = useState<'image' | 'video'>('image')
  const [compressing, setCompressing] = useState(false)
  const [videoLoading, setVideoLoading] = useState(false)
  const [loading, setLoading] = useState(false) // Changed submitted to loading
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileRef = useRef<HTMLInputElement>(null)
  const videoGalleryRef = useRef<HTMLInputElement>(null)
  const videoCameraRef = useRef<HTMLInputElement>(null)

  const existingLand = lands.find(l => l.id === id)

  useEffect(() => {
    if (existingLand) {
      setArea(existingLand.area.toString())
      setWilaya(existingLand.wilaya)
      setGoal(existingLand.goal)
      setPriceType(existingLand.priceType ?? 'ثابت')
      setPrice(existingLand.price ? existingLand.price.toString() : '')
      setDescription(existingLand.description)
      setPhone(existingLand.phone || '')
      setDocuments(Array.isArray(existingLand.documents) ? existingLand.documents[0] || '' : existingLand.documents)
      setFeatures(existingLand.features)
      setGpsLat(existingLand.gpsLat || null)
      setGpsLng(existingLand.gpsLng || null)
      setImages(existingLand.images ?? [])
      setVideos(existingLand.videos ?? [])
      setCoverMediaType(existingLand.coverMediaType ?? 'image')
    }
  }, [existingLand])

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

  const toggleFeature = (f: string) => {
    setFeatures(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!area || parseFloat(area) <= 0) e.area = 'المساحة مطلوبة'
    if (!wilaya) e.wilaya = 'الولاية مطلوبة'
    if (!documents) e.documents = 'نوع الوثائق مطلوب'
    if (!description.trim()) e.description = 'الوصف مطلوب'
    if (!phone.trim()) e.phone = 'رقم الهاتف مطلوب'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      await updateLand(id!, {
        area: parseFloat(area),
        wilaya,
        documents,
        features,
        price: price ? parseFloat(price) : 0,
        priceType,
        goal,
        description,
        phone,
        gpsLat: gpsLat ?? undefined,
        gpsLng: gpsLng ?? undefined,
        images,
        videos,
        coverMediaType
      })
      showToast('تم حفظ التعديلات بنجاح ✅')
      navigate(`${basePath}/lands`)
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
        style={{ background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)' }}
      >
        <button onClick={() => navigate(-1)} className="text-white mb-3 flex items-center gap-1">
          <ArrowRight size={20} />
          <span className="text-sm font-bold">رجوع</span>
        </button>
        <h1 className="text-white text-2xl font-black">📝 تعديل إعلان الأرض</h1> {/* Changed title */}
        <p className="text-earth-200 text-sm mt-1">قم بتحديث تفاصيل إعلان أرضك الفلاحية</p> {/* Changed description */}
      </div>

      <form onSubmit={handleSubmit} className="px-4 py-5 space-y-5">
        {/* Goal */}
        <div>
          <label className="block text-gray-700 font-black mb-2 text-base">الهدف</label>
          <div className="grid grid-cols-2 gap-3">
            {(['بيع', 'إيجار'] as LandGoal[]).map(g => (
              <button
                type="button"
                key={g}
                onClick={() => setGoal(g)}
                className={`relative rounded-2xl overflow-hidden transition-all h-28 flex flex-col items-center justify-center p-2 pb-3 ${
                  goal === g
                    ? g === 'بيع' ? 'ring-2 ring-green-500 shadow-lg scale-95' : 'ring-2 ring-yellow-500 shadow-lg scale-95'
                    : 'border border-gray-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-1'
                }`}
              >
                {/* Visual Area */}
                <div className="absolute inset-0 z-0 p-2 pb-8">
                  <div className={`w-full h-full rounded-xl flex items-center justify-center ${
                    g === 'بيع' ? 'bg-green-50/50' : 'bg-yellow-50/50'
                  }`}>
                     <span className="text-5xl drop-shadow-md">{g === 'بيع' ? '🏷' : '🤝'}</span>
                  </div>
                </div>

                {/* Floating Badge */}
                <div className="relative z-20 mt-auto">
                  <span className={`block px-5 py-1.5 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.08)] text-sm font-black transition-colors ${
                    goal === g
                        ? (g === 'بيع' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white')
                        : 'bg-white/95 backdrop-blur-sm text-gray-800 border border-gray-100'
                  }`}>
                    {g === 'بيع' ? 'للبيع' : 'للإيجار'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Area */}
        <div>
          <label className="block text-gray-700 font-black mb-1.5 text-base">المساحة (هكتار)</label>
          <input
            type="number"
            step="0.01"
            value={area}
            onChange={e => setArea(e.target.value)}
            placeholder="مثال: 3.5"
            className={`w-full border-2 rounded-xl px-4 py-3 text-right text-base bg-white focus:outline-none focus:border-green-500 ${
              errors.area ? 'border-red-400' : 'border-gray-200'
            }`}
          />
          {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
        </div>

        {/* Wilaya */}
        <div>
          <label className="block text-gray-700 font-black mb-1.5 text-base">الولاية</label>
          <select
            value={wilaya}
            onChange={e => setWilaya(e.target.value)}
            className={`w-full border-2 rounded-xl px-4 py-3 text-right text-base bg-white focus:outline-none focus:border-green-500 ${
              errors.wilaya ? 'border-red-400' : 'border-gray-200'
            }`}
          >
            <option value="">اختر الولاية</option>
            {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
          {errors.wilaya && <p className="text-red-500 text-sm mt-1">{errors.wilaya}</p>}
        </div>

        {/* Documents */}
        <div>
          <label className="block text-gray-700 font-black mb-1.5 text-base">نوع الوثائق</label>
          <select
            value={documents}
            onChange={e => setDocuments(e.target.value)}
            className={`w-full border-2 rounded-xl px-4 py-3 text-right text-base bg-white focus:outline-none focus:border-green-500 ${
              errors.documents ? 'border-red-400' : 'border-gray-200'
            }`}
          >
            <option value="">اختر نوع الوثائق</option>
            {LAND_DOCUMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          {errors.documents && <p className="text-red-500 text-sm mt-1">{errors.documents}</p>}
        </div>

        {/* Features */}
        <div>
          <label className="block text-gray-700 font-black mb-2 text-base">المرافق والمميزات</label>
          <div className="flex flex-wrap gap-2">
            {LAND_FEATURES.map(f => (
              <button
                type="button"
                key={f}
                onClick={() => toggleFeature(f)}
                className={`px-3 py-1.5 rounded-full text-sm font-bold border-2 transition-all ${
                  features.includes(f)
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Price type */}
        <div>
          <label className="block text-gray-700 font-black mb-2 text-base">نوع السعر</label>
          <div className="grid grid-cols-3 gap-2">
            {(['ثابت', 'قابل للتفاوض', 'عرض'] as PriceType[]).map(pt => (
              <button
                type="button"
                key={pt}
                onClick={() => setPriceType(pt)}
                className={`py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                  priceType === pt
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                {pt}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        {priceType === 'ثابت' && (
          <div>
            <label className="block text-gray-700 font-black mb-1.5 text-base">السعر (مليون دج)</label>
            <input
              type="number"
              step="0.1"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="مثال: 5.5"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-right text-base bg-white focus:outline-none focus:border-green-500"
            />
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-black mb-1.5 text-base">الوصف</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            placeholder="صف الأرض بشكل مفصل: الموقع، نوع التربة، المميزات..."
            className={`w-full border-2 rounded-xl px-4 py-3 text-right text-base bg-white focus:outline-none focus:border-green-500 resize-none ${
              errors.description ? 'border-red-400' : 'border-gray-200'
            }`}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-gray-700 font-black mb-1.5 text-base">رقم الهاتف</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="0550000000"
            className={`w-full border-2 rounded-xl px-4 py-3 text-right text-base bg-white focus:outline-none focus:border-green-500 ${
              errors.phone ? 'border-red-400' : 'border-gray-200'
            }`}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        {/* GPS via Map Picker */}
        <div>
          <label className="block text-gray-700 font-black mb-1.5 text-base">
            <MapPin size={16} className="inline ml-1 text-green-600" />
            الموقع الجغرافي للأرض (اختياري)
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
              className="w-full border-2 border-dashed border-green-300 bg-green-50 rounded-xl px-4 py-5 flex flex-col items-center gap-2 hover:bg-green-100 transition-all"
            >
              <Map size={28} className="text-green-500" />
              <span className="font-black text-green-700 text-base">حدد موقع الأرض على الخريطة</span>
              <span className="text-xs text-gray-500">اضغط لفتح الدبوس وتحديد المكان بدقة</span>
            </button>
          )}
        </div>

        {/* Map Picker Modal */}
        {showMapPicker && (
          <Suspense fallback={<div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center"><div className="text-white font-bold">جاري تحميل الخريطة...</div></div>}>
            <MapPicker
              lat={gpsLat}
              lng={gpsLng}
              onChange={(lat, lng) => { setGpsLat(lat); setGpsLng(lng) }}
              onClose={() => setShowMapPicker(false)}
            />
          </Suspense>
        )}

        {/* Images */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-800 text-base mb-3 flex items-center gap-2">
            <Camera size={16} className="text-green-600" />
            صور الأرض ({images.length})
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
            className="w-full border-2 border-dashed border-green-300 bg-green-50 rounded-xl py-4 flex items-center justify-center gap-2"
          >
            {compressing ? (
              <><div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /><span className="text-green-600 font-bold text-sm">جاري الضغط...</span></>
            ) : (
              <><Plus size={18} className="text-green-600" /><span className="text-green-700 font-bold text-sm">إضافة صورة للأرض</span></>
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
            فيديوهات توضيحية للأرض ({videos.length})
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

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white rounded-2xl py-4 font-black text-xl shadow-lg hover:bg-green-600 active:scale-95 transition-all disabled:opacity-60"
        >
          {loading ? 'جاري الحفظ...' : 'حفظ التعديلات 🌍'}
        </button>
      </form>
    </div>
  )
}
