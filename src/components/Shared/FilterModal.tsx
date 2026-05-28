import React, { useState } from 'react'
import { X } from 'lucide-react'
import { CropType, CropStage, MarketTarget, CROP_LABELS, STAGE_LABELS, WILAYAS } from '../../types'
import { CROP_SVG_ICONS } from './CropSVGIcons'

export interface FilterState {
  cropTypes: CropType[]
  stage: CropStage | ''
  marketTarget: MarketTarget | ''
  availability: 'all' | 'ready' | 'notReady'
  wilaya: string
  distanceKm: number
}

interface FilterModalProps {
  isOpen: boolean
  onClose: () => void
  filters: FilterState
  onApply: (filters: FilterState) => void
}

const ALL_CROP_TYPES: CropType[] = [
  'tomato', 'potato', 'citrus', 'watermelon', 'pepper', 'onion', 'wheat', 'olive',
  'carrot', 'garlic', 'eggplant', 'zucchini', 'cucumber', 'lettuce', 'fig', 'grape',
  'apricot', 'peach', 'apple', 'dates', 'corn', 'barley', 'pumpkin', 'beans',
  'lentils', 'chickpeas', 'sunflower', 'strawberry',
]

const STAGE_COLORS: Record<string, string> = {
  seeds: '#7CB342',
  growth: '#2D6A4F',
  flowering: '#22c55e',
  ready: '#e53e3e',
}

export default function FilterModal({ isOpen, onClose, filters, onApply }: FilterModalProps) {
  const [local, setLocal] = useState<FilterState>({ ...filters })

  if (!isOpen) return null

  const toggleCropType = (type: CropType) => {
    setLocal(prev => ({
      ...prev,
      cropTypes: prev.cropTypes.includes(type)
        ? prev.cropTypes.filter(t => t !== type)
        : [...prev.cropTypes, type],
    }))
  }

  const handleApply = () => { onApply(local); onClose() }

  const handleReset = () => {
    const reset: FilterState = { cropTypes: [], stage: '', marketTarget: '', availability: 'all', wilaya: '', distanceKm: 2000 }
    setLocal(reset)
    onApply(reset)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" dir="rtl">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-t-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white px-4 pt-4 pb-3 border-b border-gray-100 z-10">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <button onClick={handleReset} className="text-red-500 font-bold text-sm">مسح الكل</button>
            <h2 className="font-black text-gray-800 text-lg">تصفية النتائج</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <X size={18} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="px-4 py-4 space-y-6">

          {/* Crop type — horizontal scroll */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-primary-600 font-bold">
                {local.cropTypes.length > 0 ? `${local.cropTypes.length} مختار` : ''}
              </span>
              <p className="font-black text-gray-800 text-sm">نوع المحصول</p>
            </div>
            <div
              className="flex gap-3 overflow-x-auto pb-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {ALL_CROP_TYPES.map(type => {
                const icon = CROP_SVG_ICONS[type]
                const Icon = icon?.component
                const active = local.cropTypes.includes(type)
                return (
                  <button
                    key={type}
                    onClick={() => toggleCropType(type)}
                    className="flex-shrink-0 flex flex-col items-center gap-1 transition-all"
                    style={{ width: '64px' }}
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center p-2 transition-all"
                      style={{
                        background: active ? '#2D6A4F' : (icon?.bg || '#f0fdf4'),
                        border: active ? '2.5px solid #1B4332' : '2px solid transparent',
                        boxShadow: active ? '0 0 0 3px rgba(45,106,79,0.2)' : '0 1px 4px rgba(0,0,0,0.07)',
                      }}
                    >
                      {Icon && <Icon />}
                    </div>
                    <span className={`text-xs font-bold leading-tight text-center w-full truncate ${active ? 'text-primary-700' : 'text-gray-600'}`}>
                      {CROP_LABELS[type]}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Stage */}
          <div>
            <p className="font-black text-gray-800 text-sm mb-3 text-right">مرحلة النمو</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setLocal(prev => ({ ...prev, stage: '' }))}
                className={`py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                  local.stage === '' ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                الكل
              </button>
              {(['seeds', 'growth', 'flowering', 'ready'] as CropStage[]).map(s => (
                <button
                  key={s}
                  onClick={() => setLocal(prev => ({ ...prev, stage: local.stage === s ? '' : s }))}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                    local.stage === s ? 'text-white border-transparent' : 'bg-white text-gray-600 border-gray-200'
                  }`}
                  style={local.stage === s ? { background: STAGE_COLORS[s] } : {}}
                >
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: STAGE_COLORS[s] }} />
                  {STAGE_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Market target */}
          <div>
            <p className="font-black text-gray-800 text-sm mb-3 text-right">السوق المستهدف</p>
            <div className="flex gap-2">
              {(['', 'محلي', 'تصدير'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setLocal(prev => ({ ...prev, marketTarget: t as MarketTarget | '' }))}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                    local.marketTarget === t
                      ? t === 'محلي' ? 'bg-amber-500 text-white border-amber-500'
                        : t === 'تصدير' ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-primary-500 text-white border-primary-500'
                      : 'bg-white text-gray-600 border-gray-200'
                  }`}
                >
                  {t === '' ? 'الكل' : t === 'محلي' ? '🏠 محلي' : '✈️ تصدير'}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Availability */}
          <div>
            <p className="font-black text-gray-800 text-sm mb-3 text-right">التوفر</p>
            <div className="flex gap-2">
              {([
                { value: 'all', label: 'الكل', color: '#2D6A4F' },
                { value: 'ready', label: '✅ جاهز', color: '#e53e3e' },
                { value: 'notReady', label: '🌱 قريباً', color: '#7CB342' },
              ] as const).map(item => (
                <button
                  key={item.value}
                  onClick={() => setLocal(prev => ({ ...prev, availability: item.value }))}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${
                    local.availability === item.value
                      ? 'text-white border-transparent'
                      : 'bg-white text-gray-600 border-gray-200'
                  }`}
                  style={local.availability === item.value ? { background: item.color } : {}}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Distance slider */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-amber-600 font-black text-sm">{local.distanceKm} كم</span>
              <p className="font-black text-gray-800 text-sm">المسافة القصوى</p>
            </div>
            <input
              type="range" min="0" max="2000" step="10"
              value={local.distanceKm}
              onChange={e => setLocal(prev => ({ ...prev, distanceKm: parseInt(e.target.value) }))}
              className="w-full accent-primary-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>2000 كم</span>
              <span>0 كم</span>
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Wilaya */}
          <div>
            <p className="font-black text-gray-800 text-sm mb-3 text-right">الولاية</p>
            <select
              value={local.wilaya}
              onChange={e => setLocal(prev => ({ ...prev, wilaya: e.target.value }))}
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm text-right bg-white focus:outline-none focus:border-primary-500 font-bold"
            >
              <option value="">كل الولايات</option>
              {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
        </div>

        {/* Apply button */}
        <div className="sticky bottom-0 bg-white px-4 py-4 border-t border-gray-100">
          <button
            onClick={handleApply}
            className="w-full bg-primary-500 text-white rounded-2xl py-4 font-black text-lg shadow-lg active:scale-95 transition-all"
          >
            تطبيق الفلاتر
          </button>
        </div>
      </div>
    </div>
  )
}
