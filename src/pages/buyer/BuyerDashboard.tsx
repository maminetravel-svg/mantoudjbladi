import React, { useState, useRef, useCallback, useEffect } from 'react'
import { BadgesSection } from '../../components/Shared/BadgesSection'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import { CropProgressBar } from '../../components/Shared/CropProgressBar'
import { TrustScore } from '../../components/Shared/TrustScore'
import FilterModal, { FilterState } from '../../components/Shared/FilterModal'
import ViewToggle, { ViewMode } from '../../components/Shared/ViewToggle'
import { ContactHub } from '../../components/Shared/ContactHub'
import { InspectionModal } from '../../components/Shared/InspectionModal'
import { CROP_LABELS, CROP_EMOJIS, STAGE_LABELS, STAGE_LABELS as _SL } from '../../types'
import { CROP_SVG_ICONS } from '../../components/Shared/CropSVGIcons'
import { Map, Filter, BarChart2, Navigation, Volume2, VolumeX, Bell, X } from 'lucide-react'
import { showToast } from '../../components/Shared/Toast'
import { VideoFullscreen } from '../../components/Shared/VideoPlayer'
import { CropImage } from '../../components/Shared/CropImage'

// Suppress unused import warning
void _SL

function getDaysRemaining(date: string): number {
  const diff = new Date(date).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ar-DZ', { day: 'numeric', month: 'long', year: 'numeric' })
}

const STAGE_COLOR: Record<string, string> = {
  seeds: '#74b569',
  growth: '#2D6A4F',
  flowering: '#22c55e',
  ready: '#dc2626',
}

const defaultFilters: FilterState = {
  cropTypes: [],
  stage: '',
  marketTarget: '',
  availability: 'all',
  wilaya: '',
  distanceKm: 2000,
}


