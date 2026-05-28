import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, Phone, MapPin, Star } from 'lucide-react'
import { getFarmerProfile } from '../../api/agentManagement'
import { CROP_LABELS, CROP_EMOJIS } from '../../types'
import { showToast } from '../../components/Shared/Toast'

export default function AgentFarmerProfile() {
  const { farmerId } = useParams<{ farmerId: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'crops' | 'equipment' | 'lands' | 'reviews'>('crops')

  useEffect(() => {
    if (!farmerId) return
    getFarmerProfile(farmerId)
      .then(setData)
      .catch(() => showToast('فشل تحميل ملف الفلاح', 'error'))
      .finally(() => setLoading(false))
  }, [farmerId])

  if (loading) return <div className="flex items-center justify-center h-screen text-gray-400">جاري التحميل...</div>
  if (!data) return <div className="flex items-center justify-center h-screen text-gray-400">لا توجد بيانات</div>

  const { farmer, crops, equipment, lands } = data

  return (
    <div className="min-h-screen bg-gray-50 pb-24" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-800 to-green-600 text-white px-4 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <ChevronRight size={20} />
          </button>
          <h1 className="text-lg font-black">ملف الفلاح</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-black">
            {farmer.name[0]}
          </div>
          <div>
            <h2 className="text-xl font-black">{farmer.name}</h2>
            <div className="flex items-center gap-3 text-green-200 text-sm mt-1">
              <span className="flex items-center gap-1"><Phone size={12} />{farmer.phone}</span>
              <span className="flex items-center gap-1"><MapPin size={12} />{farmer.wilaya}</span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center gap-1 text-yellow-300 text-sm">
                <Star size={12} fill="currentColor" />
                {farmer.trustScore.toFixed(1)}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${farmer.isActiveForAgent ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                {farmer.isActiveForAgent ? 'نشيط' : 'مثبّط'}
              </span>
              {farmer.userId && (
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-bold">مرتبط</span>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-xl font-black">{crops.length}</p>
            <p className="text-green-200 text-xs">محصول</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-xl font-black">{equipment.length}</p>
            <p className="text-green-200 text-xs">معدة</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-xl font-black">{lands.length}</p>
            <p className="text-green-200 text-xs">أرض</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10">
        {(['crops', 'equipment', 'lands', 'reviews'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${tab === t ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-400'}`}
          >
            {t === 'crops' ? 'المحاصيل' : t === 'equipment' ? 'المعدات' : t === 'lands' ? 'الأراضي' : 'التقييمات'}
          </button>
        ))}
      </div>

      <div className="px-4 py-4 space-y-3">
        {tab === 'crops' && (
          crops.length === 0
            ? <div className="text-center py-12 text-gray-400">لا توجد محاصيل</div>
            : crops.map((c: any) => (
              <button
                key={c._id}
                onClick={() => navigate(`/agent/crops/${c._id}`)}
                className="w-full bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm text-right"
              >
                <div className="text-3xl">{(CROP_EMOJIS as any)[c.type] || '🌾'}</div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">{(CROP_LABELS as any)[c.type] || c.type}</p>
                  <p className="text-xs text-gray-500">{c.wilaya} — {c.estimatedQuantityKg} ط</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-bold ${c.status === 'approved' ? 'bg-green-100 text-green-700' : c.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'}`}>
                  {c.status === 'approved' ? 'مؤكد' : c.status === 'pending' ? 'قيد الانتظار' : 'مرفوض'}
                </span>
              </button>
            ))
        )}

        {tab === 'equipment' && (
          equipment.length === 0
            ? <div className="text-center py-12 text-gray-400">لا توجد معدات</div>
            : equipment.map((e: any) => (
              <div key={e._id} className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="font-bold text-gray-800">{e.name}</p>
                <p className="text-xs text-gray-500">{e.category} — {e.wilaya}</p>
              </div>
            ))
        )}

        {tab === 'lands' && (
          lands.length === 0
            ? <div className="text-center py-12 text-gray-400">لا توجد أراضي</div>
            : lands.map((l: any) => (
              <div key={l._id} className="bg-white rounded-2xl p-4 shadow-sm">
                <p className="font-bold text-gray-800">{l.area} هكتار — {l.goal}</p>
                <p className="text-xs text-gray-500">{l.wilaya}</p>
              </div>
            ))
        )}

        {tab === 'reviews' && (
          farmer.reviews?.length === 0
            ? <div className="text-center py-12 text-gray-400">لا توجد تقييمات بعد</div>
            : (farmer.reviews || []).map((r: any) => (
              <div key={r._id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm">{r.buyerName}</span>
                  <div className="flex">
                    {[1,2,3,4,5].map(n => (
                      <Star key={n} size={14} className={n <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{r.comment}</p>
              </div>
            ))
        )}
      </div>
    </div>
  )
}
