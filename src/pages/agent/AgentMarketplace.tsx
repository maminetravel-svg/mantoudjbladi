import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Filter, BarChart2, Volume2, VolumeX, Map, Navigation } from 'lucide-react'
import { apiGetCrops as getCrops } from '../../api/crops'
import { CropProgressBar } from '../../components/Shared/CropProgressBar'
import FilterModal, { FilterState } from '../../components/Shared/FilterModal'
import ViewToggle, { ViewMode } from '../../components/Shared/ViewToggle'
import { VideoFullscreen } from '../../components/Shared/VideoPlayer'
import { CropImage } from '../../components/Shared/CropImage'
import { ContactHub } from '../../components/Shared/ContactHub'
import { CROP_LABELS, CROP_EMOJIS, STAGE_LABELS } from '../../types'
import type { Crop } from '../../types'

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

export default function AgentMarketplace() {
  const navigate = useNavigate()
  const [crops, setCrops] = useState<Crop[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [unmutedId, setUnmutedId] = useState<string | null>(null)
  const [fullscreenVideo, setFullscreenVideo] = useState<string | null>(null)
  const [nearbyOnly, setNearbyOnly] = useState(false)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [userLat, setUserLat] = useState<number | null>(null)
  const [userLng, setUserLng] = useState<number | null>(null)
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    getCrops({})
      .then(setCrops)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const vid = entry.target as HTMLVideoElement
          if (entry.isIntersecting) vid.play().catch(() => {})
          else vid.pause()
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
      if (unmutedId && videoRefs.current[unmutedId]) videoRefs.current[unmutedId]!.muted = true
      vid.muted = false
      setUnmutedId(cropId)
    }
  }, [unmutedId])

  const handleNearbyToggle = () => {
    if (nearbyOnly) { setNearbyOnly(false); return }
    if (userLat !== null) { setNearbyOnly(true); return }
    setGpsLoading(true)
    navigator.geolocation?.getCurrentPosition(
      pos => { setUserLat(pos.coords.latitude); setUserLng(pos.coords.longitude); setNearbyOnly(true); setGpsLoading(false) },
      () => setGpsLoading(false)
    )
  }

  const filteredCrops = crops.filter(crop => {
    if (filters.cropTypes.length > 0 && !filters.cropTypes.includes(crop.type as any)) return false
    if (filters.wilaya && crop.wilaya !== filters.wilaya) return false
    if (filters.stage && crop.stage !== filters.stage) return false
    if (filters.marketTarget && crop.marketTarget !== filters.marketTarget) return false
    if (filters.availability === 'ready' && crop.stage !== 'ready') return false
    if (filters.availability === 'notReady' && crop.stage === 'ready') return false
    if (nearbyOnly && userLat !== null && userLng !== null) {
      const lat = (crop as any).gpsLat; const lng = (crop as any).gpsLng
      if (!lat || !lng) return false
      const dist = Math.sqrt(Math.pow((lat - userLat) * 111, 2) + Math.pow((lng - userLng) * 111 * Math.cos(userLat * Math.PI / 180), 2))
      if (dist > filters.distanceKm) return false
    }
    return true
  })

  const upcomingTons = crops
    .filter(c => getDaysRemaining(c.expectedHarvestDate) <= 90)
    .reduce((sum, c) => sum + c.estimatedQuantityKg, 0)

  const activeFiltersCount = [
    filters.cropTypes.length > 0,
    filters.stage !== '',
    filters.marketTarget !== '',
    filters.availability !== 'all',
    filters.wilaya !== '',
  ].filter(Boolean).length

  const stageColor = (stage: string) => STAGE_COLOR[stage] || '#2D6A4F'

  const resolvedVideoMap = Object.fromEntries(
    crops
      .filter(c => (c as any).videos?.length)
      .map(c => [c.id, (c as any).videos![0]])
  )

  if (loading) return <div className="flex items-center justify-center h-screen text-gray-400">جاري التحميل...</div>

  return (
    <div className="min-h-screen bg-gray-50 pb-6" dir="rtl">
      {/* Header */}
      <div className="px-4 pt-10 pb-4" style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="text-green-200 text-sm font-bold">وسيط</div>
        </div>
        <h1 className="text-white text-2xl font-black">🏪 سوق المنتجات</h1>
        <div className="mt-3 bg-white bg-opacity-15 rounded-2xl px-4 py-3 flex items-center gap-3">
          <BarChart2 size={28} className="text-yellow-300" />
          <div>
            <div className="text-white font-black text-lg">{(upcomingTons / 1000).toFixed(1)} طن</div>
            <div className="text-green-200 text-xs">المحاصيل المتوقعة خلال 3 أشهر</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 py-3 flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        <button
          onClick={() => navigate('/agent/map')}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-600 shadow-sm hover:text-primary-500 flex-shrink-0"
        >
          <Map size={16} />
          الخريطة
        </button>
        <button
          onClick={handleNearbyToggle}
          disabled={gpsLoading}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-sm transition-colors flex-shrink-0 ${
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
            filters.availability === 'ready' ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-600 border-gray-200'
          }`}
        >
          <span>✅</span>
          <span>الجاهزة</span>
        </button>
        <div className="flex-1" />
        <div className="flex-shrink-0"><ViewToggle mode={viewMode} onChange={setViewMode} /></div>
        <button
          onClick={() => setShowFilterModal(true)}
          className={`relative p-2.5 rounded-xl border-2 shadow-sm transition-colors flex-shrink-0 ${
            activeFiltersCount > 0 ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200 text-gray-600'
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
            <span key={type} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
              {(CROP_EMOJIS as any)[type]} {(CROP_LABELS as any)[type]}
            </span>
          ))}
          {filters.wilaya && (
            <span className="text-xs bg-gray-100 text-green-700 px-2 py-0.5 rounded-full font-bold">📍 {filters.wilaya}</span>
          )}
        </div>
      )}

      <div className="px-4 mb-2">
        <p className="text-gray-500 text-sm font-bold">{filteredCrops.length} محصول متاح</p>
      </div>

      {/* Crops */}
      <div className={`px-4 pb-6 ${viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-4'}`}>
        {filteredCrops.length === 0 ? (
          <div className="col-span-2 text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg font-bold">لا توجد محاصيل مطابقة</p>
            <button onClick={() => setFilters(defaultFilters)} className="mt-3 text-green-600 font-bold text-sm">
              إزالة الفلاتر
            </button>
          </div>
        ) : (
          filteredCrops.map(crop => {
            const daysLeft = getDaysRemaining(crop.expectedHarvestDate)
            const agentInfo = (crop as any).agentInfo
            const videoSrc = resolvedVideoMap[crop.id]

            if (viewMode === 'grid') {
              return (
                <div
                  key={crop.id}
                  style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0', cursor: 'pointer' }}
                  onClick={() => navigate(`/agent/crop/${crop.id}`)}
                >
                  <div style={{ height: '120px', background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', position: 'relative', overflow: 'hidden' }}>
                    {videoSrc ? (
                      <>
                        <video ref={el => setVideoRef(el, `grid-${crop.id}`)} src={videoSrc} muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div onClick={e => { e.stopPropagation(); const vid = videoRefs.current[`grid-${crop.id}`]; if (vid) { vid.pause(); vid.muted = true } if (unmutedId === `grid-${crop.id}`) setUnmutedId(null); setFullscreenVideo(videoSrc) }} style={{ position: 'absolute', inset: 0, cursor: 'pointer', zIndex: 4 }} />
                        <button onClick={e => toggleMute(e, `grid-${crop.id}`)} style={{ position: 'absolute', bottom: '8px', left: '8px', width: '28px', height: '28px', borderRadius: '50%', background: unmutedId === `grid-${crop.id}` ? 'rgba(34,197,94,0.9)' : 'rgba(0,0,0,0.6)', border: '2px solid rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 5 }}>
                          {unmutedId === `grid-${crop.id}` ? <Volume2 size={12} color="white" /> : <VolumeX size={12} color="white" />}
                        </button>
                      </>
                    ) : (
                      <CropImage type={crop.type} images={crop.images} className="w-full h-full" emojiSize="text-5xl" />
                    )}
                    <span style={{ position: 'absolute', top: '8px', right: '8px', background: stageColor(crop.stage), color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '20px', fontWeight: 'bold' }}>
                      {STAGE_LABELS[crop.stage]}
                    </span>
                  </div>
                  <div style={{ padding: '10px' }}>
                    <div style={{ fontWeight: '900', fontSize: '13px', color: '#1a1a1a' }}>{(CROP_EMOJIS as any)[crop.type]} {(CROP_LABELS as any)[crop.type]}</div>
                    <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{crop.wilaya}</div>
                    {crop.pricePerKg != null && (
                      <div style={{ fontSize: '12px', fontWeight: '900', color: '#22c55e', marginTop: '4px' }}>💰 {crop.pricePerKg} دج/كغ</div>
                    )}
                    <div style={{ fontSize: '11px', fontWeight: 'bold', marginTop: '2px', color: daysLeft <= 14 ? '#dc2626' : '#2D6A4F' }}>
                      {daysLeft > 0 ? `باقي ${daysLeft} يوم` : 'جاهز!'}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }} onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => navigate(`/agent/crop/${crop.id}`)}
                        style={{ flex: 1, padding: '6px 0', background: '#f3f4f6', border: 'none', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold', color: '#374151', cursor: 'pointer', marginLeft: '6px' }}
                      >
                        👁 معاينة
                      </button>
                      <ContactHub
                        phone={agentInfo?.phone || ''}
                        agentName={agentInfo?.name || ''}
                        cropName={(CROP_LABELS as any)[crop.type] || crop.type}
                        facebookUrl={agentInfo?.facebookUrl || ''}
                        tiktokUrl={agentInfo?.tiktokUrl || ''}
                        onInspectionRequest={() => navigate(`/agent/crop/${crop.id}`)}
                      />
                    </div>
                  </div>
                </div>
              )
            }

            // LIST VIEW
            return (
              <div
                key={crop.id}
                style={{ background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0', cursor: 'pointer' }}
                onClick={() => navigate(`/agent/crop/${crop.id}`)}
              >
                {/* Image/video */}
                <div style={{ height: '180px', position: 'relative', overflow: 'hidden', background: `linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 60%, ${stageColor(crop.stage)}22 100%)` }}>
                  {videoSrc ? (
                    <>
                      <video ref={el => setVideoRef(el, crop.id)} src={videoSrc} muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div onClick={e => { e.stopPropagation(); const vid = videoRefs.current[crop.id]; if (vid) { vid.pause(); vid.muted = true } if (unmutedId === crop.id) setUnmutedId(null); setFullscreenVideo(videoSrc) }} style={{ position: 'absolute', inset: 0, cursor: 'pointer', zIndex: 4 }} />
                      <button onClick={e => toggleMute(e, crop.id)} style={{ position: 'absolute', bottom: '12px', left: '12px', width: '34px', height: '34px', borderRadius: '50%', background: unmutedId === crop.id ? 'rgba(34,197,94,0.9)' : 'rgba(0,0,0,0.6)', border: '2px solid rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 5 }}>
                        {unmutedId === crop.id ? <Volume2 size={16} color="white" /> : <VolumeX size={16} color="white" />}
                      </button>
                    </>
                  ) : (
                    <CropImage type={crop.type} images={crop.images} className="w-full h-full" emojiSize="text-6xl" />
                  )}
                  <span style={{ position: 'absolute', top: '10px', right: '10px', background: stageColor(crop.stage), color: '#fff', fontSize: '12px', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                    {STAGE_LABELS[crop.stage]}
                  </span>
                  {crop.marketTarget && (
                    <span style={{ position: 'absolute', top: '10px', left: '10px', background: crop.marketTarget === 'محلي' ? '#22c55e' : '#2563eb', color: '#fff', fontSize: '11px', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                      {crop.marketTarget}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {agentInfo && (
                        <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 'bold' }}>📞 {agentInfo.name}</span>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '900', fontSize: '18px', color: '#1a1a1a' }}>
                        {(CROP_EMOJIS as any)[crop.type]} {(CROP_LABELS as any)[crop.type]}
                      </div>
                      <div style={{ fontSize: '13px', color: '#888' }}>{crop.wilaya}</div>
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '8px 0' }} />

                  <CropProgressBar
                    plantingDate={crop.plantingDate}
                    expectedHarvestDate={crop.expectedHarvestDate}
                    cropType={crop.type}
                    compact
                  />

                  <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '8px 0' }} />

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

                  <div
                    style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      onClick={() => navigate(`/agent/crop/${crop.id}`)}
                      style={{ flex: 1, padding: '10px', background: '#f3f4f6', border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold', color: '#374151', cursor: 'pointer' }}
                    >
                      👁 معاينة
                    </button>
                    <ContactHub
                      phone={agentInfo?.phone || ''}
                      agentName={agentInfo?.name || ''}
                      cropName={(CROP_LABELS as any)[crop.type] || crop.type}
                      facebookUrl={agentInfo?.facebookUrl || ''}
                      tiktokUrl={agentInfo?.tiktokUrl || ''}
                      onInspectionRequest={() => navigate(`/agent/crop/${crop.id}`)}
                    />
                    <button
                      onClick={() => navigate(`/agent/crop/${crop.id}`)}
                      style={{ flex: 1, padding: '10px', background: '#2D6A4F', border: 'none', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold', color: '#fff', cursor: 'pointer' }}
                    >
                      📋 حجز
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <FilterModal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onApply={setFilters}
      />

      {fullscreenVideo && (
        <VideoFullscreen src={fullscreenVideo} onClose={() => setFullscreenVideo(null)} />
      )}
    </div>
  )
}
