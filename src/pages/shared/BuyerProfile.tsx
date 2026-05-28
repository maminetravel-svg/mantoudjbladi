import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import { ArrowRight, Star, Phone, MessageCircle, Check, MapPin } from 'lucide-react'
import { TrustScore } from '../../components/Shared/TrustScore'
import { showToast } from '../../components/Shared/Toast'
import { apiGetUserProfile, apiAddUserReview } from '../../api/auth'

const ROLE_LABEL: Record<string, string> = {
  farmer: '👨‍🌾 فلاح',
  agent:  '🤝 وسيط',
  buyer:  '🏭 مشتري',
}

export default function BuyerProfile() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const { currentUser } = useAppStore()

  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [showReviewForm, setShowReviewForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!userId) return
    apiGetUserProfile(userId)
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setLoading(false))
  }, [userId])

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

  const reviews: any[] = profile.reviews || []
  const avgRating = reviews.length > 0
    ? reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length
    : profile.trustScore || 0

  const hasReviewed = reviews.some((r: any) => r.reviewerId === currentUser?.id)
  const canReview = currentUser && currentUser.id !== userId &&
    ['farmer', 'agent'].includes(currentUser.role)

  const handleSubmitReview = async () => {
    if (!comment.trim()) { showToast('اكتب تعليقاً', 'error'); return }
    if (!currentUser) { showToast('يجب تسجيل الدخول أولاً', 'error'); return }
    setSubmitting(true)
    try {
      await apiAddUserReview(userId!, rating, comment.trim())
      const updated = await apiGetUserProfile(userId!)
      setProfile(updated)
      setComment('')
      setShowReviewForm(false)
      showToast('✅ تم إرسال تقييمك', 'success')
    } catch (e: any) {
      showToast(e.message || 'حدث خطأ', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">

      {/* Header */}
      <div className="px-4 pt-10 pb-8 relative"
        style={{ background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)' }}>
        <button onClick={() => navigate(-1)} className="text-white mb-4 flex items-center gap-1">
          <ArrowRight size={20} />
          <span className="text-sm font-bold">رجوع</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-white bg-opacity-20 flex items-center justify-center text-5xl shadow-lg">
            🏭
          </div>
          <div className="flex-1">
            <h1 className="text-white text-2xl font-black">{profile.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <MapPin size={14} className="text-blue-300" />
              <span className="text-blue-200 text-sm font-bold">{profile.wilaya}</span>
            </div>
            <span className="mt-1 inline-block bg-white bg-opacity-20 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {ROLE_LABEL[profile.role] || profile.role}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          <div className="bg-white bg-opacity-15 rounded-2xl p-3 text-center">
            <div className="text-white font-black text-xl">{profile.dealsCount}</div>
            <div className="text-blue-200 text-xs">صفقة منجزة</div>
          </div>
          <div className="bg-white bg-opacity-15 rounded-2xl p-3 text-center">
            <div className="text-white font-black text-xl">{reviews.length}</div>
            <div className="text-blue-200 text-xs">تقييم</div>
          </div>
          <div className="bg-white bg-opacity-15 rounded-2xl p-3 text-center">
            <div className="text-white font-black text-xl">{avgRating.toFixed(1)}</div>
            <div className="text-blue-200 text-xs">⭐ التقييم</div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">

        {/* Trust score */}
        <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <TrustScore score={avgRating} size="md" showNumber />
          <div className="flex items-center gap-2">
            <Star size={18} className="text-yellow-500" fill="currentColor" />
            <span className="font-black text-gray-800">التقييم العام</span>
          </div>
        </div>

        {/* Reviews section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            {canReview ? (
              <button
                onClick={() => {
                  if (hasReviewed) { showToast('قدّمت تقييماً من قبل', 'info'); return }
                  setShowReviewForm(v => !v)
                }}
                className="text-sm font-black text-blue-600"
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
                    <Star size={28} fill={s <= rating ? '#f59e0b' : 'none'}
                      stroke={s <= rating ? '#f59e0b' : '#d1d5db'} />
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="اكتب رأيك في هذا المشتري..."
                className="w-full rounded-xl border-2 border-gray-200 px-3 py-2 text-sm font-bold focus:outline-none focus:border-blue-400 resize-none"
                rows={3}
              />
              <div className="flex gap-2 mt-2">
                <button onClick={() => setShowReviewForm(false)}
                  className="flex-1 py-2 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-sm">
                  إلغاء
                </button>
                <button onClick={handleSubmitReview} disabled={submitting}
                  className="flex-1 py-2 rounded-xl bg-blue-500 text-white font-black text-sm flex items-center justify-center gap-1">
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
              {reviews.map((review: any) => (
                <div key={review._id} className="px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString('ar-DZ')}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} size={12}
                            fill={s <= review.rating ? '#f59e0b' : 'none'}
                            stroke={s <= review.rating ? '#f59e0b' : '#d1d5db'} />
                        ))}
                      </div>
                      <div className="text-right">
                        <span className="font-black text-gray-800 text-sm">{review.reviewerName}</span>
                        <span className="text-xs text-gray-400 mr-1">
                          ({ROLE_LABEL[review.reviewerRole] || review.reviewerRole})
                        </span>
                      </div>
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
