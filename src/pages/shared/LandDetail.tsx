import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import { ArrowRight, Phone, MapPin, Check, Video, Map } from 'lucide-react'
import { VideoPlayer } from '../../components/Shared/VideoPlayer'

let MapContainer: React.ComponentType<any>
let TileLayer: React.ComponentType<any>
let CircleMarker: React.ComponentType<any>

export default function LandDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { lands } = useAppStore()

  const land = lands.find(e => e.id === id)

  const [lightboxImg, setLightboxImg] = useState<string | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [fullscreenVideo, setFullscreenVideo] = useState<string | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const resolvedVideos = land?.videos || []
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

  useEffect(() => {
    Promise.all([import('react-leaflet'), import('leaflet')]).then(([rl, L]) => {
      MapContainer = rl.MapContainer
      TileLayer = rl.TileLayer
      CircleMarker = rl.CircleMarker
      setMapReady(true)
    }).catch(() => {})
  }, [])

  if (!land) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-500 text-lg font-bold">الأرض غير موجودة</p>
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
        style={{ background: 'linear-gradient(135deg, #15803d 0%, #16a34a 100%)' }}
      >
        <button onClick={() => navigate(-1)} className="text-white mb-3 flex items-center gap-1">
          <ArrowRight size={20} />
          <span className="text-sm font-bold">رجوع</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-4xl">
            🌍
          </div>
          <div>
            <h1 className="text-white text-2xl font-black">{land.area} هكتار للـ{land.goal}</h1>
            <p className="text-green-100 text-sm">
              <MapPin size={12} className="inline mr-1" />
              {land.wilaya}
            </p>
          </div>
        </div>
      </div>

      {/* Images gallery */}
      {land.images && land.images.length > 0 ? (
        <div className="relative mt-1">
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
                if (dx < 0) setGalleryIndex(i => Math.min(i + 1, land.images!.length - 1))
                else setGalleryIndex(i => Math.max(i - 1, 0))
              }
            }}
            onClick={() => { setLightboxImg(land.images![galleryIndex]); setLightboxIndex(galleryIndex) }}
          >
            <div
              className="flex transition-transform duration-300 ease-out"
              style={{ transform: `translateX(${galleryIndex * 100}%)` }}
            >
              {land.images.map((img, i) => (
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
            {galleryIndex + 1} / {land.images.length}
          </div>

          {land.images.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
              {land.images.map((_, i) => (
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
          <span className="text-6xl">🌍</span>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImg && land.images && (
        <div
          className="fixed inset-0 z-[9999] bg-black flex flex-col"
          onTouchStart={e => { touchStartX.current = e.touches[0].clientX; touchStartY.current = e.touches[0].clientY }}
          onTouchEnd={e => {
            const dx = e.changedTouches[0].clientX - touchStartX.current
            const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current)
            if (Math.abs(dx) > 40 && dy < 60) {
              const next = dx < 0
                ? Math.min(lightboxIndex + 1, land.images!.length - 1)
                : Math.max(lightboxIndex - 1, 0)
              setLightboxIndex(next)
              setLightboxImg(land.images![next])
            }
          }}
          onClick={() => setLightboxImg(null)}
        >
          <div className="flex items-center justify-between px-4 pt-10 pb-3" onClick={e => e.stopPropagation()}>
            <button onClick={() => setLightboxImg(null)} className="text-white text-3xl leading-none">✕</button>
            <span className="text-white font-bold text-sm">{lightboxIndex + 1} / {land.images.length}</span>
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
            🎥 فيديوهات للأرض
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
          <div className="flex flex-col items-center justify-center gap-2 mb-4 bg-green-50 rounded-xl p-3">
             <div className="text-green-700 font-black text-2xl">
                {land.price ? `${land.price} مليون دج` : 'السعر غير متوفر'}
             </div>
             <div className="text-green-600 font-bold text-sm">
               النوع: {land.priceType || 'ثابت'}
             </div>
          </div>
          
          {land.agentId && (
            <button
              onClick={() => navigate(`/profile/${land.agentId}`)}
              className="w-full mb-2 bg-gray-100 text-gray-700 rounded-xl py-3 font-black text-center flex items-center justify-center gap-2 hover:bg-gray-200 active:scale-95 transition-all text-sm"
            >
              👤 {land.ownerName || 'صاحب الإعلان'} — عرض الملف الشخصي
            </button>
          )}
          {land.phone ? (
            <a href={`tel:${land.phone}`} className="w-full bg-green-600 text-white rounded-xl py-4 font-black text-center shadow-md flex items-center justify-center gap-2 hover:bg-green-700 active:scale-95 transition-all">
              <Phone size={20} /> اتصل بصاحب الأرض ({land.phone})
            </a>
          ) : (
            <div className="w-full bg-gray-300 text-gray-500 rounded-xl py-4 font-black text-center flex items-center justify-center gap-2 text-sm">
              <Phone size={20} /> رقم الهاتف غير متوفر
            </div>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3">
           <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
              <span className="text-gray-400 text-xs font-bold mb-1">الوثائق</span>
              <span className="text-gray-800 font-black text-center text-sm">{Array.isArray(land.documents) ? land.documents.join('، ') : (land.documents || 'غير محدد')}</span>
           </div>
           <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
              <span className="text-gray-400 text-xs font-bold mb-1">الهدف</span>
              <span className={`font-black text-sm px-3 py-1 rounded-full ${land.goal === 'بيع' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{land.goal === 'بيع' ? 'للبيع' : 'للإيجار'}</span>
           </div>
        </div>

        {/* Features */}
        {land.features && land.features.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
             <h3 className="font-black text-gray-800 text-base mb-3">المميزات</h3>
             <div className="flex flex-wrap gap-2">
                {land.features.map(f => (
                  <span key={f} className="bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Check size={14} className="text-green-500" /> {f}
                  </span>
                ))}
             </div>
          </div>
        )}

        {/* Description */}
        {land.description && (
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-black text-gray-800 text-base mb-2">الوصف</h3>
            <p className="text-gray-600 leading-relaxed text-sm">{land.description}</p>
          </div>
        )}

        {/* Mini Map */}
        {mapReady && MapContainer && land.gpsLat && land.gpsLng && (
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div className="px-4 pt-3 pb-2 flex items-center gap-2 bg-white">
              <MapPin size={16} className="text-primary-500" />
              <h3 className="font-black text-gray-700 text-base">موقع الأرض</h3>
            </div>
            <MapContainer
              center={[land.gpsLat, land.gpsLng]}
              zoom={12}
              style={{ height: '180px', width: '100%' }}
              zoomControl={false}
              dragging={false}
              scrollWheelZoom={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <CircleMarker
                center={[land.gpsLat, land.gpsLng]}
                radius={14}
                pathOptions={{ fillColor: '#2D6A4F', color: '#fff', weight: 2, fillOpacity: 0.9 }}
              />
            </MapContainer>
            <div className="px-4 py-2 text-xs text-gray-400 bg-white border-t border-gray-50">
              {land.gpsLat.toFixed(4)}°N, {land.gpsLng.toFixed(4)}°E
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
