import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import { CropType, CropStage, CROP_LABELS, CROP_EMOJIS, STAGE_LABELS, EquipmentCategory, LandGoal, EQUIPMENT_CATEGORIES, WILAYAS } from '../../types'
import { ArrowRight, X, Package, MapPin, DollarSign, Filter, Satellite, Map, Search } from 'lucide-react'
import { Crop } from '../../types'
import FilterModal, { FilterState } from '../../components/Shared/FilterModal'
import { CropImage } from '../../components/Shared/CropImage'

const WILAYA_COORDS: Record<string, [number, number]> = {
  'أدرار': [27.87, -0.29], 'الشلف': [36.16, 1.33], 'الأغواط': [33.8, 2.86],
  'أم البواقي': [35.88, 7.11], 'باتنة': [35.56, 6.17], 'بجاية': [36.75, 5.07],
  'بسكرة': [34.85, 5.73], 'بشار': [31.62, -2.22], 'البليدة': [36.47, 2.83],
  'البويرة': [36.37, 3.9], 'تمنراست': [22.78, 5.52], 'تبسة': [35.4, 8.12],
  'تلمسان': [34.88, -1.32], 'تيارت': [35.37, 1.32], 'تيزي وزو': [36.72, 4.05],
  'الجزائر': [36.74, 3.06], 'الجلفة': [34.67, 3.26], 'جيجل': [36.82, 5.77],
  'سطيف': [36.19, 5.41], 'سعيدة': [34.83, 0.15], 'سكيكدة': [36.88, 6.9],
  'سيدي بلعباس': [35.19, -0.64], 'عنابة': [36.9, 7.77], 'قالمة': [36.46, 7.43],
  'قسنطينة': [36.37, 6.61], 'المدية': [36.26, 2.75], 'مستغانم': [35.94, 0.09],
  'المسيلة': [35.7, 4.54], 'معسكر': [35.4, 0.14], 'ورقلة': [31.95, 5.33],
  'وهران': [35.7, -0.63], 'البيض': [33.69, 1.01], 'إليزي': [26.52, 8.47],
  'برج بوعريريج': [36.07, 4.76], 'بومرداس': [36.76, 3.48], 'الطارف': [36.77, 8.31],
  'تندوف': [27.67, -8.14], 'تيسمسيلت': [35.61, 1.81], 'الوادي': [33.37, 6.86],
  'خنشلة': [35.44, 7.14], 'سوق أهراس': [36.28, 7.95], 'تيبازة': [36.6, 2.47],
  'ميلة': [36.45, 6.26], 'عين الدفلى': [36.26, 1.97], 'النعامة': [33.27, -0.31],
  'عين تموشنت': [35.3, -1.14], 'غرداية': [32.49, 3.67], 'غليزان': [35.97, 0.57],
  'تيميمون': [29.26, 0.24], 'برج باجي مختار': [23.0, -0.95],
  'أولاد جلال': [34.42, 5.05], 'بني عباس': [30.13, -2.83],
  'إن صالح': [27.2, 2.47], 'إن قزام': [19.57, 5.77],
  'تقرت': [33.06, 6.07], 'جانت': [24.56, 9.49],
  'المغير': [33.95, 5.92], 'المنيعة': [29.78, 2.88],
}

function getCoords(item: { gpsLat?: number; gpsLng?: number; wilaya?: string }): [number, number] | null {
  if (item.gpsLat && item.gpsLng) return [item.gpsLat, item.gpsLng]
  if (item.wilaya && WILAYA_COORDS[item.wilaya]) return WILAYA_COORDS[item.wilaya]
  return null
}

