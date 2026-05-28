import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import { CROP_LABELS, WILAYAS, isFruitCrop, calcCropStage, CROP_DAYS_TO_MATURITY } from '../../types'
import { apiUploadImages, apiUploadVideo } from '../../api/uploads'
import { ArrowRight, Camera, Check, Plus, Trash2, AlertCircle, Video, Image, MapPin } from 'lucide-react'
import { showToast } from '../../components/Shared/Toast'
import { CropImage } from '../../components/Shared/CropImage'


export default function EditCrop() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { crops, updateCrop } = useAppStore()
  const isAdmin = pathname.startsWith('/admin')

  const crop = crops.find(c => c.id === id)

  const [images, setImages] = useState<string[]>(crop?.images ?? [])
  const [description, setDescription] = useState(crop?.description ?? '')
  const [pricePerKg, setPricePerKg] = useState(crop?.pricePerKg?.toString() ?? '')
  const [quantity, setQuantity] = useState(crop?.estimatedQuantityKg?.toString() ?? '')
  const [videos, setVideos] = useState<string[]>((crop?.videos ?? []).filter(v => !v.startsWith('blob:')))
  const [coverMediaType, setCoverMediaType] = useState<'image' | 'video'>(crop?.coverMediaType ?? 'image')
  // Admin-only fields
  const [wilaya, setWilaya] = useState(crop?.wilaya ?? '')
  const [marketTarget, setMarketTarget] = useState<'محلي' | 'تصدير'>((crop as any)?.marketTarget ?? 'محلي')
  const [plantingDate, setPlantingDate] = useState((crop as any)?.plantingDate ?? '')
  const [expectedHarvestDate, setExpectedHarvestDate] = useState((crop as any)?.expectedHarvestDate ?? '')
  const [gpsLat, setGpsLat] = useState<number | null>((crop as any)?.gpsLat || null)
  const [gpsLng, setGpsLng] = useState<number | null>((crop as any)?.gpsLng || null)
  const [compressing, setCompressing] = useState(false)
  const [videoLoading, setVideoLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!saved) return
    const t = setTimeout(() => navigate(-1), 1500)
    return () => clearTimeout(t)
  }, [saved])
  const fileRef = useRef<HTMLInputElement>(null)
  const videoGalleryRef = useRef<HTMLInputElement>(null)
  const videoCameraRef = useRef<HTMLInputElement>(null)

  if (!crop) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center px-6">
          <AlertCircle size={48} className="text-red-400 mx-auto mb-3" />
          <p className="font-black text-gray-700 text-xl">المحصول غير موجود</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-green-600 font-bold underline">رجوع</button>
        </div>
      </div>
    )
  }

  const handleAddImage = async (file: File) => {
    setCompressing(true)
    try {
      const urls = await apiUploadImages([file])
      setImages(prev => [...prev, ...urls])
    } catch (e: any) {
      alert(e.message || 'فشل رفع الصورة')
    } finally {
      setCompressing(false)
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleAddVideo = async (file: File) => {
    setVideoLoading(true)
    try {
      const url = await apiUploadVideo(file)
      setVideos(prev => [...prev, url])
    } catch (e: any) {
      alert(e.message || 'فشل رفع الفيديو')
    } finally {
      setVideoLoading(false)
    }
  }

  const handleSave = async () => {
    const isFruit = isFruitCrop(crop.type)
    const computedStage = calcCropStage(plantingDate, expectedHarvestDate)
    const updates: any = {
      stage: computedStage,
      plantingDate,
      expectedHarvestDate,
      images, videos, coverMediaType, description,
      pricePerKg: pricePerKg ? parseFloat(pricePerKg) : undefined,
      estimatedQuantityKg: quantity ? parseInt(quantity) : crop.estimatedQuantityKg,
    }
    if (isAdmin) {
      updates.wilaya = wilaya
      updates.marketTarget = marketTarget
      if (gpsLat && gpsLng) { updates.gpsLat = gpsLat; updates.gpsLng = gpsLng }
    }
    await updateCrop(crop.id, updates)
    showToast('تم الحفظ بنجاح ✅')
    setSaved(true)
  }

  if (saved) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50" dir="rtl">
        <div className="text-center px-8">
          <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-2xl"
            style={{ boxShadow: '0 0 0 12px rgba(45,106,79,0.15)' }}>
            <Check size={48} className="text-white" strokeWidth={3} />
          </div>
          <h2 className="text-2xl font-black text-primary-700 mb-2">تم الحفظ بنجاح!</h2>
          <p className="text-gray-500 text-sm">جاري العودة...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-green-50 flex flex-col" dir="rtl">
      {/* Header */}
      <div className="px-4 pt-10 pb-5" style={{ background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)' }}>
        <button onClick={() => navigate(-1)} className="text-white mb-3 flex items-center gap-1">
          <ArrowRight size={20} />
          <span className="text-sm font-bold">رجوع</span>
        </button>
        <div className="flex items-center gap-3">
          <CropImage type={crop.type} className="w-12 h-12 rounded-xl flex-shrink-0 shadow-sm border border-white border-opacity-30" emojiSize="text-3xl" />
          <div>
            <h1 className="text-white text-xl font-black">{CROP_LABELS[crop.type]}</h1>
            <p className="text-green-200 text-sm">{crop.wilaya} · تعديل بيانات المحصول</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 pb-28">

        {/* Dates — editable by all users */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-black text-gray-800 text-base mb-3">📅 تواريخ المحصول</h3>
          <div className={`grid gap-3 ${isFruitCrop(crop.type) ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {!isFruitCrop(crop.type) && (
              <div>
                <label className="block text-gray-600 font-bold mb-1.5 text-sm">تاريخ الغرس</label>
                <input
                  type="date"
                  value={plantingDate}
                  onChange={e => setPlantingDate(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-green-500"
                />
              </div>
            )}
            <div>
              <label className="block text-gray-600 font-bold mb-1.5 text-sm">تاريخ الجاهزية المتوقع</label>
              <input
                type="date"
                value={expectedHarvestDate}
                onChange={e => setExpectedHarvestDate(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 bg-white focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          {/* Stage date markers */}
          {(() => {
            const isFruit = isFruitCrop(crop.type)
            const startMs = isFruit
              ? new Date(expectedHarvestDate).getTime() - (CROP_DAYS_TO_MATURITY[crop.type] ?? 90) * 86400000
              : new Date(plantingDate).getTime()
            const endMs = new Date(expectedHarvestDate).getTime()
            if (!startMs || !endMs || endMs <= startMs) return null
            const total = endMs - startMs
            const now = Date.now()
            const pct = Math.min(1, Math.max(0, (now - startMs) / total))
            const stageIcons = ['🌱','🌿','🌸','🍅']
            const stageColors = ['#74b569','#2D6A4F','#22c55e','#dc2626']
            // "جاهز" starts 7 days before harvest date
            const stageDates = [
              new Date(startMs),
              new Date(startMs + 0.25 * total),
              new Date(startMs + 0.50 * total),
              new Date(endMs - 7 * 86400000),
            ]
            const labelsVeg = ['بذرة','نمو','إزهار','جاهز']
            const labelsFruit = ['إزهار','نمو','نضج','جاهز']
            const labels = isFruit ? labelsFruit : labelsVeg
            const activeIdx = now >= endMs - 7 * 86400000 ? 3
              : pct >= 0.5 ? 2
              : pct >= 0.25 ? 1
              : 0
            return (
              <div className="mt-3">
                <p className="text-xs font-black text-gray-500 mb-2">مراحل المحصول</p>
                <div className="grid grid-cols-4 gap-2">
                  {stageDates.map((stageDate, idx) => {
                    const active = idx === activeIdx
                    return (
                      <div
                        key={idx}
                        className="rounded-xl py-2 px-1 flex flex-col items-center gap-1 border-2 transition-all"
                        style={{
                          borderColor: active ? stageColors[idx] : '#e5e7eb',
                          background: active ? stageColors[idx] + '18' : '#f9fafb',
                        }}
                      >
                        <span className="text-xl">{stageIcons[idx]}</span>
                        <span className="text-xs font-black" style={{ color: active ? stageColors[idx] : '#9ca3af' }}>
                          {labels[idx]}
                        </span>
                        <span className="text-xs font-bold text-gray-500 text-center leading-tight">
                          {stageDate.toLocaleDateString('ar-DZ', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })()}
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-black text-gray-800 text-base mb-3">
            <Camera size={16} className="inline ml-1 text-green-600" />
            صور المحصول ({images.length})
          </h3>

          {/* Existing images grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              {images.map((img, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden">
                  <img src={img} alt={`صورة ${i + 1}`} className="w-full h-28 object-cover" />
                  <button
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1 left-1 bg-red-500 text-white rounded-full p-1 shadow"
                  >
                    <Trash2 size={12} />
                  </button>
                  <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {i + 1}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add image button */}
          <button
            onClick={() => fileRef.current?.click()}
            disabled={compressing}
            className="w-full border-2 border-dashed border-green-300 bg-green-50 rounded-xl py-4 flex items-center justify-center gap-2 hover:bg-green-100 transition-all"
          >
            {compressing ? (
              <>
                <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-green-600 font-bold text-sm">جاري ضغط الصورة...</span>
              </>
            ) : (
              <>
                <Plus size={20} className="text-green-600" />
                <span className="text-green-700 font-bold">إضافة صورة جديدة</span>
              </>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => { Array.from(e.target.files || []).forEach(f => handleAddImage(f)); e.target.value = '' }}
          />
          <p className="text-xs text-gray-400 text-center mt-2">سيتم ضغط الصور تلقائياً قبل الحفظ</p>
        </div>

        {/* Cover media selector — only when both exist */}
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
                <Image size={28} className={coverMediaType === 'image' ? 'text-green-600' : 'text-gray-400'} />
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

        {/* Videos */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-black text-gray-800 text-base mb-3">
            <Video size={16} className="inline ml-1 text-red-500" />
            فيديوهات الحقل ({videos.length})
          </h3>

          {videos.length > 0 && (
            <div className="space-y-2 mb-3">
              {videos.map((v, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden bg-black">
                  <video src={v} controls className="w-full rounded-xl max-h-48 object-cover" />
                  <button
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
              onClick={() => videoGalleryRef.current?.click()}
              disabled={videoLoading}
              className="border-2 border-dashed border-red-300 bg-red-50 rounded-xl py-4 flex flex-col items-center justify-center gap-1.5 hover:bg-red-100 transition-all"
            >
              {videoLoading ? (
                <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-2xl">📁</span>
                  <span className="text-red-700 font-bold text-sm">رفع من المعرض</span>
                </>
              )}
            </button>
            <button
              onClick={() => videoCameraRef.current?.click()}
              disabled={videoLoading}
              className="border-2 border-dashed border-red-300 bg-red-50 rounded-xl py-4 flex flex-col items-center justify-center gap-1.5 hover:bg-red-100 transition-all"
            >
              {videoLoading ? (
                <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-2xl">🎥</span>
                  <span className="text-red-700 font-bold text-sm">تسجيل فيديو</span>
                </>
              )}
            </button>
          </div>
          <input
            ref={videoGalleryRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleAddVideo(f) }}
          />
          <input
            ref={videoCameraRef}
            type="file"
            accept="video/*"
            capture="environment"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleAddVideo(f) }}
          />
          <p className="text-xs text-gray-400 text-center mt-2">الحد الأقصى 50MB · يدعم MP4, MOV, WebM</p>
        </div>

        {/* Quantity & Price */}
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
          <h3 className="font-black text-gray-800 text-base">📦 الكمية والسعر</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-600 font-bold mb-1.5 text-sm">الكمية (كغ)</label>
              <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-right text-base bg-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-bold mb-1.5 text-sm">السعر (دج/كغ)</label>
              <input
                type="number"
                value={pricePerKg}
                onChange={e => setPricePerKg(e.target.value)}
                placeholder="قابل للتفاوض"
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-right text-base bg-white focus:outline-none focus:border-green-500"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-black text-gray-800 text-base mb-3">📝 ملاحظات وتحديثات</h3>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            placeholder="أضف تحديثاً عن حالة المحصول، الري، الأمراض، الجودة..."
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-right text-base bg-white focus:outline-none focus:border-green-500 resize-none"
          />
        </div>

        {/* ── Admin-only fields ── */}
        {isAdmin && (
          <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 space-y-4">
            <h3 className="font-black text-orange-700 text-base flex items-center gap-2">
              🛡️ حقول المشرف فقط
            </h3>

            {/* Wilaya */}
            <div>
              <label className="block text-gray-700 font-black mb-1.5 text-sm">الولاية</label>
              <select
                value={wilaya}
                onChange={e => setWilaya(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-right bg-white focus:outline-none focus:border-orange-400"
              >
                <option value="">اختر الولاية</option>
                {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>

            {/* Market Target */}
            <div>
              <label className="block text-gray-700 font-black mb-2 text-sm">السوق المستهدف</label>
              <div className="grid grid-cols-2 gap-3">
                {(['محلي', 'تصدير'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setMarketTarget(t)}
                    className="rounded-xl p-3 flex flex-col items-center gap-1 border-2 transition-all"
                    style={{
                      borderColor: marketTarget === t ? '#f59e0b' : '#e5e7eb',
                      background: marketTarget === t ? '#fef3c7' : '#fff',
                    }}
                  >
                    <span className="text-2xl">{t === 'محلي' ? '🏠' : '✈️'}</span>
                    <span className="font-black text-sm" style={{ color: marketTarget === t ? '#92400e' : '#6b7280' }}>{t}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* GPS */}
            <div>
              <label className="block text-gray-700 font-black mb-1.5 text-sm">
                <MapPin size={14} className="inline ml-1 text-orange-500" />
                الموقع الجغرافي
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="number"
                    step="0.0001"
                    value={gpsLat ?? ''}
                    onChange={e => setGpsLat(e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="خط العرض (Lat)"
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-right bg-white focus:outline-none focus:border-orange-400 text-sm"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    step="0.0001"
                    value={gpsLng ?? ''}
                    onChange={e => setGpsLng(e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="خط الطول (Lng)"
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-right bg-white focus:outline-none focus:border-orange-400 text-sm"
                  />
                </div>
              </div>
              {gpsLat && gpsLng && (
                <p className="text-xs text-green-600 font-bold mt-1">📍 {gpsLat.toFixed(4)}°N, {gpsLng.toFixed(4)}°E</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Save button */}
      <div className="fixed bottom-16 left-0 right-0 max-w-md mx-auto px-4 pb-4">
        <button
          onClick={handleSave}
          className="w-full bg-green-500 hover:bg-green-600 text-white rounded-2xl py-4 font-black text-xl shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Check size={22} />
          حفظ التحديثات
        </button>
      </div>
    </div>
  )
}
