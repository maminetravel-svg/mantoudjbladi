import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import { CROP_LABELS, CROP_EMOJIS, STAGE_LABELS, EQUIPMENT_CATEGORIES, EquipmentCategory } from '../../types'
import { ArrowRight, Star, Phone, MessageCircle, Check, MapPin, Package, Wrench } from 'lucide-react'
import { TrustScore } from '../../components/Shared/TrustScore'
import { showToast } from '../../components/Shared/Toast'
import { apiGetUserProfile, apiAddUserReview, apiAddFarmerRecordReview } from '../../api/auth'

let MapContainer: React.ComponentType<any>
let TileLayer: React.ComponentType<any>
let CircleMarker: React.ComponentType<any>

const CATEGORY_EMOJIS: Record<EquipmentCategory, string> = {
  'معدات ري': '💧', 'جرارات': '🚜', 'بيوت بلاستيكية': '🏠', 'أسمدة': '🌿', 'بذور': '🌱',
}

const ROLE_LABEL: Record<string, { label: string; emoji: string; color: string; bg: string }> = {
  farmer: { label: 'فلاح',   emoji: '👨‍🌾', color: '#2D6A4F', bg: 'linear-gradient(135deg,#2D6A4F,#1B4332)' },
  buyer:  { label: 'مشتري', emoji: '🏭',   color: '#1e40af', bg: 'linear-gradient(135deg,#1e40af,#1d4ed8)' },
  agent:  { label: 'وسيط',  emoji: '🤝',   color: '#7c3aed', bg: 'linear-gradient(135deg,#7c3aed,#6d28d9)' },
}