function getDaysRemaining(date: string): number {
  const diff = new Date(date).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

const STAGE_COLORS: Record<string, string> = {
  seeds: '#7CB342',
  growth: '#2D6A4F',
  flowering: '#22c55e',
  ready: '#e53e3e',
}

const ALL_STAGES: CropStage[] = ['seeds', 'growth', 'flowering', 'ready']

const defaultFilters: FilterState = {
  cropTypes: [],
  stage: '',
  marketTarget: '',
  availability: 'all',
  wilaya: '',
  distanceKm: 2000,
}

let MapContainer: React.ComponentType<any>
let TileLayer: React.ComponentType<any>
let Marker: React.ComponentType<any>
let CircleMarker: React.ComponentType<any>
let useMap: () => any
let leafletLoaded = false
let leafletLib: any = null

type MapTab = 'crops' | 'lands' | 'equipment'

export default function CropMap() {
  const navigate = useNavigate()
  const { crops, farmers, lands, equipment, requestInspection, currentUser, fetchAll } = useAppStore()
  const [mapReady, setMapReady] = useState(false)
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null)
  const [selectedLand, setSelectedLand] = useState<any | null>(null)
  const [selectedEq, setSelectedEq] = useState<any | null>(null)
  const [showFilter, setShowFilter] = useState(false)
  const [satellite, setSatellite] = useState(false)
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [activeTab, setActiveTab] = useState<MapTab>('crops')
  const [landFilterGoal, setLandFilterGoal] = useState<LandGoal | ''>('')
  const [landFilterWilaya, setLandFilterWilaya] = useState('')
  const [eqFilterCategory, setEqFilterCategory] = useState<EquipmentCategory | ''>('')
  const [eqFilterWilaya, setEqFilterWilaya] = useState('')
  const [eqSearch, setEqSearch] = useState('')

  useEffect(() => { fetchAll() }, [])

  useEffect(() => {
    Promise.all([import('react-leaflet'), import('leaflet')]).then(([rl, L]) => {
      MapContainer = rl.MapContainer
      TileLayer = rl.TileLayer
      Marker = rl.Marker
      CircleMarker = rl.CircleMarker
      useMap = rl.useMap
      leafletLib = L.default
      delete (leafletLib.Icon.Default.prototype as any)._getIconUrl
      leafletLib.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })
      leafletLoaded = true
      setMapReady(true)
    }).catch(err => console.error('Failed to load leaflet:', err))
  }, [])

  const filteredCrops = crops
    .filter(crop => {
      if (filters.cropTypes.length > 0 && !filters.cropTypes.includes(crop.type)) return false
      if (filters.stage && crop.stage !== filters.stage) return false
      if (filters.marketTarget && crop.marketTarget !== filters.marketTarget) return false
      if (filters.wilaya && crop.wilaya !== filters.wilaya) return false
      if (filters.availability === 'ready' && crop.stage !== 'ready') return false
      if (filters.availability === 'notReady' && crop.stage === 'ready') return false
      return true
    })
    .map(crop => ({ ...crop, _coords: getCoords(crop) }))
    .filter(crop => crop._coords !== null) as any[]

  const landsWithCoords = lands
    .filter(l => {
      if (landFilterGoal && l.goal !== landFilterGoal) return false
      if (landFilterWilaya && l.wilaya !== landFilterWilaya) return false
      return true
    })
    .map(l => ({ ...l, _coords: getCoords(l) })).filter(l => l._coords !== null) as any[]

  const equipmentWithCoords = equipment
    .filter(e => {
      if (eqFilterCategory && e.category !== eqFilterCategory) return false
      if (eqFilterWilaya && e.wilaya !== eqFilterWilaya) return false
      if (eqSearch && !e.name?.includes(eqSearch) && !e.description?.includes(eqSearch)) return false
      return true
    })
    .map(e => ({ ...e, _coords: getCoords(e) })).filter(e => e._coords !== null) as any[]

  const activeFiltersCount =
    filters.cropTypes.length +
    (filters.stage ? 1 : 0) +
    (filters.marketTarget ? 1 : 0) +
    (filters.wilaya ? 1 : 0) +
    (filters.availability !== 'all' ? 1 : 0)

  const role = currentUser?.role || 'buyer'

  if (!mapReady || !MapContainer) {
    return (
      <div className="min-h-screen bg-sage-50 flex flex-col" dir="rtl">
        <div className="px-4 pt-10 pb-5" style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' }}>
          <button onClick={() => navigate(`/${role}`)} className="text-white mb-3 flex items-center gap-1">
            <ArrowRight size={20} />
            <span className="text-sm font-bold">رجوع</span>
          </button>
          <h1 className="text-white text-2xl font-black">🗺 خريطة التطبيق</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-bold">جاري تحميل الخريطة...</p>
          </div>
        </div>
      </div>
    )
  }

  const selectedFarmer = selectedCrop ? farmers.find(f => f.id === selectedCrop.farmerId) : null

  function FitBounds() {
    const map = useMap()
    useEffect(() => {
      if (!leafletLib) return
      let points: [number, number][] = []
      if (activeTab === 'crops') points = filteredCrops.map((c: any) => c._coords)
      if (activeTab === 'lands') points = landsWithCoords.map((l: any) => l._coords)
      if (activeTab === 'equipment') points = equipmentWithCoords.map((e: any) => e._coords)
      if (!points.length) return
      const bounds = leafletLib.latLngBounds(points)
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 })
    }, [activeTab, filteredCrops.length, landsWithCoords.length, equipmentWithCoords.length])
    return null
  }

  const TABS: { key: MapTab; label: string; emoji: string; color: string }[] = [
    { key: 'crops', label: 'المنتجات', emoji: '🌾', color: '#16a34a' },
    { key: 'lands', label: 'الأراضي', emoji: '🏞', color: '#92400e' },
    { key: 'equipment', label: 'المعدات', emoji: '🚜', color: '#1d4ed8' },
  ]

  return (
    <div className="min-h-screen bg-sage-50 flex flex-col" dir="rtl">

      {/* Header */}
      <div className="px-4 pt-10 pb-3" style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' }}>
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => navigate(`/${role}`)} className="text-white flex items-center gap-1">
            <ArrowRight size={22} />
            <span className="text-sm font-bold">رجوع</span>
          </button>
        </div>
        <h1 className="text-white text-2xl font-black text-right">🗺 خريطة التطبيق</h1>
        <p className="text-green-200 text-xs text-right mt-0.5">انقر على أي نقطة لعرض التفاصيل</p>

        {/* Tabs */}
        <div className="flex gap-2 mt-3">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSelectedCrop(null); setSelectedLand(null); setSelectedEq(null) }}
              className="flex-1 py-2 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-1"
              style={{
                background: activeTab === tab.key ? 'white' : 'rgba(255,255,255,0.15)',
                color: activeTab === tab.key ? tab.color : 'white',
              }}
            >
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>

        {/* Crops filter chips */}
        {activeTab === 'crops' && activeFiltersCount > 0 && (
          <div className="mt-2 flex gap-1.5 flex-wrap">
            {filters.stage && (
              <span className="flex items-center gap-1 bg-white bg-opacity-20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: STAGE_COLORS[filters.stage] }} />
                {STAGE_LABELS[filters.stage]}
                <button onClick={() => setFilters(f => ({ ...f, stage: '' }))}><X size={10} /></button>
              </span>
            )}
            {filters.cropTypes.map(t => (
              <span key={t} className="flex items-center gap-1 bg-white bg-opacity-20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {CROP_EMOJIS[t]} {CROP_LABELS[t]}
                <button onClick={() => setFilters(f => ({ ...f, cropTypes: f.cropTypes.filter(x => x !== t) }))}><X size={10} /></button>
              </span>
            ))}
            {filters.wilaya && (
              <span className="flex items-center gap-1 bg-white bg-opacity-20 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                <MapPin size={10} />{filters.wilaya}
                <button onClick={() => setFilters(f => ({ ...f, wilaya: '' }))}><X size={10} /></button>
              </span>
            )}
            <button onClick={() => setFilters(defaultFilters)} className="text-red-300 text-xs font-bold underline">مسح الكل</button>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="px-3 py-2 flex items-center gap-2 bg-white border-b border-gray-100 overflow-x-auto">
        <button
          onClick={() => setSatellite(v => !v)}
          className="flex-shrink-0 flex items-center gap-1 border rounded-lg px-2 py-1 text-xs font-bold transition-all"
          style={{
            background: satellite ? '#1e3a5f' : '#f9fafb',
            color: satellite ? 'white' : '#374151',
            border: satellite ? '1.5px solid #1e3a5f' : '1.5px solid #e5e7eb',
          }}
        >
          {satellite ? <Map size={12} /> : <Satellite size={12} />}
          {satellite ? 'عادية' : 'فضائية'}
        </button>

        <div className="w-px h-5 bg-gray-200 flex-shrink-0" />

        {activeTab === 'crops' && (
          <>
            {ALL_STAGES.map(stage => (
              <button
                key={stage}
                onClick={() => setFilters(f => ({ ...f, stage: f.stage === stage ? '' : stage }))}
                className="flex-shrink-0 flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold transition-all"
                style={{
                  background: filters.stage === stage ? STAGE_COLORS[stage] + '22' : '#f9fafb',
                  color: filters.stage === stage ? STAGE_COLORS[stage] : '#6b7280',
                  border: filters.stage === stage ? `1.5px solid ${STAGE_COLORS[stage]}` : '1.5px solid #e5e7eb',
                }}
              >
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: STAGE_COLORS[stage] }} />
                {STAGE_LABELS[stage as keyof typeof STAGE_LABELS]}
              </button>
            ))}
            <div className="w-px h-5 bg-gray-200 flex-shrink-0" />
            <button
              onClick={() => setShowFilter(true)}
              className="flex-shrink-0 relative flex items-center gap-1 border rounded-lg px-2 py-1 text-xs font-bold"
              style={{
                background: activeFiltersCount > 0 ? '#fef3c7' : '#f9fafb',
                color: activeFiltersCount > 0 ? '#92400e' : '#374151',
                border: activeFiltersCount > 0 ? '1.5px solid #f59e0b' : '1.5px solid #e5e7eb',
              }}
            >
              <Filter size={12} />
              فلترة
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-amber-400 text-white rounded-full text-xs flex items-center justify-center font-black leading-none">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            <span className="flex-shrink-0 text-xs text-gray-400 font-bold mr-auto">{filteredCrops.length}/{crops.length}</span>
          </>
        )}

        {activeTab === 'lands' && (
          <>
            {(['بيع', 'إيجار'] as LandGoal[]).map(goal => (
              <button
                key={goal}
                onClick={() => setLandFilterGoal(v => v === goal ? '' : goal)}
                className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold border transition-all"
                style={{
                  background: landFilterGoal === goal ? '#92400e22' : '#f9fafb',
                  color: landFilterGoal === goal ? '#92400e' : '#6b7280',
                  border: landFilterGoal === goal ? '1.5px solid #92400e' : '1.5px solid #e5e7eb',
                }}
              >
                {goal === 'بيع' ? '🏷 بيع' : '🔑 إيجار'}
              </button>
            ))}
            <div className="w-px h-5 bg-gray-200 flex-shrink-0" />
            <select
              value={landFilterWilaya}
              onChange={e => setLandFilterWilaya(e.target.value)}
              className="flex-shrink-0 text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-700 font-bold"
              style={{ maxWidth: 110 }}
            >
              <option value="">كل الولايات</option>
              {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
            {(landFilterGoal || landFilterWilaya) && (
              <button onClick={() => { setLandFilterGoal(''); setLandFilterWilaya('') }} className="text-red-400 text-xs font-bold flex-shrink-0">
                <X size={14} />
              </button>
            )}
            <span className="flex-shrink-0 text-xs text-gray-400 font-bold mr-auto">{landsWithCoords.length}/{lands.length}</span>
          </>
        )}

        {activeTab === 'equipment' && (
          <>
            <div className="flex-shrink-0 relative">
              <Search size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={eqSearch}
                onChange={e => setEqSearch(e.target.value)}
                placeholder="بحث..."
                className="text-xs border border-gray-200 rounded-lg pr-6 pl-2 py-1 bg-white font-bold"
                style={{ width: 90 }}
              />
            </div>
            <select
              value={eqFilterCategory}
              onChange={e => setEqFilterCategory(e.target.value as EquipmentCategory | '')}
              className="flex-shrink-0 text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-700 font-bold"
              style={{ maxWidth: 110 }}
            >
              <option value="">كل الفئات</option>
              {EQUIPMENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={eqFilterWilaya}
              onChange={e => setEqFilterWilaya(e.target.value)}
              className="flex-shrink-0 text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-700 font-bold"
              style={{ maxWidth: 100 }}
            >
              <option value="">كل الولايات</option>
              {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
            {(eqFilterCategory || eqFilterWilaya || eqSearch) && (
              <button onClick={() => { setEqFilterCategory(''); setEqFilterWilaya(''); setEqSearch('') }} className="text-red-400 text-xs font-bold flex-shrink-0">
                <X size={14} />
              </button>
            )}
            <span className="flex-shrink-0 text-xs text-gray-400 font-bold mr-auto">{equipmentWithCoords.length}/{equipment.length}</span>
          </>
        )}
      </div>

      {/* Map */}
      <div className="flex-1" style={{ minHeight: '52vh' }}>
        <MapContainer
          center={[28.0, 2.5]}
          zoom={5}
          style={{ height: '52vh', width: '100%' }}
          zoomControl={true}
          key={activeTab}
        >
          {satellite ? (
            <>
              <TileLayer
                attribution='&copy; Esri'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
              />
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
                opacity={0.8}
              />
            </>
          ) : (
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
          )}

          <FitBounds />

          {/* Crops markers */}
          {activeTab === 'crops' && filteredCrops.map(crop => {
            const color = STAGE_COLORS[crop.stage] || '#2D6A4F'
            const isSelected = selectedCrop?.id === crop.id
            const customIcon = leafletLib.divIcon({
              className: '',
              html: `<div style="background:${isSelected ? '#1B4332' : color};color:white;border:${isSelected ? '3px solid #FFD700' : '2px solid white'};border-radius:20px;padding:3px 8px;font-size:11px;font-weight:bold;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.3);font-family:Tahoma,Arial,sans-serif;direction:rtl;transform:${isSelected ? 'scale(1.15)' : 'scale(1)'};">${(CROP_EMOJIS as any)[crop.type]} ${(CROP_LABELS as any)[crop.type]}</div>`,
              iconAnchor: [30, 15],
            })
            return (
              <Marker key={crop.id} position={crop._coords} icon={customIcon}
                eventHandlers={{ click: () => setSelectedCrop(selectedCrop?.id === crop.id ? null : crop) }}
              />
            )
          })}

          {/* Lands markers */}
          {activeTab === 'lands' && landsWithCoords.map(land => {
            const isSelected = selectedLand?.id === land.id
            const customIcon = leafletLib.divIcon({
              className: '',
              html: `<div style="background:${isSelected ? '#78350f' : '#92400e'};color:white;border:${isSelected ? '3px solid #FFD700' : '2px solid white'};border-radius:20px;padding:3px 8px;font-size:11px;font-weight:bold;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.3);font-family:Tahoma,Arial,sans-serif;direction:rtl;">🏞 ${land.area} هـ</div>`,
              iconAnchor: [30, 15],
            })
            return (
              <Marker key={land.id} position={land._coords} icon={customIcon}
                eventHandlers={{ click: () => setSelectedLand(selectedLand?.id === land.id ? null : land) }}
              />
            )
          })}

          {/* Equipment markers */}
          {activeTab === 'equipment' && equipmentWithCoords.map(eq => {
            const isSelected = selectedEq?.id === eq.id
            const customIcon = leafletLib.divIcon({
              className: '',
              html: `<div style="background:${isSelected ? '#1e3a8a' : '#1d4ed8'};color:white;border:${isSelected ? '3px solid #FFD700' : '2px solid white'};border-radius:20px;padding:3px 8px;font-size:11px;font-weight:bold;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.3);font-family:Tahoma,Arial,sans-serif;direction:rtl;">🚜 ${eq.name}</div>`,
              iconAnchor: [30, 15],
            })
            return (
              <Marker key={eq.id} position={eq._coords} icon={customIcon}
                eventHandlers={{ click: () => setSelectedEq(selectedEq?.id === eq.id ? null : eq) }}
              />
            )
          })}
        </MapContainer>
      </div>

      {/* Bottom card — Crop */}
      {activeTab === 'crops' && selectedCrop && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50" dir="rtl">
          <div className="bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 px-4 pt-4 pb-6">
            <div className="flex items-center justify-between mb-3">
              <button onClick={() => setSelectedCrop(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <X size={18} className="text-gray-600" />
              </button>
              <div className="flex items-center gap-2">
                <div className="text-xl font-black text-gray-800">{CROP_EMOJIS[selectedCrop.type]} {CROP_LABELS[selectedCrop.type]}</div>
                {selectedCrop.marketTarget && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${selectedCrop.marketTarget === 'محلي' ? 'bg-harvest-100 text-harvest-700' : 'bg-blue-100 text-blue-700'}`}>
                    {selectedCrop.marketTarget}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <CropImage type={selectedCrop.type} images={selectedCrop.images} className="w-20 h-20 rounded-2xl flex-shrink-0" emojiSize="text-4xl" />
              <div className="flex-1">
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                  <MapPin size={12} className="text-primary-500" />
                  {selectedCrop.wilaya}
                  {selectedFarmer && <span> • {selectedFarmer.name}</span>}
                </div>
                <div className="flex gap-2 mb-2">
                  <span className="text-xs bg-sage-100 text-primary-700 px-2 py-0.5 rounded-lg font-bold">
                    <Package size={10} className="inline ml-0.5" />
                    {(selectedCrop.estimatedQuantityKg / 1000).toFixed(1)} طن
                  </span>
                  {selectedCrop.pricePerKg && (
                    <span className="text-xs bg-harvest-100 text-harvest-700 px-2 py-0.5 rounded-lg font-bold">
                      <DollarSign size={10} className="inline ml-0.5" />
                      {selectedCrop.pricePerKg} دج/كغ
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 mb-1">المرحلة: <span className="font-bold text-primary-600">{STAGE_LABELS[selectedCrop.stage]}</span></div>
                {selectedCrop.description && <p className="text-xs text-gray-500 line-clamp-2">{selectedCrop.description}</p>}
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => { requestInspection(selectedCrop.id); setSelectedCrop(null) }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-primary-500 text-white">
                🔍 طلب معاينة
              </button>
              <button onClick={() => { navigate(`/${role}/crop/${selectedCrop.id}`); setSelectedCrop(null) }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-amber-500 text-white">
                عرض التفاصيل
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom card — Land */}
      {activeTab === 'lands' && selectedLand && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50" dir="rtl">
          <div className="bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 px-4 pt-4 pb-6">
            <div className="flex items-center justify-between mb-3">
              <button onClick={() => setSelectedLand(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <X size={18} className="text-gray-600" />
              </button>
              <div className="text-xl font-black text-gray-800">🏞 أرض {selectedLand.area} هكتار</div>
            </div>
            <div className="flex gap-3 mb-3">
              {selectedLand.images?.[0] ? (
                <img src={selectedLand.images[0]} className="w-20 h-20 rounded-2xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0 text-3xl">🏞</div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                  <MapPin size={12} className="text-amber-600" />{selectedLand.wilaya}
                </div>
                <div className="flex gap-2 mb-1 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${selectedLand.goal === 'بيع' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {selectedLand.goal === 'بيع' ? 'للبيع' : 'للإيجار'}
                  </span>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                    {selectedLand.price} مليون دج
                  </span>
                </div>
                {selectedLand.description && <p className="text-xs text-gray-500 line-clamp-2">{selectedLand.description}</p>}
              </div>
            </div>
            <button onClick={() => { navigate(`/${role}/lands/${selectedLand.id}`); setSelectedLand(null) }}
              className="w-full py-2.5 rounded-xl text-sm font-bold bg-amber-600 text-white">
              عرض التفاصيل
            </button>
          </div>
        </div>
      )}

      {/* Bottom card — Equipment */}
      {activeTab === 'equipment' && selectedEq && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50" dir="rtl">
          <div className="bg-white rounded-t-3xl shadow-2xl border-t border-gray-100 px-4 pt-4 pb-6">
            <div className="flex items-center justify-between mb-3">
              <button onClick={() => setSelectedEq(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <X size={18} className="text-gray-600" />
              </button>
              <div className="text-xl font-black text-gray-800">🚜 {selectedEq.name}</div>
            </div>
            <div className="flex gap-3 mb-3">
              {selectedEq.images?.[0] ? (
                <img src={selectedEq.images[0]} className="w-20 h-20 rounded-2xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0 text-3xl">🚜</div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                  <MapPin size={12} className="text-blue-600" />{selectedEq.wilaya}
                </div>
                <div className="flex gap-2 mb-1">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">{selectedEq.category}</span>
                  {selectedEq.pricePerDay && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">{selectedEq.pricePerDay} دج/يوم</span>
                  )}
                </div>
                {selectedEq.description && <p className="text-xs text-gray-500 line-clamp-2">{selectedEq.description}</p>}
              </div>
            </div>
            <div className="flex gap-2">
              <a href={`tel:${selectedEq.phone}`}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white text-center">
                📞 اتصال
              </a>
              <button onClick={() => { navigate(`/${role}/equipment/${selectedEq.id}`); setSelectedEq(null) }}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-amber-500 text-white">
                عرض التفاصيل
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {activeTab === 'crops' && (
        <FilterModal
          isOpen={showFilter}
          onClose={() => setShowFilter(false)}
          filters={filters}
          onApply={setFilters}
        />
      )}
    </div>
  )
}
