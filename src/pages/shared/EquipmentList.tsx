import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import { EquipmentCategory, EQUIPMENT_CATEGORIES, WILAYAS } from '../../types'
import { Plus, Phone, MapPin, Filter, X, Search, Trash2, Edit2 } from 'lucide-react'

const CATEGORY_EMOJIS: Record<EquipmentCategory, string> = {
  'معدات ري': '💧',
  'جرارات': '🚜',
  'بيوت بلاستيكية': '🏠',
  'أسمدة': '🌿',
  'بذور': '🌱',
}

const CATEGORY_COLORS: Record<EquipmentCategory, string> = {
  'معدات ري': 'bg-blue-100 text-blue-700',
  'جرارات': 'bg-yellow-100 text-yellow-700',
  'بيوت بلاستيكية': 'bg-green-100 text-green-700',
  'أسمدة': 'bg-emerald-100 text-emerald-700',
  'بذور': 'bg-lime-100 text-lime-700',
}

export default function EquipmentList() {
  const navigate = useNavigate()
  const { equipment, currentUser, deleteEquipment, fetchAll } = useAppStore()

  useEffect(() => { fetchAll() }, [])
  const [filterCategory, setFilterCategory] = useState<EquipmentCategory | ''>('')
  const [filterWilaya, setFilterWilaya] = useState('')
  const [searchText, setSearchText] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = equipment.filter(eq => {
    if (filterCategory && eq.category !== filterCategory) return false
    if (filterWilaya && eq.wilaya !== filterWilaya) return false
    if (searchText && !eq.name.includes(searchText) && !eq.description.includes(searchText)) return false
    return true
  })

  const basePath = currentUser?.role === 'buyer' ? '/buyer' : currentUser?.role === 'farmer' ? '/farmer' : '/agent'

  return (
    <div className="min-h-screen bg-sage-50" dir="rtl">
      {/* Header */}
      <div
        className="px-4 pt-10 pb-5"
        style={{ background: 'linear-gradient(135deg, #2D6A4F 0%, #1B4332 100%)' }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="text-sage-300 text-sm font-bold">سوق المعدات الفلاحية</div>
          <div className="text-white text-sm">{currentUser?.name}</div>
        </div>
        <h1 className="text-white text-2xl font-black">🔧 المعدات والأدوات</h1>
        <p className="text-sage-300 text-sm mt-1">{equipment.length} إعلان متاح</p>

        {/* Search */}
        <div className="mt-3 relative">
          <input
            type="text"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            placeholder="ابحث عن معدة..."
            className="w-full bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-60 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:bg-opacity-30"
          />
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white opacity-60" />
        </div>
      </div>

      {/* Category chips */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setFilterCategory('')}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-bold border transition-all ${
            filterCategory === '' ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-600 border-gray-200'
          }`}
        >
          الكل
        </button>
        {EQUIPMENT_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(filterCategory === cat ? '' : cat)}
            className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold border transition-all ${
              filterCategory === cat ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-600 border-gray-200'
            }`}
          >
            {CATEGORY_EMOJIS[cat]} {cat}
            {filterCategory === cat && <X size={12} />}
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

      {/* Equipment list */}
      <div className="px-4 space-y-4 pb-24">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔧</div>
            <p className="text-gray-500 text-lg font-bold">لا توجد معدات مطابقة</p>
          </div>
        ) : (
          filtered.map(eq => (
            <div key={eq.id} onClick={() => navigate(`${basePath}/equipment/${eq.id}`)} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 cursor-pointer hover:shadow-md transition-shadow">
              {/* Cover media: video or image */}
              {(() => {
                const coverIsVideo = eq.coverMediaType === 'video' && eq.videos && eq.videos.length > 0
                const hasImage = eq.images && eq.images.length > 0
                if (coverIsVideo) {
                  return (
                    <div className="relative">
                      <video src={eq.videos![0]} className="w-full h-36 object-cover" muted playsInline />
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-0.5 rounded-full">▶ فيديو</div>
                    </div>
                  )
                } else if (hasImage) {
                  return (
                    <div className="relative">
                      <img src={eq.images![0]} className="w-full h-36 object-cover" />
                      {eq.images!.length > 1 && (
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-0.5 rounded-full">
                          +{eq.images!.length - 1} صور
                        </div>
                      )}
                    </div>
                  )
                } else {
                  return <div className="h-1.5 bg-primary-500" />
                }
              })()}

              <div className="p-4">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 ${eq.images?.length ? 'bg-white border border-gray-100 shadow-sm' : 'bg-sage-100'}`}>
                    {CATEGORY_EMOJIS[eq.category]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${CATEGORY_COLORS[eq.category]}`}>
                        {eq.category}
                      </span>
                    </div>
                    <h3 className="font-black text-gray-800 text-base mt-1 leading-tight">{eq.name}</h3>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">{eq.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={12} className="text-primary-500" />
                        {eq.wilaya}
                      </span>
                      {eq.pricePerDay ? (
                        <span className="text-xs font-black text-harvest-600">
                          {eq.pricePerDay.toLocaleString()} دج/يوم
                        </span>
                      ) : (
                        <span className="text-xs font-black text-harvest-600">
                          للتواصل عبر الهاتف
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 flex gap-2">
                  <a
                    href={`tel:${eq.phone}`}
                    onClick={e => e.stopPropagation()}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary-500 text-white font-bold text-sm hover:bg-primary-600 active:scale-95 transition-all"
                  >
                    <Phone size={16} />
                    {eq.phone}
                  </a>
                  {(eq as any).agentId === currentUser?.id && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`${basePath}/edit-equipment/${eq.id}`); }}
                        className="w-11 flex items-center justify-center rounded-xl bg-blue-50 border border-blue-200 text-blue-500 hover:bg-blue-100 active:scale-95 transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={async (e) => {
                          e.stopPropagation()
                          if (!confirm('حذف هذه المعدة نهائياً؟')) return
                          await deleteEquipment(eq.id)
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
        onClick={() => navigate(`${basePath}/add-equipment`)}
        className="fixed bottom-24 left-4 w-14 h-14 bg-yellow-500 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-harvest-600 active:scale-95 transition-all z-30"
      >
        <Plus size={28} />
      </button>
    </div>
  )
}