const STAGE_COLOR: Record<string, string> = {
  seeds: '#74b569', growth: '#2D6A4F', flowering: '#22c55e', ready: '#dc2626',
}

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const { currentUser } = useAppStore()

  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    Promise.all([import('react-leaflet'), import('leaflet')]).then(([rl]) => {
      MapContainer = rl.MapContainer
      TileLayer = rl.TileLayer
      CircleMarker = rl.CircleMarker
      setMapReady(true)
    }).catch(() => {})
  }, [])

  const loadProfile = () => {
    if (!userId) return
    setLoading(true)
    apiGetUserProfile(userId)
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadProfile() }, [userId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <p className="text-gray-500 text-lg font-bold">المستخدم غير موجود</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-primary-500 font-bold">رجوع</button>
        </div>
      </div>
    )
  }

  const role = ROLE_LABEL[profile.role] || ROLE_LABEL.buyer
  const reviews: any[] = profile.reviews || []
  const avgRating = reviews.length > 0
    ? reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length
    : profile.trustScore || 0

  const isSelf = currentUser?.id === userId
  const hasReviewed = reviews.some((r: any) => r.reviewerId === currentUser?.id)
  const canReview = !!currentUser && !isSelf

  const handleSubmitReview = async () => {
    if (!comment.trim()) { showToast('اكتب تعليقاً', 'error'); return }
    if (!currentUser) { showToast('يجب تسجيل الدخول أولاً', 'error'); return }
    setSubmitting(true)
    try {
      if (profile?.isFarmerRecord) {
        await apiAddFarmerRecordReview(profile.farmerRecordId, rating, comment.trim())
      } else {
        await apiAddUserReview(userId!, rating, comment.trim())
      }
      loadProfile()
      setComment('')
      setShowReviewForm(false)
      showToast('✅ تم إرسال تقييمك', 'success')
    } catch (e: any) {
      showToast(e.message || 'حدث خطأ', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const crops: any[] = profile.crops || []
  const equipmentList: any[] = profile.equipment || []
  const landsList: any[] = profile.lands || []
  const hasLocation = profile.gpsLat && profile.gpsLng && profile.gpsLat !== 0 && profile.gpsLng !== 0

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">

      {/* Header */}
      <div className="px-4 pt-10 pb-8" style={{ background: role.bg }}>
        <button onClick={() => navigate(-1)} className="text-white mb-4 flex items-center gap-1">
          <ArrowRight size={20} />
          <span className="text-sm font-bold">رجوع</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-white bg-opacity-20 flex items-center justify-center text-5xl shadow-lg">
            {role.emoji}
          </div>
          <div className="flex-1">
            <h1 className="text-white text-2xl font-black">{profile.name}</h1>
            {profile.wilaya && (
              <div className="flex items-center gap-2 mt-1">
                <MapPin size={14} className="text-white opacity-70" />
                <span className="text-white text-sm font-bold opacity-80">
                  {profile.wilaya}{profile.commune ? ` · ${profile.commune}` : ''}
                </span>
              </div>
            )}
            <span className="mt-1.5 inline-block bg-white bg-opacity-20 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {role.emoji} {role.label}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="bg-white bg-opacity-15 rounded-2xl p-3 text-center">
            <div className="text-white font-black text-xl">{profile.dealsCount ?? 0}</div>
            <div className="text-white text-xs opacity-70">صفقة منجزة</div>
          </div>
          <div className="bg-white bg-opacity-15 rounded-2xl p-3 text-center">
            <div className="text-white font-black text-xl">{reviews.length}</div>
            <div className="text-white text-xs opacity-70">تقييم</div>
          </div>
          <div className="bg-white bg-opacity-15 rounded-2xl p-3 text-center">
            <div className="text-white font-black text-xl">{avgRating.toFixed(1)}</div>
            <div className="text-white text-xs opacity-70">⭐ المعدل</div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">

        {/* Trust Score */}
        <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <TrustScore score={avgRating} size="md" showNumber />
          <div className="flex items-center gap-2">
            <Star size={18} className="text-yellow-500" fill="currentColor" />
            <span className="font-black text-gray-800">التقييم العام</span>
          </div>
        </div>

        {/* Location map */}
        {hasLocation && mapReady && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <MapPin size={16} className="text-primary-600" />
              <span className="font-black text-gray-800">الموقع</span>
            </div>
            <div style={{ height: 200 }}>
              <MapContainer
                center={[profile.gpsLat, profile.gpsLng]}
                zoom={12}
                style={{ width: '100%', height: '100%' }}
                zoomControl={false}
                scrollWheelZoom={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <CircleMarker center={[profile.gpsLat, profile.gpsLng]} radius={10} pathOptions={{ color: role.color, fillColor: role.color, fillOpacity: 0.9 }} />
              </MapContainer>
            </div>
          </div>
        )}

        {/* Crops — only for farmers */}
        {crops.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <Package size={16} className="text-primary-600" />
              <span className="font-black text-gray-800">محاصيله ({crops.length})</span>
            </div>
            <div className="divide-y divide-gray-50">
              {crops.map((crop: any) => (
                <button
                  key={crop._id}
                  onClick={() => navigate(`/buyer/crop/${crop._id}`)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-right"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: (STAGE_COLOR[crop.stage] || '#ccc') + '22' }}>
                    {CROP_EMOJIS[crop.type as keyof typeof CROP_EMOJIS] || '🌱'}
                  </div>
                  <div className="flex-1">
                    <div className="font-black text-gray-800 text-sm">
                      {CROP_LABELS[crop.type as keyof typeof CROP_LABELS] || crop.type}
                    </div>
                    <div className="text-xs text-gray-400">
                      {crop.wilaya} · {(crop.estimatedQuantityKg / 1000).toFixed(1)} طن
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ background: STAGE_COLOR[crop.stage] || '#999' }}>
                    {STAGE_LABELS[crop.stage as keyof typeof STAGE_LABELS] || crop.stage}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Equipment listings */}
        {equipmentList.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <Wrench size={16} className="text-blue-600" />
              <span className="font-black text-gray-800">معداته ({equipmentList.length})</span>
            </div>
            <div className="divide-y divide-gray-50">
              {equipmentList.map((eq: any) => {
                const basePath = currentUser?.role === 'farmer' ? '/farmer' : currentUser?.role === 'agent' ? '/agent' : '/buyer'
                return (
                  <button
                    key={eq._id}
                    onClick={() => navigate(`${basePath}/equipment/${eq._id}`)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-right"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl flex-shrink-0">
                      {CATEGORY_EMOJIS[eq.category as EquipmentCategory] || '⚙️'}
                    </div>
                    <div className="flex-1">
                      <div className="font-black text-gray-800 text-sm">{eq.name}</div>
                      <div className="text-xs text-gray-400">{eq.wilaya} · {eq.category}</div>
                    </div>
                    {eq.pricePerDay && (
                      <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                        {eq.pricePerDay} دج/يوم
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Land listings */}
        {landsList.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <span className="text-lg">🌍</span>
              <span className="font-black text-gray-800">أراضيه ({landsList.length})</span>
            </div>
            <div className="divide-y divide-gray-50">
              {landsList.map((land: any) => {
                const basePath = currentUser?.role === 'farmer' ? '/farmer' : currentUser?.role === 'agent' ? '/agent' : '/buyer'
                return (
                  <button
                    key={land._id}
                    onClick={() => navigate(`${basePath}/lands/${land._id}`)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-right"
                  >
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-xl flex-shrink-0">🌍</div>
                    <div className="flex-1">
                      <div className="font-black text-gray-800 text-sm">{land.area} هكتار — {land.goal}</div>
                      <div className="text-xs text-gray-400">{land.wilaya}{land.commune ? ` · ${land.commune}` : ''}</div>
                    </div>
                    {land.price ? (
                      <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                        {land.price.toLocaleString()} دج
                      </span>
                    ) : (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${land.goal === 'بيع' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {land.goal}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            {canReview ? (
              <button
                onClick={() => {
                  if (hasReviewed) { showToast('قدّمت تقييماً من قبل', 'info'); return }
                  setShowReviewForm(v => !v)
                }}
                className="text-sm font-black text-primary-600"
              >
                {hasReviewed ? '✓ قيّمت' : '+ إضافة تقييم'}
              </button>
            ) : <div />}
            <div className="flex items-center gap-2">
              <Star size={16} className="text-yellow-500" />
              <span className="font-black text-gray-800">التقييمات ({reviews.length})</span>
            </div>
          </div>

          {/* Review form */}
          {showReviewForm && (
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-1 justify-center mb-3">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} onClick={() => setRating(s)}>
                    <Star size={28}
                      fill={s <= rating ? '#f59e0b' : 'none'}
                      stroke={s <= rating ? '#f59e0b' : '#d1d5db'} />
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder={`اكتب رأيك في هذا ${role.label}...`}
                className="w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm font-bold focus:outline-none focus:border-primary-400 resize-none"
                rows={3}
              />
              <div className="flex gap-2 mt-2">
                <button onClick={() => setShowReviewForm(false)}
                  className="flex-1 py-2 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm">
                  إلغاء
                </button>
                <button onClick={handleSubmitReview} disabled={submitting}
                  className="flex-1 py-2 rounded-xl bg-primary-500 text-white font-black text-sm flex items-center justify-center gap-1">
                  <Check size={14} />
                  {submitting ? 'جارٍ...' : 'إرسال'}
                </button>
              </div>
            </div>
          )}

          {/* Reviews list */}
          {reviews.length === 0 ? (
            <div className="p-6 text-center">
              <div className="text-4xl mb-2">⭐</div>
              <p className="text-gray-400 text-sm font-bold">لا توجد تقييمات بعد</p>
              {canReview && !hasReviewed && (
                <button onClick={() => setShowReviewForm(true)}
                  className="mt-3 text-primary-600 font-black text-sm">
                  كن أول من يقيّم
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {reviews.map((review: any) => (
                <div key={review._id} className="px-4 py-3">
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-xs text-gray-400 mt-0.5">
                      {new Date(review.createdAt).toLocaleDateString('ar-DZ')}
                    </span>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end mb-0.5">
                        <div className="flex">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} size={13}
                              fill={s <= review.rating ? '#f59e0b' : 'none'}
                              stroke={s <= review.rating ? '#f59e0b' : '#d1d5db'} />
                          ))}
                        </div>
                        <span className="font-black text-gray-800 text-sm">{review.reviewerName}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {ROLE_LABEL[review.reviewerRole]?.emoji} {ROLE_LABEL[review.reviewerRole]?.label}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mt-1">{review.comment}</p>
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
