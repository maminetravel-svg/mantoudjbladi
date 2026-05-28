import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import { CROP_LABELS, CROP_EMOJIS, STAGE_LABELS } from '../../types'
import { ArrowRight, MapPin, Star, Phone, MessageCircle, Package, Check } from 'lucide-react'
import { TrustScore } from '../../components/Shared/TrustScore'
import { showToast } from '../../components/Shared/Toast'

let MapContainer: React.ComponentType<any>
let TileLayer: React.ComponentType<any>
let Marker: React.ComponentType<any>
let Popup: React.ComponentType<any>

const STAGE_COLOR: Record<string, string> = {
  seeds: '#74b569', growth: '#2D6A4F', flowering: '#22c55e', ready: '#dc2626',
}

export default function FarmerProfile() {
  const { farmerId } = useParams<{ farmerId: string }>()
  const navigate = useNavigate()
  const { farmers, crops, currentUser, addFarmerReview } = useAppStore()

  const farmer = farmers.find(f => f.id === farmerId)
  const farmerCrops = crops.filter(c => c.farmerId === farmerId)

  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    Promise.all([import('react-leaflet'), import('leaflet')]).then(([rl, L]) => {
      MapContainer = rl.MapContainer
      TileLayer = rl.TileLayer
      Marker = rl.Marker
      Popup = rl.Popup
      const leafletLib = L.default
      delete (leafletLib.Icon.Default.prototype as any)._getIconUrl
      leafletLib.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })
      setMapReady(true)
    }).catch(() => {})
  }, [])

  const reviews = farmer?.reviews || []
  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : farmer?.trustScore || 0

  const hasReviewed = reviews.some(r => r.buyerId === currentUser?.id)

  if (!farmer) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="text-6xl mb-4">👨‍🌾</div>
          <p className="text-gray-500 text-lg font-bold">الفلاح غير موجود</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-primary-500 font-bold">رجوع</button>
        </div>
      </div>
    )
  }

  const handleSubmitReview = async () => {
    if (!comment.trim()) { showToast('اكتب تعليقاً', 'error'); return }
    if (!currentUser) { showToast('يجب تسجيل الدخول أولاً', 'error'); return }
    
    setSubmitting(true)
    try {
      await addFarmerReview(farmer.id, rating, comment.trim())
      setComment('')
      setShowReviewForm(false)
      showToast('✅ تم إرسال تقييمك', 'success')
    } catch (e: any) {
      showToast(e.message || 'حدث خطأ أثناء التقييم', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="px-4 pt-10 pb-8 relative" style={{ background: 'linear-gradient(135deg, #2D6A4F 0%, #1B4332 100%)' }}>
        <button onClick={() => navigate(-1)} className="text-white mb-4 flex items-center gap-1">
          <ArrowRight size={20} />
          <span className="text-sm font-bold">رجوع</span>
        </button>

        {/* Avatar + name */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-white bg-opacity-20 flex items-center justify-center text-5xl shadow-lg">
            👨‍🌾
          </div>
          <div className="flex-1">
            <h1 className="text-white text-2xl font-black">{farmer.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <MapPin size={14} className="text-green-300" />
              <span className="text-green-200 text-sm font-bold">
                {farmer.wilaya}{farmer.commune ? ` · ${farmer.commune}` : ''}
              </span>
            </div>
            {farmer.specialization && (
              <span className="mt-1 inline-block bg-white bg-opacity-20 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                🌿 {farmer.specialization}
              </span>
            )}
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="bg-white bg-opacity-15 rounded-2xl p-3 text-center">
            <div className="text-white font-black text-xl">{farmer.dealsCompleted}</div>
            <div className="text-green-200 text-xs">صفقة منجزة</div>
          </div>
          <div className="bg-white bg-opacity-15 rounded-2xl p-3 text-center">
            <div className="text-white font-black text-xl">{farmerCrops.length}</div>
            <div className="text-green-200 text-xs">محصول</div>
          </div>
          <div className="bg-white bg-opacity-15 rounded-2xl p-3 text-center">
            <div className="text-white font-black text-xl">{avgRating.toFixed(1)}</div>
            <div className="text-green-200 text-xs">⭐ التقييم</div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">

        {/* Trust score */}
        <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star size={18} className="text-yellow-500" fill="currentColor" />
            <span className="font-black text-gray-800">التقييم العام</span>
          </div>
          <TrustScore score={avgRating} size="md" showNumber />
        </div>

        {/* Location map */}
        {farmer.gpsLat !== 0 && farmer.gpsLng !== 0 && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-mono" dir="ltr">
                {farmer.gpsLat.toFixed(4)}, {farmer.gpsLng.toFixed(4)}
              </span>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-primary-600" />
                <span className="font-black text-gray-800">موقع الفلاح</span>
              </div>
            </div>
            <div style={{ height: '200px' }}>
              {mapReady ? (
                <MapContainer
                  center={[farmer.gpsLat, farmer.gpsLng]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={false}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[farmer.gpsLat, farmer.gpsLng]}>
                    <Popup>{farmer.name} - {farmer.wilaya}</Popup>
                  </Marker>
                </MapContainer>
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-100">
                  <div className="text-gray-400 text-sm">جارٍ تحميل الخريطة...</div>
                </div>
              )}
            </div>
            <div className="p-3">
              <a
                href={`https://www.google.com/maps?q=${farmer.gpsLat},${farmer.gpsLng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary-50 text-primary-700 rounded-xl font-bold text-sm"
              >
                <MapPin size={14} /> فتح في خرائط Google
              </a>
            </div>
          </div>
        )}

        {/* Contact */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <span className="font-black text-gray-800">التواصل</span>
          </div>
          <div className="p-4 flex gap-3">
            <a
              href={`tel:${farmer.phone}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary-500 text-white rounded-2xl font-black text-sm"
            >
              <Phone size={16} /> اتصال
            </a>
            <a
              href={`https://wa.me/213${farmer.phone.replace(/^0/, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-2xl font-black text-sm"
            >
              <MessageCircle size={16} /> واتساب
            </a>
          </div>
        </div>

        {/* Crops */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <Package size={16} className="text-primary-600" />
            <span className="font-black text-gray-800">محاصيله ({farmerCrops.length})</span>
          </div>
          {farmerCrops.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-400 text-sm font-bold">لا توجد محاصيل مسجلة</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {farmerCrops.map(crop => (
                <button
                  key={crop.id}
                  onClick={() => navigate(`/buyer/crop/${crop.id}`)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-right"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: STAGE_COLOR[crop.stage] + '22' }}
                  >
                    {CROP_EMOJIS[crop.type]}
                  </div>
                  <div className="flex-1">
                    <div className="font-black text-gray-800 text-sm">{CROP_LABELS[crop.type]}</div>
                    <div className="text-xs text-gray-400">{crop.wilaya} · {(crop.estimatedQuantityKg / 1000).toFixed(1)} طن</div>
                  </div>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ background: STAGE_COLOR[crop.stage] }}
                  >
                    {STAGE_LABELS[crop.stage]}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <button
              onClick={() => {
                if (!currentUser) { showToast('يجب تسجيل الدخول أولاً', 'error'); return }
                if (hasReviewed) { showToast('قدّمت تقييماً من قبل', 'info'); return }
                setShowReviewForm(v => !v)
              }}
              className="text-sm font-black text-primary-600"
            >
              {hasReviewed ? '✓ قيّمت' : '+ إضافة تقييم'}
            </button>
            <div className="flex items-center gap-2">
              <Star size={16} className="text-yellow-500" />
              <span className="font-black text-gray-800">التقييمات ({reviews.length})</span>
            </div>
          </div>

          {/* Review form */}
          {showReviewForm && (
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              {/* Star rating */}
              <div className="flex items-center gap-1 justify-center mb-3">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} onClick={() => setRating(s)}>
                    <Star
                      size={28}
                      fill={s <= rating ? '#f59e0b' : 'none'}
                      stroke={s <= rating ? '#f59e0b' : '#d1d5db'}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="اكتب رأيك في هذا الفلاح..."
                className="w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm font-bold focus:outline-none focus:border-primary-400 resize-none"
                rows={3}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="flex-1 py-2 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSubmitReview}
                  disabled={submitting}
                  className="flex-1 py-2 rounded-xl bg-primary-500 text-white font-black text-sm flex items-center justify-center gap-1"
                >
                  <Check size={14} />
                  {submitting ? 'جارٍ...' : 'إرسال'}
                </button>
              </div>
            </div>
          )}

          {/* Reviews list */}
          {reviews.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-400 text-sm font-bold">لا توجد تقييمات بعد</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {reviews.map(review => (
                <div key={review.id} className="px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">{review.createdAt}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} size={12} fill={s <= review.rating ? '#f59e0b' : 'none'} stroke={s <= review.rating ? '#f59e0b' : '#d1d5db'} />
                        ))}
                      </div>
                      <span className="font-black text-gray-800 text-sm">{review.buyerName}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="h-4" />
      </div>
    </div>
  )
}
