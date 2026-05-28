import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import { EQUIPMENT_CATEGORIES, EquipmentCategory } from '../../types'
import { ArrowRight, Phone, MapPin, Package, Calendar } from 'lucide-react'
import { VideoPlayer } from '../../components/Shared/VideoPlayer'

let MapContainer: React.ComponentType<any>
let TileLayer: React.ComponentType<any>
let CircleMarker: React.ComponentType<any>

const CATEGORY_EMOJIS: Record<EquipmentCategory, string> = {
  'معدات ري': '💧',
  'جرارات': '🚜',
  'بيوت بلاستيكية': '🏠',
  'أسمدة': '🌿',
  'بذور': '🌱'
}

export default function EquipmentDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { equipment } = useAppStore()

  const eq = equipment.find(e => e.id === id)

  const [lightboxImg, setLightboxImg] = useState<string | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [fullscreenVideo, setFullscreenVideo] = useState<string | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const resolvedVideos = eq?.videos || []
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

  useEffect(() => {
    Promise.all([import('react-leaflet'), import('leaflet')]).then(([rl]) => {
      MapContainer = rl.MapContainer
      TileLayer = rl.TileLayer
      CircleMarker = rl.CircleMarker
      setMapReady(true)
    }).catch(() => {})
  }, [])

  if (!eq) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-500 text-lg font-bold">المعدة غير موجودة</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-primary-500 font-bold">
            رجوع
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div
        className="px-4 pt-10 pb-4"
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)' }}
      >
        <button onClick={() => navigate(-1)} className="text-white mb-3 flex items-center gap-1">
          <ArrowRight size={20} />
          <span className="text-sm font-bold">رجوع</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-4xl">
            {CATEGORY_EMOJIS[eq.category] || '⚙️'}
          </div>
          <div>
            <h1 className="text-white text-2xl font-black">{eq.name}</h1>
            <p className="text-blue-100 text-sm">
              <MapPin size={12} className="inline mr-1" />
              {eq.wilaya} • {eq.category}
            </p>
          </div>
        </div>
      </div>

      {/* Images gallery */}
      {eq.images && eq.images.length > 0 ? (
        <div className="relative mt-1">
          {/* Main image */}
          <div
            className="overflow-hidden bg-black"
            onTouchStart={e => {
              touchStartX.current = e.touches[0].clientX
              touchStartY.current = e.touches[0].clientY
            }}
            onTouchEnd={e => {
              const dx = e.changedTouches[0].clientX - touchStartX.current
              const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current)
              if (Math.abs(dx) > 40 && dy < 60) {
                if (dx < 0) setGalleryIndex(i => Math.min(i + 1, eq.images!.length - 1))
                else setGalleryIndex(i => Math.max(i - 1, 0))
              }
            }}
            onClick={() => { setLightboxImg(eq.images![galleryIndex]); setLightboxIndex(galleryIndex) }}
          >
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(${galleryIndex * 100}%)` }}
            >
              {eq.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`صورة ${i + 1}`}
                  className="w-full flex-shrink-0 object-cover"
                  style={{ height: '260px', minWidth: '100%' }}
                  draggable={false}
                />
              ))}
            </div>
          </div>

          <div className="absolute top-2 left-2 bg-black bg-opacity-40 text-white text-xs px-2 py-1 rounded-full">
            🔍 اضغط للتكبير
          </div>
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {galleryIndex + 1} / {eq.images.length}
          </div>

          {eq.images.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
              {eq.images.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setGalleryIndex(i) }}
                  className="rounded-full transition-all"
                  style={{
                    width: i === galleryIndex ? '18px' : '7px',
                    height: '7px',
                    background: i === galleryIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mx-4 mt-3 rounded-2xl overflow-hidden shadow-sm bg-gray-200 flex items-center justify-center" style={{ height: '220px' }}>
          <span className="text-6xl">{CATEGORY_EMOJIS[eq.category] || '⚙️'}</span>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImg && eq.images && (
        <div
          className="fixed inset-0 z-[9999] bg-black flex flex-col"
          onTouchStart={e => { touchStartX.current = e.touches[0].clientX; touchStartY.current = e.touches[0].clientY }}
          onTouchEnd={e => {
            const dx = e.changedTouches[0].clientX - touchStartX.current
            const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current)
            if (Math.abs(dx) > 40 && dy < 60) {
              const next = dx < 0
                ? Math.min(lightboxIndex + 1, eq.images!.length - 1)
                : Math.max(lightboxIndex - 1, 0)
              setLightboxIndex(next)
              setLightboxImg(eq.images![next])
            }
          }}
          onClick={() => setLightboxImg(null)}
        >
          <div className="flex items-center justify-between px-4 pt-10 pb-3" onClick={e => e.stopPropagation()}>
            <button onClick={() => setLightboxImg(null)} className="text-white text-3xl leading-none">✕</button>
            <span className="text-white font-bold text-sm">{lightboxIndex + 1} / {eq.images.length}</span>
            <div className="w-8" />
          </div>
          <div className="flex-1 flex items-center justify-center px-2" onClick={e => e.stopPropagation()}>
            <img src={lightboxImg} className="max-w-full max-h-full rounded-xl object-contain" />
          </div>
          <p className="text-gray-400 text-center text-xs pb-6">اسحب يميناً أو يساراً للتنقل</p>
        </div>
      )}

      {/* Videos section */}
      {resolvedVideos.length > 0 && (
        <div className="mx-4 mt-4">
          <h3 className="font-black text-gray-700 text-sm mb-3 flex items-center gap-2">
            🎥 فيديوهات للمعدة
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
              {resolvedVideos.length} فيديو
            </span>
          </h3>
          <div className="space-y-3">
            {resolvedVideos.map((v, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden bg-black shadow-md" style={{ aspectRatio: '16/9' }}>
                <VideoPlayer src={v} style={{ width: '100%', height: '100%' }} controls />
                <button
                  onClick={() => setFullscreenVideo(v)}
                  style={{
                    position: 'absolute', top: '8px', right: '8px', width: '32px', height: '32px',
                    borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: '1.5px solid rgba(255,255,255,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, fontSize: '13px'
                  }}
                >⛶</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {fullscreenVideo && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col" onClick={() => setFullscreenVideo(null)}>
          <div className="flex items-center justify-between px-4 pt-10 pb-3" onClick={e => e.stopPropagation()}>
            <button onClick={() => setFullscreenVideo(null)} className="text-white text-3xl leading-none w-10 h-10 flex items-center justify-center">✕</button>
            <span className="text-white font-bold text-sm">🎥 فيديو</span>
            <div className="w-10" />
          </div>
          <div className="flex-1 flex items-center justify-center px-2" onClick={e => e.stopPropagation()}>
            <VideoPlayer src={fullscreenVideo} autoPlay controls style={{ width: '100%', maxHeight: '70vh', borderRadius: '12px' }} />
          </div>
        </div>
      )}

      {/* Details Section */}
      <div className="px-4 py-4 space-y-4">
        {/* Price & Contact Button */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-4">
             <div className="bg-green-50 text-green-700 font-black px-4 py-2 rounded-xl text-lg">
                {eq.pricePerDay ? `${eq.pricePerDay} دج / يوم` : 'السعر غير متوفر'}
             </div>
             <div className="bg-blue-50 text-blue-700 font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-1">
               <Calendar size={16} /> للإيجار
             </div>
          </div>
          
          {eq.agentId && (
            <button
              onClick={() => navigate(`/profile/${eq.agentId}`)}
              className="w-full mb-2 bg-gray-100 text-gray-700 rounded-xl py-3 font-black text-center flex items-center justify-center gap-2 hover:bg-gray-200 active:scale-95 transition-all text-sm"
            >
              👤 {eq.ownerName || 'صاحب الإعلان'} — عرض الملف الشخصي
            </button>
          )}
          <a href={`tel:${eq.phone}`} className="w-full bg-blue-600 text-white rounded-xl py-4 font-black text-center shadow-md flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-all">
            <Phone size={20} /> اتصل بصاحب المعدة ({eq.phone})
          </a>
        </div>

        {/* Description */}
        {eq.description && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-black text-gray-800 text-base mb-2">الوصف</h3>
            <p className="text-gray-600 leading-relaxed text-sm">{eq.description}</p>
          </div>
        )}

        {/* Mini Map */}
        {mapReady && MapContainer && eq.gpsLat && eq.gpsLng && (
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="px-4 pt-3 pb-2 flex items-center gap-2 bg-white">
              <MapPin size={16} className="text-blue-500" />
              <h3 className="font-black text-gray-700 text-base">موقع المعدة</h3>
            </div>
            <MapContainer
              center={[eq.gpsLat, eq.gpsLng]}
              zoom={12}
              style={{ height: '180px', width: '100%' }}
              zoomControl={false}
              dragging={false}
              scrollWheelZoom={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <CircleMarker
                center={[eq.gpsLat, eq.gpsLng]}
                radius={14}
                pathOptions={{ fillColor: '#3b82f6', color: '#fff', weight: 2, fillOpacity: 0.9 }}
              />
            </MapContainer>
            <div className="px-4 py-2 text-xs text-gray-400 bg-white border-t border-gray-50">
              {eq.gpsLat.toFixed(4)}°N, {eq.gpsLng.toFixed(4)}°E
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