export default function BuyerDashboard() {
  const navigate = useNavigate()
  const { crops, farmers, currentUser, fetchAll } = useAppStore()
  const cropPath = (id: string) => currentUser?.role === 'farmer' ? `/farmer/market/${id}` : `/buyer/crop/${id}`
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [nearbyOnly, setNearbyOnly] = useState(false)
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [inspectionTarget, setInspectionTarget] = useState<{ cropId: string; cropName: string; farmerName: string; wilaya: string } | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [unmutedId, setUnmutedId] = useState<string | null>(null)
  const [fullscreenVideo, setFullscreenVideo] = useState<string | null>(null)
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Haversine distance in km
  const haversine = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  }

  const handleNearbyToggle = () => {
    if (nearbyOnly) {
      setNearbyOnly(false)
      return
    }
    if (userPosition) {
      setNearbyOnly(true)
      return
    }
    if (!navigator.geolocation) {
      showToast('المتصفح لا يدعم GPS', 'error')
      return
    }
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setNearbyOnly(true)
        setGpsLoading(false)
        showToast('✅ تم تحديد موقعك')
      },
      () => {
        setGpsLoading(false)
        showToast('تعذّر تحديد موقعك. تأكد من تفعيل GPS.', 'error')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  // Build video map: show video for any crop that has videos
  const resolvedVideoMap = Object.fromEntries(
    crops
      .filter(c => c.videos?.length)
      .map(c => [c.id, c.videos![0]])
  )

  useEffect(() => { fetchAll() }, [])

  // Auto-play videos when in viewport, pause when out
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const vid = entry.target as HTMLVideoElement
          if (entry.isIntersecting) {
            vid.play().catch(() => {})
          } else {
            vid.pause()
          }
        })
      },
      { threshold: 0.4 }
    )
    return () => observerRef.current?.disconnect()
  }, [])

  const setVideoRef = useCallback((el: HTMLVideoElement | null, id: string) => {
    const prev = videoRefs.current[id]
    if (prev && observerRef.current) observerRef.current.unobserve(prev)
    videoRefs.current[id] = el
    if (el && observerRef.current) observerRef.current.observe(el)
  }, [])

  const toggleMute = useCallback((e: React.MouseEvent, cropId: string) => {
    e.stopPropagation()
    const vid = videoRefs.current[cropId]
    if (!vid) return
    if (unmutedId === cropId) {
      vid.muted = true
      setUnmutedId(null)
    } else {
      if (unmutedId && videoRefs.current[unmutedId]) {
        videoRefs.current[unmutedId]!.muted = true
      }
      vid.muted = false
      setUnmutedId(cropId)
    }
  }, [unmutedId])

  const filteredCrops = crops.filter(crop => {
    if (filters.cropTypes.length > 0 && !filters.cropTypes.includes(crop.type)) return false
    if (filters.wilaya && crop.wilaya !== filters.wilaya) return false
    if (filters.stage && crop.stage !== filters.stage) return false
    if (filters.marketTarget && crop.marketTarget !== filters.marketTarget) return false
    if (filters.availability === 'ready' && crop.stage !== 'ready') return false
    if (filters.availability === 'notReady' && crop.stage === 'ready') return false
    if (nearbyOnly && userPosition) {
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
      const cropCoords = (crop.gpsLat && crop.gpsLng)
        ? [crop.gpsLat, crop.gpsLng] as [number, number]
        : WILAYA_COORDS[crop.wilaya]
      if (!cropCoords) return false
      const dist = haversine(userPosition.lat, userPosition.lng, cropCoords[0], cropCoords[1])
      if (dist > filters.distanceKm) return false
    }
    return true
  })

  const upcomingTons = crops
    .filter(c => getDaysRemaining(c.expectedHarvestDate) <= 90)
    .reduce((sum, c) => sum + c.estimatedQuantityKg, 0)

  const myPendingOrders = crops.flatMap((crop: any) =>
    (crop.preOrders || []).filter((o: any) => o.buyerId === currentUser?.id && o.status === 'pending').map((o: any) => ({ ...o, crop }))
  )
  const myPendingInspections = crops.flatMap((crop: any) =>
    (crop.inspectionRequests || []).filter((r: any) => r.buyerId === currentUser?.id && r.status === 'pending').map((r: any) => ({ ...r, crop }))
  )
  const notifCount = myPendingOrders.length + myPendingInspections.length

  const activeFiltersCount = [
    filters.cropTypes.length > 0,
    filters.stage !== '',
    filters.marketTarget !== '',
    filters.availability !== 'all',
    filters.wilaya !== '',
    filters.distanceKm < 2000,
  ].filter(Boolean).length

  const stageColor = (stage: string) => STAGE_COLOR[stage] || '#2D6A4F'

  return (
    <div className="min-h-screen bg-sage-50" dir="rtl">
      {/* Header */}
      <div
        className="px-4 pt-10 pb-4"
        style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' }}
      >
        {/* Top action buttons */}
        <div className="flex items-center gap-2 mb-3" style={{ direction: 'ltr' }}>
          <button onClick={() => navigate('/buyer/settings')} className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all text-white" title="الملف الشخصي">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          </button>
          <button onClick={() => setShowNotifications(true)} className="relative w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all text-white" title="الإشعارات">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-black">{notifCount}</span>
            )}
          </button>
          <button onClick={() => navigate('/buyer/ai')} className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all text-white" title="المساعد الذكي">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="15" x2="8" y2="15"/><line x1="16" y1="15" x2="16" y2="15"/></svg>
          </button>
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-earth-200 text-sm font-bold">
            {currentUser?.role === 'farmer' ? 'فلاح' : currentUser?.role === 'agent' ? 'وسيط' : 'مشتري / مصنع'}
          </div>
          <div className="text-white text-sm">{currentUser?.name}</div>
        </div>
        <h1 className="text-white text-2xl font-black">🏭 سوق المحاصيل القادمة</h1>

        {/* Stat card */}
        <div className="mt-3 bg-white bg-opacity-15 rounded-2xl px-4 py-3 flex items-center gap-3">
          <BarChart2 size={28} className="text-harvest-300" />
          <div>
            <div className="text-white font-black text-lg">{(upcomingTons / 1000).toFixed(1)} طن</div>
            <div className="text-earth-200 text-xs">المحاصيل المتوقعة خلال 3 أشهر</div>
          </div>
        </div>
      </div>

      {/* Controls bar */}
      <div className="px-4 py-3 flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        <button
          onClick={() => navigate(currentUser?.role === 'farmer' ? '/farmer/map' : '/buyer/map')}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 shadow-sm hover:text-primary-500"
        >
          <Map size={16} />
          الخريطة
        </button>

        <button
          onClick={handleNearbyToggle}
          disabled={gpsLoading}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-sm transition-colors ${
            nearbyOnly ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-600 border-gray-200'
          }`}
        >
          {gpsLoading
            ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            : <Navigation size={16} />
          }
          {gpsLoading ? 'جاري...' : nearbyOnly ? `${filters.distanceKm} كم` : 'قريب'}
        </button>

        <button
          onClick={() => setFilters(f => ({ ...f, availability: f.availability === 'ready' ? 'all' : 'ready' }))}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-sm transition-colors flex-shrink-0 ${
            filters.availability === 'ready'
              ? 'bg-red-500 text-white border-red-500'
              : 'bg-white text-gray-600 border-gray-200'
          }`}
        >
          <span>✅</span>
          <span>الجاهزة</span>
        </button>

        <div className="flex-1" />

        <div className="flex-shrink-0"><ViewToggle mode={viewMode} onChange={setViewMode} /></div>

        <button
          onClick={() => setShowFilterModal(true)}
          className={`relative p-2.5 rounded-xl border-2 shadow-sm transition-colors ${
            activeFiltersCount > 0
              ? 'bg-green-500 border-green-500 text-white'
              : 'bg-white border-gray-200 text-gray-600'
          }`}
        >
          <Filter size={20} />
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Distance slider row — shown below controls when nearbyOnly active */}
      {nearbyOnly && (
        <div className="px-4 pb-2 flex items-center gap-2">
          <input
            type="range" min="10" max="2000" step="10"
            value={filters.distanceKm}
            onChange={e => setFilters(f => ({ ...f, distanceKm: parseInt(e.target.value) }))}
            className="flex-1 accent-primary-500 h-1.5"
          />
        </div>
      )}

      {/* Active filter chips */}
      {activeFiltersCount > 0 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {filters.cropTypes.map(type => (
            <span key={type} className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-bold">
              {CROP_EMOJIS[type]} {CROP_LABELS[type]}
            </span>
          ))}
          {filters.wilaya && (
            <span className="text-xs bg-earth-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
              📍 {filters.wilaya}
            </span>
          )}
          {filters.marketTarget && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              filters.marketTarget === 'محلي' ? 'bg-harvest-100 text-harvest-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {filters.marketTarget === 'محلي' ? '🏠' : '✈️'} {filters.marketTarget}
            </span>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="px-4 mb-2">
        <p className="text-gray-500 text-sm font-bold">
          {filteredCrops.length} محصول متاح
        </p>
      </div>

      {/* Crops List / Grid */}
      <div className={`px-4 pb-6 ${viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-4'}`}>
        {filteredCrops.length === 0 ? (
          <div className="col-span-2 text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg font-bold">لا توجد محاصيل مطابقة</p>
            <button
              onClick={() => setFilters(defaultFilters)}
              className="mt-3 text-primary-500 font-bold text-sm"
            >
              إزالة الفلاتر
            </button>
          </div>
        ) : (
          filteredCrops.map(crop => {
            const farmer = farmers.find(f => f.id === crop.farmerId || (f as any).userId === crop.farmerId)
            const daysLeft = getDaysRemaining(crop.expectedHarvestDate)
            const hasMyRequest = crop.inspectionRequests.some(r => r.buyerId === currentUser?.id)
            const agentPhone = farmer?.phone || (crop as any).agentInfo?.phone || ''
            const agentFacebookUrl = (crop as any).agentInfo?.facebookUrl || ''
            const agentTiktokUrl = (crop as any).agentInfo?.tiktokUrl || ''

            if (viewMode === 'grid') {
              return (
                <div
                  key={crop.id}
                  style={{
                    background: '#fff',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    border: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.2s',
                  }}
                  onClick={() => navigate(cropPath(crop.id))}
                >
                  {/* Image / Video area */}
                  <div style={{
                    height: '120px',
                    background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    {resolvedVideoMap[crop.id] ? (
                      <>
                        <video
                          ref={el => setVideoRef(el, `grid-${crop.id}`)}
                          src={resolvedVideoMap[crop.id]}
                          muted
                          loop
                          playsInline
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {/* Fullscreen tap overlay */}
                        <div
                          onClick={e => {
                            e.stopPropagation()
                            const vid = videoRefs.current[`grid-${crop.id}`]
                            if (vid) { vid.pause(); vid.muted = true }
                            if (unmutedId === `grid-${crop.id}`) setUnmutedId(null)
                            setFullscreenVideo(resolvedVideoMap[crop.id])
                          }}
                          style={{ position: 'absolute', inset: 0, cursor: 'pointer', zIndex: 4 }}
                        />
                        <button
                          onClick={e => toggleMute(e, `grid-${crop.id}`)}
                          style={{
                            position: 'absolute',
                            bottom: '8px',
                            left: '8px',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: unmutedId === `grid-${crop.id}` ? 'rgba(34,197,94,0.9)' : 'rgba(0,0,0,0.6)',
                            border: '2px solid rgba(255,255,255,0.8)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            backdropFilter: 'blur(4px)',
                            zIndex: 5,
                            transition: 'background 0.2s',
                          }}
                        >
                          {unmutedId === `grid-${crop.id}`
                            ? <Volume2 size={12} color="white" />
                            : <VolumeX size={12} color="white" />
                          }
                        </button>
                        {/* Fullscreen icon hint */}
                        <div style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.45)', borderRadius: '6px', padding: '3px 5px', zIndex: 5, pointerEvents: 'none' }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                        </div>
                      </>
                    ) : (
                      <CropImage type={crop.type} images={crop.images} className="w-full h-full" emojiSize="text-5xl" />
                    )}

                    {/* Stage badge top-left */}
                    <span style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: stageColor(crop.stage),
                      color: '#fff',
                      fontSize: '10px',
                      padding: '2px 6px',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                    }}>
                      {STAGE_LABELS[crop.stage]}
                    </span>

                    {/* Market badge top-right */}
                    {crop.marketTarget && (
                      <span style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        background: crop.marketTarget === 'محلي' ? '#22c55e' : '#2563eb',
                        color: '#fff',
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                      }}>
                        {crop.marketTarget}
                      </span>
                    )}
                  </div>

                  <div style={{ padding: '10px' }}>
                    <div style={{ fontWeight: '900', fontSize: '13px', color: '#1a1a1a' }}>
                      {CROP_EMOJIS[crop.type]} {CROP_LABELS[crop.type]}
                    </div>
                    <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{crop.wilaya}</div>
                    {crop.pricePerKg != null && (
                      <div style={{ fontSize: '12px', fontWeight: '900', color: '#22c55e', marginTop: '4px' }}>
                        💰 {crop.pricePerKg} دج/كغ
                      </div>
                    )}
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 'bold',
                      marginTop: '2px',
                      color: daysLeft <= 14 ? '#dc2626' : daysLeft <= 30 ? '#22c55e' : '#2D6A4F',
                    }}>
                      {daysLeft > 0 ? `باقي ${daysLeft} يوم` : 'جاهز!'}
                    </div>

                    {/* Contact hub */}
                    <div
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}
                      onClick={e => e.stopPropagation()}
                    >
                      <button
                        onClick={() => navigate(cropPath(crop.id))}
                        style={{
                          flex: 1,
                          padding: '6px 0',
                          background: '#f3f4f6',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          color: '#374151',
                          cursor: 'pointer',
                          marginLeft: '6px',
                        }}
                      >
                        👁 معاينة
                      </button>
                      <ContactHub
                        phone={agentPhone}
                        agentName="الوسيط"
                        cropName={CROP_LABELS[crop.type]}
                        facebookUrl={agentFacebookUrl}
                        tiktokUrl={agentTiktokUrl}
                        onInspectionRequest={() => setInspectionTarget({
                          cropId: crop.id,
                          cropName: CROP_LABELS[crop.type],
                          farmerName: farmer?.name || '',
                          wilaya: crop.wilaya,
                        })}
                      />
                    </div>
                  </div>
                </div>
              )
            }

            // LIST VIEW - Enhanced card
            return (
              <div
                key={crop.id}
                style={{
                  background: '#fff',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
                  border: '1px solid #f0f0f0',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s',
                }}
                onClick={() => navigate(cropPath(crop.id))}
              >
                {/* Large image/video area */}
                <div style={{
                  height: '180px',
                  position: 'relative',
                  overflow: 'hidden',
                  background: `linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 60%, ${stageColor(crop.stage)}22 100%)`,
                }}>
                  {resolvedVideoMap[crop.id] ? (
                    <>
                      <video
                        ref={el => setVideoRef(el, crop.id)}
                        src={resolvedVideoMap[crop.id]}
                        muted
                        loop
                        playsInline
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {/* Fullscreen tap overlay */}
                      <div
                        onClick={e => {
                          e.stopPropagation()
                          const vid = videoRefs.current[crop.id]
                          if (vid) { vid.pause(); vid.muted = true }
                          if (unmutedId === crop.id) setUnmutedId(null)
                          setFullscreenVideo(resolvedVideoMap[crop.id])
                        }}
                        style={{ position: 'absolute', inset: 0, cursor: 'pointer', zIndex: 4 }}
                      />
                      {/* Mute toggle */}
                      <button
                        onClick={e => toggleMute(e, crop.id)}
                        style={{
                          position: 'absolute',
                          bottom: '12px',
                          left: '12px',
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          background: unmutedId === crop.id ? 'rgba(34,197,94,0.9)' : 'rgba(0,0,0,0.6)',
                          border: '2px solid rgba(255,255,255,0.8)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          backdropFilter: 'blur(4px)',
                          zIndex: 5,
                          transition: 'background 0.2s',
                        }}
                      >
                        {unmutedId === crop.id
                          ? <Volume2 size={16} color="white" />
                          : <VolumeX size={16} color="white" />
                        }
                      </button>
                      {/* Fullscreen icon hint */}
                      <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.45)', borderRadius: '8px', padding: '5px 7px', zIndex: 5, pointerEvents: 'none' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                      </div>
                    </>
                  ) : (
                    <CropImage type={crop.type} images={crop.images} className="w-full h-full" emojiSize="text-6xl" />
                  )}

                  {/* Stage badge top-right (RTL: visually right side) */}
                  <span style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: stageColor(crop.stage),
                    color: '#fff',
                    fontSize: '12px',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}>
                    {STAGE_LABELS[crop.stage]}
                  </span>

                  {/* Market badge top-left */}
                  {crop.marketTarget && (
                    <span style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: crop.marketTarget === 'محلي' ? '#22c55e' : '#2563eb',
                      color: '#fff',
                      fontSize: '11px',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    }}>
                      {crop.marketTarget}
                    </span>
                  )}

                  {/* Pending badge */}
                  {hasMyRequest && (
                    <span style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '10px',
                      background: '#2563eb',
                      color: '#fff',
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                    }}>
                      ✓ طلبت معاينة
                    </span>
                  )}
                </div>

                {/* Card body */}
                <div style={{ padding: '14px' }}>
                  {/* Title row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <TrustScore score={farmer?.trustScore || 4.0} size="sm" showNumber={false} />
                      <span style={{ fontSize: '12px', color: '#888' }}>{farmer?.name}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '900', fontSize: '18px', color: '#1a1a1a' }}>
                        {CROP_EMOJIS[crop.type]} {CROP_LABELS[crop.type]}
                      </div>
                      <div style={{ fontSize: '13px', color: '#888' }}>{crop.wilaya}</div>
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '8px 0' }} />

                  {/* Progress bar */}
                  <CropProgressBar
                    plantingDate={crop.plantingDate}
                    expectedHarvestDate={crop.expectedHarvestDate}
                    cropType={crop.type}
                    compact
                  />

                  <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '8px 0' }} />

                  {/* Info rows */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ fontWeight: '900', color: '#1a1a1a' }}>{(crop.estimatedQuantityKg / 1000).toFixed(1)} طن</span>
                      <span style={{ color: '#888' }}>⚖️ الكمية</span>
                    </div>
                    {crop.pricePerKg != null && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span style={{ fontWeight: '900', color: '#22c55e' }}>{crop.pricePerKg} دج/كغ</span>
                        <span style={{ color: '#888' }}>💰 السعر</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ fontWeight: '900', color: daysLeft <= 14 ? '#dc2626' : '#2D6A4F' }}>
                        {formatDate(crop.expectedHarvestDate)}
                      </span>
                      <span style={{ color: '#888' }}>📅 موعد الحصاد</span>
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '8px 0' }} />

                  {/* Action buttons row */}
                  <div
                    style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      onClick={() => navigate(cropPath(crop.id))}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: '#f3f4f6',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#374151',
                        cursor: 'pointer',
                      }}
                    >
                      👁 معاينة
                    </button>
                    <ContactHub
                      phone={agentPhone}
                      agentName="الوسيط"
                      cropName={CROP_LABELS[crop.type]}
                      facebookUrl={agentFacebookUrl}
                      tiktokUrl={agentTiktokUrl}
                      onInspectionRequest={() => setInspectionTarget({
                        cropId: crop.id,
                        cropName: CROP_LABELS[crop.type],
                        farmerName: farmer?.name || '',
                        wilaya: crop.wilaya,
                      })}
                    />
                    <button
                      onClick={() => navigate(cropPath(crop.id))}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: '#22c55e',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        color: '#fff',
                        cursor: 'pointer',
                      }}
                    >
                      📦 حجز
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Filter Modal */}
      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onApply={setFilters}
      />

      {/* Inspection Modal */}
      {inspectionTarget && (
        <InspectionModal
          cropId={inspectionTarget.cropId}
          cropName={inspectionTarget.cropName}
          farmerName={inspectionTarget.farmerName}
          wilaya={inspectionTarget.wilaya}
          onClose={() => setInspectionTarget(null)}
        />
      )}

      {/* Fullscreen video overlay */}
      {fullscreenVideo && (
        <VideoFullscreen src={fullscreenVideo} onClose={() => setFullscreenVideo(null)} />
      )}

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" dir="rtl">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowNotifications(false)} />
          <div className="relative bg-white rounded-t-3xl w-full max-w-md shadow-2xl">
            <div className="px-4 pt-5 pb-3 flex items-center justify-between border-b border-gray-100">
              <button onClick={() => setShowNotifications(false)}><X size={22} className="text-gray-500" /></button>
              <h2 className="font-black text-gray-800 text-lg">الإشعارات</h2>
              <Bell size={20} className="text-blue-500" />
            </div>
            <div className="py-3 px-4 max-h-96 overflow-y-auto">
              {notifCount === 0 ? (
                <div className="text-center py-10">
                  <div className="text-4xl mb-2">🔔</div>
                  <p className="text-gray-400 font-bold">لا توجد إشعارات جديدة</p>
                </div>
              ) : (
                <>
                  {myPendingOrders.map((o: any) => (
                    <div key={o._id || o.id} className="py-3 border-b border-gray-50">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">📦</div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-800">حجزك على {(CROP_LABELS as any)[o.crop.type]} قيد الانتظار</p>
                          <p className="text-xs text-gray-500 mt-0.5">{o.crop.wilaya} — {o.quantityKg?.toLocaleString()} كغ</p>
                          <button onClick={() => { setShowNotifications(false); navigate('/buyer/requests') }} className="text-xs text-primary-600 font-bold mt-1 underline">عرض طلباتي</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {myPendingInspections.map((r: any) => (
                    <div key={r._id || r.id} className="py-3 border-b border-gray-50">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">🔍</div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-gray-800">طلب معاينة على {(CROP_LABELS as any)[r.crop.type]} قيد الانتظار</p>
                          <p className="text-xs text-gray-500 mt-0.5">{r.crop.wilaya}</p>
                          <button onClick={() => { setShowNotifications(false); navigate('/buyer/requests') }} className="text-xs text-primary-600 font-bold mt-1 underline">عرض طلباتي</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
            <div className="pb-6" />
          </div>
        </div>
      )}
    </div>
  )
}
