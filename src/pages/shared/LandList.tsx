import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import { LandGoal, WILAYAS } from '../../types'
import { Plus, Phone, MapPin, Droplets, Zap, Home, Trash2, Edit2 } from 'lucide-react'

const FEATURE_ICONS: Record<string, string> = {
  'ماء': '💧',
  'كهرباء': '⚡',
  'بئر': '🪣',
  'بئر ارتوازي': '🔩',
  'غاز': '🔥',
  'بيت': '🏠',
  'حديقة': '🌳',
  'طريق': '🛣️',
  'تربة حمراء': '🟤',
  'سور': '🧱',
}

export default function LandList() {
  const navigate = useNavigate()
  const { lands, currentUser, deleteLand, fetchAll } = useAppStore()
  const [filterGoal, setFilterGoal] = useState<LandGoal | ''>('')
  const [filterWilaya, setFilterWilaya] = useState('')

  useEffect(() => { fetchAll() }, [])

  const filtered = lands.filter(land => {
    if (filterGoal && land.goal !== filterGoal) return false
    if (filterWilaya && land.wilaya !== filterWilaya) return false
    return true
  })

  const basePath = currentUser?.role === 'buyer' ? '/buyer' : currentUser?.role === 'farmer' ? '/farmer' : '/agent'

  return (
    <div className="min-h-screen bg-sage-50" dir="rtl">
      {/* Header */}
      <div
        className="px-4 pt-10 pb-5"
        style={{ background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)' }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="text-earth-200 text-sm font-bold">سوق الأراضي الفلاحية</div>
          <div className="text-white text-sm">{currentUser?.name}</div>
        </div>
        <h1 className="text-white text-2xl font-black">🌍 الأراضي الفلاحية</h1>
        <p className="text-earth-200 text-sm mt-1">{lands.length} أرض متاحة للبيع والإيجار</p>
      </div>

      {/* Goal filter */}
      <div className="px-4 py-3 flex gap-2">
        {(['', 'بيع', 'إيجار'] as const).map(goal => (
          <button
            key={goal}
            onClick={() => setFilterGoal(goal as LandGoal | '')}
            className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
              filterGoal === goal
                ? goal === 'بيع' ? 'bg-green-500 text-white border-green-500'
                  : goal === 'إيجار' ? 'bg-yellow-500 text-white border-harvest-500'
                  : 'bg-primary-500 text-white border-primary-500'
                : 'bg-white text-gray-600 border-gray-200'
            }`}
          >
            {goal === '' ? 'الكل' : goal === 'بيع' ? '🏷 للبيع' : '🤝 للإيجار'}
          </button>
        ))}
      </div>

      {/* Wilaya filter */}
      <div className="px-4 mb-3">
        <select
          value={filterWilaya}
          onChange={e => setFilterWilaya(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm text-right bg-white"
        >
          <option value="">كل الولايات</option>
          {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
        </select>
      </div>

      {/* Results */}
      <div className="px-4 mb-2">
        <p className="text-gray-500 text-sm font-bold">{filtered.length} نتيجة</p>
      </div>

      {/* Land list */}
      <div className="px-4 space-y-4 pb-24">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🌍</div>
            <p className="text-gray-500 text-lg font-bold">لا توجد أراضي مطابقة</p>
          </div>
        ) : (
          filtered.map(land => (
            <div key={land.id} onClick={() => navigate(`${basePath}/lands/${land.id}`)} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 cursor-pointer hover:shadow-md transition-shadow">
              {/* Cover media: video or image */}
              {(() => {
                const coverIsVideo = land.coverMediaType === 'video' && land.videos && land.videos.length > 0
                const hasImage = land.images && land.images.length > 0
                if (coverIsVideo) {
                  return (
                    <div className="relative">
                      <video src={land.videos![0]} className="w-full h-40 object-cover" muted playsInline />
                      <div className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full font-bold ${land.goal === 'بيع' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                        {land.goal === 'بيع' ? '🏷 للبيع' : '🤝 للإيجار'}
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-0.5 rounded-full">▶ فيديو</div>
                    </div>
                  )
                } else if (hasImage) {
                  return (
                    <div className="relative">
                      <img src={land.images![0]} className="w-full h-40 object-cover" />
                      <div className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full font-bold ${land.goal === 'بيع' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}`}>
                        {land.goal === 'بيع' ? '🏷 للبيع' : '🤝 للإيجار'}
                      </div>
                      {land.images!.length > 1 && (
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-0.5 rounded-full">
                          +{land.images!.length - 1} صور
                        </div>
                      )}
                    </div>
                  )
                } else {
                  return <div className={`h-1.5 ${land.goal === 'بيع' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                }
              })()}

              <div className="p-4">
                {/* Header row */}
                <div className="flex items-start justify-between mb-3">
                  {(!land.images || land.images.length === 0) && !(land.coverMediaType === 'video' && land.videos && land.videos.length > 0) && (
                    <div>
                      <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                        land.goal === 'بيع' ? 'bg-green-100 text-green-700' : 'bg-harvest-100 text-harvest-700'
                      }`}>
                        {land.goal === 'بيع' ? '🏷 للبيع' : '🤝 للإيجار'}
                      </span>
                    </div>
                  )}
                  {((land.images && land.images.length > 0) || (land.coverMediaType === 'video' && land.videos && land.videos.length > 0)) && <div />}
                  <div className="text-right">
                    <div className="text-2xl font-black text-gray-800">
                      {land.area} هكتار
                    </div>
                    <div className="flex items-center gap-1 justify-end text-sm text-gray-500">
                      <MapPin size={12} className="text-green-600" />
                      {land.wilaya}
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="bg-sage-50 rounded-xl px-3 py-2 mb-3">
                  <span className="text-xs text-gray-500 font-bold">الوثائق: </span>
                  <span className="text-xs text-primary-700 font-black">{land.documents}</span>
                </div>

                {/* Features */}
                {land.features.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {land.features.map(f => (
                      <span key={f} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                        {FEATURE_ICONS[f] || '✓'} {f}
                      </span>
                    ))}
                  </div>
                )}

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                  {land.description}
                </p>

                {/* Price row */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-500">{land.createdAt}</span>
                  <div className="text-right">
                    {land.price > 0 ? (
                      <span className="font-black text-harvest-600 text-base">
                        {land.price.toLocaleString()} مليون دج
                      </span>
                    ) : (
                      <span className="font-black text-gray-500 text-sm">
                        {land.priceType || 'قابل للتفاوض'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Phone + delete buttons */}
                <div className="flex gap-2 text-right rtl">
                  {land.phone && (
                    <a
                      href={`tel:${land.phone}`}
                      onClick={e => e.stopPropagation()}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-500 text-white font-bold text-sm hover:bg-earth-600 active:scale-95 transition-all"
                    >
                      <Phone size={16} />
                      {land.phone}
                    </a>
                  )}
                  {(land as any).agentId === currentUser?.id && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`${basePath}/edit-land/${land.id}`); }}
                        className="w-11 flex items-center justify-center rounded-xl bg-blue-50 border border-blue-200 text-blue-500 hover:bg-blue-100 active:scale-95 transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation()
                          if (!confirm('حذف هذا الإعلان نهائياً؟')) return
                          await deleteLand(land.id)
                        }}
                        className="w-11 flex items-center justify-center rounded-xl bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 active:scale-95 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate(`${basePath}/add-land`)}
        className="fixed bottom-24 left-4 w-14 h-14 bg-green-500 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-earth-600 active:scale-95 transition-all z-30"
      >
        <Plus size={28} />
      </button>
    </div>
  )
}
