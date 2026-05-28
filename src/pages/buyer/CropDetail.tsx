import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import { CropProgressBar } from '../../components/Shared/CropProgressBar'
import { TrustScore } from '../../components/Shared/TrustScore'
import { ContactHub } from '../../components/Shared/ContactHub'
import { InspectionModal } from '../../components/Shared/InspectionModal'
import { CROP_LABELS, CROP_EMOJIS, STAGE_LABELS } from '../../types'
import { ArrowRight, MapPin, Calendar, Package, DollarSign, Check, Eye, Star } from 'lucide-react'
import { CropImage } from '../../components/Shared/CropImage'
import { VideoPlayer } from '../../components/Shared/VideoPlayer'
import { api } from '../../api/client'


function getDaysRemaining(date: string): number {
  const diff = new Date(date).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

let MapContainer: React.ComponentType<any>
let TileLayer: React.ComponentType<any>
let CircleMarker: React.ComponentType<any>

export default function CropDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { crops, farmers, currentUser, requestInspection, createPreOrder } = useAppStore()

  const crop = crops.find(c => c.id === id)
  const farmer = crop ? farmers.find(f => f.id === crop.farmerId || (f as any).userId === crop.farmerId) : null

  // Fetch detailed crop from API to get farmerInfo (includes userId)
  const [farmerInfo, setFarmerInfo] = useState<any>(null)
  const [agentFacebookUrl, setAgentFacebookUrl] = useState('')
  const [agentTiktokUrl, setAgentTiktokUrl] = useState('')
  useEffect(() => {
    if (id) {
      api.get<any>(`/api/crops/${id}`)
        .then(d => {
          if (d.farmerInfo) setFarmerInfo(d.farmerInfo)
          if (d.agentFacebookUrl) setAgentFacebookUrl(d.agentFacebookUrl)
          if (d.agentTiktokUrl) setAgentTiktokUrl(d.agentTiktokUrl)
        })
        .catch(() => {})
    }
  }, [id])

  // Resolved farmer profile ID: prefer userId from farmerInfo, then farmerInfo.id, then store farmer id
  const farmerProfileId = farmerInfo?.userId || farmerInfo?._id?.toString() || (farmer as any)?.userId || farmer?.id

  const [activeTab, setActiveTab] = useState<'details' | 'order'>('details')
  const [orderQuantity, setOrderQuantity] = useState('')
  const [orderPrice, setOrderPrice] = useState(crop?.pricePerKg?.toString() || '')
  const [orderSubmitted, setOrderSubmitted] = useState(false)
  const [mapReady, setMapReady] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showInspectionModal, setShowInspectionModal] = useState(false)
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [fullscreenVideo, setFullscreenVideo] = useState<string | null>(null)
  const resolvedVideos = crop?.videos || []
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

  useEffect(() => {
    Promise.all([import('react-leaflet'), import('leaflet')]).then(([rl, L]) => {
      MapContainer = rl.MapContainer
      TileLayer = rl.TileLayer
      CircleMarker = rl.CircleMarker

      const leafletLib = L.default
      delete (leafletLib.Icon.Default.prototype as any)._getIconUrl
      leafletLib.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })
      setMapReady(true)
    }).catch(() => {})
  }, [])

  if (!crop) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-gray-500 text-lg font-bold">المحصول غير موجود</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-primary-500 font-bold">
            رجوع للسوق
          </button>
        </div>
      </div>
    )
  }

  const daysLeft = getDaysRemaining(crop.expectedHarvestDate)
  const hasMyRequest = crop.inspectionRequests.some(r => r.buyerId === currentUser?.id)
  const hasMyOrder = crop.preOrders.some(r => r.buyerId === currentUser?.id)

  const handleRequestInspection = () => {
    if (!hasMyRequest) requestInspection(crop.id)
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (!orderQuantity || parseInt(orderQuantity) <= 0) newErrors.quantity = 'أدخل كمية صحيحة'
    if (parseInt(orderQuantity) > crop.estimatedQuantityKg) newErrors.quantity = 'الكمية تتجاوز المتاح'
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }

    try {
      await createPreOrder(crop.id, parseInt(orderQuantity), orderPrice ? parseFloat(orderPrice) : 0)
      setOrderSubmitted(true)
    } catch {
      setErrors({ quantity: 'فشل إرسال الطلب، يرجى المحاولة مجدداً' })
    }
  }

  const STAGE_TIMELINE = [
    { stage: 'seeds', label: 'البذور / الشتلات', icon: '🌱', date: crop.plantingDate },
    { stage: 'growth', label: 'مرحلة النمو', icon: '🌿', date: '' },
    { stage: 'flowering', label: 'مرحلة الإزهار', icon: '🌸', date: '' },
    { stage: 'ready', label: 'جاهز للحصاد', icon: '🍅', date: crop.expectedHarvestDate },
  ]
  const currentStageIdx = ['seeds', 'growth', 'flowering', 'ready'].indexOf(crop.stage)

  return (
    <div className="min-h-screen bg-sage-50" dir="rtl">
      {/* Header */}
      <div
        className="px-4 pt-10 pb-4"
        style={{ background: 'linear-gradient(135deg, #2D6A4F 0%, #1B4332 100%)' }}
      >
        <button onClick={() => navigate(-1)} className="text-white mb-3 flex items-center gap-1">
          <ArrowRight size={20} />
          <span className="text-sm font-bold">رجوع</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-4xl">
            {CROP_EMOJIS[crop.type]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-white text-2xl font-black">{CROP_LABELS[crop.type]}</h1>
              {crop.marketTarget && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  crop.marketTarget === 'محلي' ? 'bg-yellow-500 text-white' : 'bg-blue-500 text-white'
                }`}>
                  {crop.marketTarget === 'محلي' ? '🏠 محلي' : '✈️ تصدير'}
                </span>
              )}
            </div>
            <p className="text-sage-300 text-sm">
              {crop.wilaya} •{' '}
              {farmer ? (
                <button
                  onClick={() => navigate(`/profile/${farmerProfileId}`)}
                  className="underline font-black text-white hover:text-green-200 transition-colors"
                >
                  {farmer.name}
                </button>
              ) : '—'}
            </p>
            {crop.viewCount != null && (
              <div className="flex items-center gap-1 mt-1">
                <Eye size={12} className="text-sage-300" />
                <span className="text-sage-300 text-xs">عدد المشاهدات: {crop.viewCount}</span>
              </div>
            )}
          </div>
          {/* Contact Hub in header */}
          <div onClick={e => e.stopPropagation()}>
            <ContactHub
              phone={farmerInfo?.phone || farmer?.phone || ''}
              agentName={farmerInfo?.name || farmer?.name || 'الفلاح'}
              cropName={CROP_LABELS[crop.type]}
              facebookUrl={agentFacebookUrl}
              tiktokUrl={agentTiktokUrl}
              onInspectionRequest={() => setShowInspectionModal(true)}
            />
          </div>
        </div>
      </div>

      {/* Videos section - shown first */}
      {resolvedVideos.length > 0 && (
        <div className="mx-4 mt-4">
          <h3 className="font-black text-gray-700 text-sm mb-3 flex items-center gap-2">
            🎥 فيديوهات الحقل
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
              {resolvedVideos.length} فيديو
            </span>
          </h3>
          <div className="space-y-3">
            {resolvedVideos.map((v, i) => (
              <div
                key={i}
                className="relative rounded-2xl overflow-hidden bg-black shadow-md"
                style={{ aspectRatio: '16/9' }}
              >
                <VideoPlayer
                  src={v}
                  style={{ width: '100%', height: '100%' }}
                  controls
                />
                <button
                  onClick={() => setFullscreenVideo(v)}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.6)',
                    border: '1.5px solid rgba(255,255,255,0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backdropFilter: 'blur(4px)',
                    zIndex: 10,
                    fontSize: '13px',
                  }}
                  title="ملء الشاشة"
                >
                  ⛶
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Images gallery - swipeable carousel */}
      {crop.images.length > 0 ? (
        <div className="relative mt-1">
          {/* Main image */}
          <div
            style={{ position: 'relative', height: '220px', overflow: 'hidden', cursor: 'pointer' }}
            onTouchStart={e => {
              touchStartX.current = e.touches[0].clientX
              touchStartY.current = e.touches[0].clientY
            }}
            onTouchEnd={e => {
              const dx = e.changedTouches[0].clientX - touchStartX.current
              const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current)
              if (Math.abs(dx) > 40 && dy < 60) {
                if (dx < 0) setGalleryIndex(i => Math.min(i + 1, crop.images.length - 1))
                else setGalleryIndex(i => Math.max(i - 1, 0))
              }
            }}
            onClick={() => { setLightboxImg(crop.images[galleryIndex]); setLightboxIndex(galleryIndex) }}
          >
            <img
              key={galleryIndex}
              src={crop.images[galleryIndex]}
              alt={`صورة ${galleryIndex + 1}`}
              style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }}
              draggable={false}
            />
          </div>

          {/* Zoom hint */}
          <div className="absolute top-2 left-2 bg-black bg-opacity-40 text-white text-xs px-2 py-1 rounded-full">
            🔍 اضغط للتكبير
          </div>

          {/* Counter badge */}
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {galleryIndex + 1} / {crop.images.length}
          </div>

          {/* Prev/Next arrows */}
          {crop.images.length > 1 && (
            <>
              {galleryIndex > 0 && (
                <button
                  onClick={e => { e.stopPropagation(); setGalleryIndex(i => i - 1) }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black bg-opacity-40 text-white rounded-full flex items-center justify-center text-lg"
                >
                  ›
                </button>
              )}
              {galleryIndex < crop.images.length - 1 && (
                <button
                  onClick={e => { e.stopPropagation(); setGalleryIndex(i => i + 1) }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black bg-opacity-40 text-white rounded-full flex items-center justify-center text-lg"
                >
                  ‹
                </button>
              )}
            </>
          )}

          {/* Dots indicator */}
          {crop.images.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
              {crop.images.map((_, i) => (
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
      ) : resolvedVideos.length === 0 ? (
        <div className="mx-4 mt-3 rounded-2xl overflow-hidden shadow-sm" style={{ height: '220px' }}>
          <CropImage type={crop.type} className="w-full h-full" emojiSize="text-6xl" />
        </div>
      ) : null}

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-[9999] bg-black flex flex-col"
          onTouchStart={e => { touchStartX.current = e.touches[0].clientX; touchStartY.current = e.touches[0].clientY }}
          onTouchEnd={e => {
            const dx = e.changedTouches[0].clientX - touchStartX.current
            const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current)
            if (Math.abs(dx) > 40 && dy < 60) {
              const next = dx < 0
                ? Math.min(lightboxIndex + 1, crop.images.length - 1)
                : Math.max(lightboxIndex - 1, 0)
              setLightboxIndex(next)
              setLightboxImg(crop.images[next])
            }
          }}
          onClick={() => setLightboxImg(null)}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-10 pb-3" onClick={e => e.stopPropagation()}>
            <button onClick={() => setLightboxImg(null)} className="text-white text-3xl leading-none">✕</button>
            <span className="text-white font-bold text-sm">{lightboxIndex + 1} / {crop.images.length}</span>
            <div className="w-8" />
          </div>

          {/* Main image */}
          <div className="flex-1 flex items-center justify-center px-2" onClick={e => e.stopPropagation()}>
            <img
              src={lightboxImg}
              alt="صورة المحصول"
              className="max-w-full max-h-full rounded-xl object-contain"
            />
          </div>

          {/* Prev/Next arrows in lightbox */}
          {crop.images.length > 1 && (
            <div className="absolute inset-y-0 inset-x-0 flex items-center justify-between px-3 pointer-events-none">
              <button
                className={`w-10 h-10 bg-white bg-opacity-20 rounded-full text-white text-2xl flex items-center justify-center pointer-events-auto ${lightboxIndex === crop.images.length - 1 ? 'opacity-30' : ''}`}
                onClick={e => { e.stopPropagation(); const n = Math.min(lightboxIndex + 1, crop.images.length - 1); setLightboxIndex(n); setLightboxImg(crop.images[n]) }}
              >‹</button>
              <button
                className={`w-10 h-10 bg-white bg-opacity-20 rounded-full text-white text-2xl flex items-center justify-center pointer-events-auto ${lightboxIndex === 0 ? 'opacity-30' : ''}`}
                onClick={e => { e.stopPropagation(); const n = Math.max(lightboxIndex - 1, 0); setLightboxIndex(n); setLightboxImg(crop.images[n]) }}
              >›</button>
            </div>
          )}

          {/* Thumbnails nav */}
          {crop.images.length > 1 && (
            <div className="flex gap-2 px-4 py-4 justify-center overflow-x-auto" onClick={e => e.stopPropagation()}>
              {crop.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { setLightboxImg(img); setLightboxIndex(i) }}
                  className={`flex-shrink-0 w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${i === lightboxIndex ? 'border-green-400 scale-110' : 'border-gray-600'}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <p className="text-gray-400 text-center text-xs pb-6">اسحب يميناً أو يساراً للتنقل</p>
        </div>
      )}


      {/* Fullscreen video overlay */}
      {fullscreenVideo && (
        <div
          className="fixed inset-0 z-[9999] bg-black flex flex-col"
          onClick={() => setFullscreenVideo(null)}
        >
          <div className="flex items-center justify-between px-4 pt-10 pb-3" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setFullscreenVideo(null)}
              className="text-white text-3xl leading-none w-10 h-10 flex items-center justify-center"
            >✕</button>
            <span className="text-white font-bold text-sm">🎥 فيديو الحقل</span>
            <div className="w-10" />
          </div>
          <div className="flex-1 flex items-center justify-center px-2" onClick={e => e.stopPropagation()}>
            <VideoPlayer
              src={fullscreenVideo}
              autoPlay
              controls
              style={{ width: '100%', maxHeight: '70vh', borderRadius: '12px' }}
            />
          </div>
          <p className="text-gray-500 text-center text-xs pb-8">اضغط خارج الفيديو للإغلاق</p>
        </div>
      )}

      {/* Progress bar */}
      <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm">
        <CropProgressBar
          plantingDate={crop.plantingDate}
          expectedHarvestDate={crop.expectedHarvestDate}
          cropType={crop.type}
        />
      </div>

      {/* Quick stats */}
      <div className="px-4 mt-3 grid grid-cols-3 gap-2">
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <Package size={18} className="mx-auto text-primary-500 mb-1" />
          <div className="font-black text-gray-800">{(crop.estimatedQuantityKg / 1000).toFixed(1)} طن</div>
          <div className="text-xs text-gray-400">الكمية</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <DollarSign size={18} className="mx-auto text-yellow-500 mb-1" />
          <div className="font-black text-gray-800">{crop.pricePerKg ? `${crop.pricePerKg} دج` : 'قابل للتفاوض'}</div>
          <div className="text-xs text-gray-400">السعر/كغ</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <Calendar size={18} className="mx-auto text-green-600 mb-1" />
          <div className={`font-black ${daysLeft <= 14 ? 'text-red-500' : 'text-gray-800'}`}>
            {daysLeft > 0 ? `${daysLeft}` : '0'}
          </div>
          <div className="text-xs text-gray-400">{daysLeft > 0 ? 'يوم للحصاد' : 'جاهز!'}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-4 flex gap-2 bg-white mx-4 rounded-2xl p-1 shadow-sm">
        <button
          onClick={() => setActiveTab('details')}
          className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'details' ? 'bg-primary-500 text-white shadow' : 'text-gray-500'
          }`}
        >
          التفاصيل
        </button>
        <button
          onClick={() => setActiveTab('order')}
          className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${
            activeTab === 'order' ? 'bg-yellow-500 text-white shadow' : 'text-gray-500'
          }`}
        >
          حجز مبكر
        </button>
      </div>

      {/* Tab content */}
      <div className="px-4 mt-4 pb-8">
        {activeTab === 'details' && (
          <div className="space-y-4">
            {/* Farmer info */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-black text-gray-700 text-base mb-3">معلومات الفلاح</h3>
              <div className="flex items-center justify-between">
                <TrustScore score={farmer?.trustScore || 4.0} size="md" />
                <div className="text-right">
                  <div className="font-black text-gray-800 text-base">{farmer?.name}</div>
                  <div className="text-sm text-gray-500">{farmer?.wilaya}</div>
                  <div className="text-xs text-primary-500 font-bold">{farmer?.dealsCompleted} صفقة منجزة</div>
                </div>
              </div>
              {farmer?.specialization && (
                <div className="mt-2 bg-sage-50 rounded-xl px-3 py-2 text-sm text-primary-700 font-bold text-right">
                  التخصص: {farmer.specialization}
                </div>
              )}
              {farmerProfileId && (
                <button
                  onClick={() => navigate(`/profile/${farmerProfileId}`)}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-yellow-50 border-2 border-yellow-300 text-yellow-700 font-black text-sm"
                >
                  <Star size={16} fill="currentColor" />
                  تقييم الفلاح وإضافة تعليق
                </button>
              )}
            </div>

            {/* Description */}
            {crop.description && (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <h3 className="font-black text-gray-700 text-base mb-2">وصف المحصول</h3>
                <p className="text-gray-600 text-base leading-relaxed">{crop.description}</p>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-black text-gray-700 text-base mb-3">مراحل النمو</h3>
              <div className="space-y-3">
                {STAGE_TIMELINE.map((item, idx) => (
                  <div key={item.stage} className="flex items-center gap-3">
                    <div className="text-left w-24 text-xs text-gray-400">
                      {item.date ? new Date(item.date).toLocaleDateString('ar-DZ') : ''}
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${
                      idx <= currentStageIdx ? 'bg-primary-500' : 'bg-gray-100'
                    }`}>
                      {item.icon}
                    </div>
                    <div className={`text-sm font-bold ${idx <= currentStageIdx ? 'text-primary-700' : 'text-gray-400'}`}>
                      {item.label}
                      {idx === currentStageIdx && (
                        <span className="mr-2 text-xs bg-primary-100 text-primary-600 px-1.5 py-0.5 rounded-full">
                          الآن
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini Map */}
            {mapReady && MapContainer && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="px-4 pt-3 pb-2 flex items-center gap-2">
                  <MapPin size={16} className="text-primary-500" />
                  <h3 className="font-black text-gray-700 text-base">موقع الحقل</h3>
                </div>
                <MapContainer
                  center={[crop.gpsLat, crop.gpsLng]}
                  zoom={12}
                  style={{ height: '180px', width: '100%' }}
                  zoomControl={false}
                  dragging={false}
                  scrollWheelZoom={false}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <CircleMarker
                    center={[crop.gpsLat, crop.gpsLng]}
                    radius={14}
                    pathOptions={{ fillColor: '#2D6A4F', color: '#fff', weight: 2, fillOpacity: 0.9 }}
                  />
                </MapContainer>
                <div className="px-4 py-2 text-xs text-gray-400">
                  {crop.gpsLat.toFixed(4)}°N, {crop.gpsLng.toFixed(4)}°E
                </div>
              </div>
            )}

            {/* Inspection */}
            <button
              onClick={handleRequestInspection}
              disabled={hasMyRequest}
              className={`w-full py-4 rounded-2xl font-black text-xl shadow-md transition-all ${
                hasMyRequest
                  ? 'bg-blue-100 text-blue-600 cursor-default'
                  : 'bg-primary-500 text-white hover:bg-primary-600 active:scale-95'
              }`}
            >
              {hasMyRequest ? '✓ تم إرسال طلب المعاينة' : '🔍 طلب معاينة ميدانية'}
            </button>
          </div>
        )}

        {activeTab === 'order' && (
          <div>
            {orderSubmitted || hasMyOrder ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <Check size={40} className="text-white" />
                </div>
                <h2 className="text-xl font-black text-primary-700">
                  {hasMyOrder && !orderSubmitted ? 'لديك طلب حجز قائم' : 'تم إرسال طلب الحجز!'}
                </h2>
                <p className="text-gray-500 mt-2">سيتواصل معك الوسيط قريباً</p>
                {crop.preOrders
                  .filter(o => o.buyerId === currentUser?.id)
                  .map(order => (
                    <div key={order.id} className="mt-4 bg-white rounded-2xl p-4 shadow-sm text-right">
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm font-black px-2 py-1 rounded-full ${
                          order.status === 'accepted' ? 'bg-green-100 text-green-700'
                          : order.status === 'rejected' ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status === 'accepted' ? 'مقبول' : order.status === 'rejected' ? 'مرفوض' : 'قيد الانتظار'}
                        </span>
                        <span className="text-sm font-bold text-gray-500">{order.createdAt}</span>
                      </div>
                      <p className="text-gray-700 font-bold">
                        {(order.quantityKg / 1000).toFixed(1)} طن
                        {order.pricePerKg > 0 && ` × ${order.pricePerKg} دج/كغ (مرجعي)`}
                      </p>
                      <p className="text-primary-600 font-black text-base mt-1">
                        {order.pricePerKg > 0
                          ? `تقدير: ${((order.quantityKg * order.pricePerKg) / 1000).toFixed(0)} ألف دج`
                          : '💰 السعر يُحدَّد حسب السوق عند الحصاد'}
                      </p>
                    </div>
                  ))
                }
              </div>
            ) : (
              <form onSubmit={handleSubmitOrder} className="space-y-4">

                {/* Info banner */}
                <div className="rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-amber-500 px-4 py-3 flex items-center gap-2">
                    <span className="text-2xl">📦</span>
                    <p className="text-white font-black text-base leading-tight">
                      احجز كميتك الآن قبل النضج
                    </p>
                  </div>
                  <div className="bg-amber-50 border-2 border-amber-200 border-t-0 px-4 py-3 space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-green-600 font-black text-sm mt-0.5">✓</span>
                      <p className="text-gray-700 text-sm font-bold">
                        السعر النهائي يُحدَّد عند النضج حسب سعر السوق يوم الحصاد
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-amber-600 font-black text-sm mt-0.5">↔</span>
                      <p className="text-gray-700 text-sm font-bold">
                        يمكن التفاوض على السعر ابتداءً من مرحلة الإزهار 🌸
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-500 font-black text-sm mt-0.5">🔒</span>
                      <p className="text-gray-700 text-sm font-bold">
                        حجزك يضمن لك أولوية الشراء ويمنع بيع الكمية لغيرك
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stage warning */}
                {(crop.stage === 'seeds' || crop.stage === 'growth') && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center gap-2">
                    <span className="text-lg">⏳</span>
                    <p className="text-blue-700 text-sm font-bold">
                      المحصول في مرحلة {crop.stage === 'seeds' ? 'البذور' : 'النمو'} — التفاوض يبدأ عند الإزهار
                    </p>
                  </div>
                )}
                {crop.stage === 'flowering' && (
                  <div className="bg-green-50 border border-green-300 rounded-xl px-4 py-3 flex items-center gap-2">
                    <span className="text-lg">🌸</span>
                    <p className="text-green-700 text-sm font-bold">
                      المحصول في مرحلة الإزهار — يمكنك الآن التفاوض على السعر
                    </p>
                  </div>
                )}
                {crop.stage === 'ready' && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
                    <span className="text-lg">🍅</span>
                    <p className="text-red-700 text-sm font-bold">
                      المحصول جاهز للحصاد — تواصل مع الوسيط لإتمام الصفقة مباشرةً
                    </p>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <label className="block text-gray-700 font-black mb-1.5 text-base">
                    الكمية المراد حجزها (كغ)
                  </label>
                  <input
                    type="number"
                    value={orderQuantity}
                    onChange={e => setOrderQuantity(e.target.value)}
                    placeholder={`المتاح: ${crop.estimatedQuantityKg.toLocaleString()} كغ`}
                    className={`w-full border-2 rounded-xl px-4 py-3 text-right text-base bg-white focus:outline-none focus:border-amber-400 ${
                      errors.quantity ? 'border-red-400' : 'border-gray-200'
                    }`}
                  />
                  {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
                  {orderQuantity && !errors.quantity && (
                    <p className="text-xs text-primary-600 font-bold mt-1">
                      = {(parseInt(orderQuantity) / 1000).toFixed(2)} طن
                    </p>
                  )}
                </div>

                {/* Reference price (optional) */}
                <div>
                  <label className="block text-gray-700 font-black mb-1 text-base">
                    سعر مرجعي مقترح (دج/كغ)
                    <span className="mr-2 text-xs text-gray-400 font-normal">اختياري</span>
                  </label>
                  <p className="text-xs text-gray-400 mb-1.5">
                    السعر النهائي يُتفق عليه لاحقاً — هذا مجرد مؤشر أولي
                  </p>
                  <input
                    type="number"
                    step="0.5"
                    value={orderPrice}
                    onChange={e => setOrderPrice(e.target.value)}
                    placeholder={crop.pricePerKg ? `مرجع الفلاح: ${crop.pricePerKg} دج` : 'اتركه فارغاً — حسب السوق'}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-right text-base bg-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Summary */}
                {orderQuantity && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm font-bold">الكمية المحجوزة</span>
                      <span className="text-gray-800 font-black">{parseInt(orderQuantity).toLocaleString()} كغ</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-500 text-sm font-bold">السعر</span>
                      <span className="font-black text-amber-700">
                        {orderPrice ? `${parseFloat(orderPrice)} دج/كغ (مرجعي)` : 'يُحدَّد حسب السوق عند الحصاد'}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-amber-500 text-white rounded-2xl py-4 font-black text-xl shadow-lg hover:bg-amber-600 active:scale-95 transition-all"
                >
                  تأكيد حجز الكمية 📦
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Inspection Modal */}
      {showInspectionModal && crop && (
        <InspectionModal
          cropId={crop.id}
          cropName={CROP_LABELS[crop.type]}
          farmerName={farmer?.name || ''}
          wilaya={crop.wilaya}
          onClose={() => setShowInspectionModal(false)}
        />
      )}
    </div>
  )
}
