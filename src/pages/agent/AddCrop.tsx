import React, { useState, useRef, lazy, Suspense, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/appStore'
import { CropType, MarketTarget, CROP_LABELS, CROP_EMOJIS, WILAYAS, isFruitCrop, calcHarvestDate, calcCropStage, CROP_DAYS_TO_MATURITY } from '../../types'
import { getCommunesByWilayaName } from '../../data/algeriaLocations'
import { CROP_SVG_ICONS } from '../../components/Shared/CropSVGIcons'
import { CropImage } from '../../components/Shared/CropImage'
import { apiUploadImages, apiUploadVideo } from '../../api/uploads'
import { ArrowRight, MapPin, Camera, Check, ChevronLeft, Search, Map, Video, Trash2, Image } from 'lucide-react'

const MapPicker = lazy(() => import('../../components/Shared/MapPicker'))

const FALLBACK_CROP_TYPES: string[] = [
  'tomato','potato','citrus','watermelon','pepper','onion','wheat','olive',
  'carrot','garlic','eggplant','zucchini','cucumber','lettuce','fig','grape',
  'apricot','peach','apple','dates','corn','barley','pumpkin','beans',
  'lentils','chickpeas','sunflower','strawberry', 'fennel', 'banana', 'cherry', 'kiwi', 'raspberry'
]

const CROP_COLORS: Record<string, string> = {
  tomato: '#ef4444', potato: '#ca8a04', citrus: '#f97316', watermelon: '#22c55e',
  pepper: '#16a34a', onion: '#a855f7', wheat: '#d97706', olive: '#65a30d',
  carrot: '#f97316', garlic: '#e2e8f0', eggplant: '#7c3aed', zucchini: '#84cc16',
  cucumber: '#22c55e', lettuce: '#4ade80', fig: '#854d0e', grape: '#7c3aed',
  apricot: '#fb923c', peach: '#fda4af', apple: '#dc2626', dates: '#92400e',
  corn: '#eab308', barley: '#d97706', pumpkin: '#ea580c', beans: '#65a30d',
  lentils: '#a16207', chickpeas: '#ca8a04', sunflower: '#eab308', strawberry: '#e11d48',
  fennel: '#a3e635', banana: '#facc15', cherry: '#be123c', kiwi: '#a3e635', raspberry: '#e11d48',
}


export default function AddCrop() {
  const navigate = useNavigate()
  const { addCrop, farmers, currentUser, availableCropTypes, cropTypesMeta } = useAppStore()
  const cropTypesList = availableCropTypes.length > 0 ? availableCropTypes : FALLBACK_CROP_TYPES

  const [step, setStep] = useState(1)
  const [searchCrop, setSearchCrop] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'vegetable' | 'fruit' | 'grain'>('all')

  // Step 1
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null)

  // Step 2
  const [selectedFarmer, setSelectedFarmer] = useState('')
  const [plantingDate, setPlantingDate] = useState('')
  const [harvestDate, setHarvestDate] = useState('')
  const [quantity, setQuantity] = useState('')
  const [wilaya, setWilaya] = useState('')
  const [commune, setCommune] = useState('')

  // Step 3
  const [price, setPrice] = useState('')
  const [marketTarget, setMarketTarget] = useState<MarketTarget>('محلي')
  const [description, setDescription] = useState('')

  // Step 4
  const [gpsLat, setGpsLat] = useState<number | null>(null)
  const [gpsLng, setGpsLng] = useState<number | null>(null)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [showMapPicker, setShowMapPicker] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [images, setImages] = useState<string[]>([])
  const [compressing, setCompressing] = useState(false)
  const [videos, setVideos] = useState<string[]>([])
  const [videoLoading, setVideoLoading] = useState(false)
  const [coverMediaType, setCoverMediaType] = useState<'image' | 'video'>('image')

  const isFarmer = currentUser?.role === 'farmer'
  const myFarmers = farmers.filter(f => f.agentId === currentUser?.id)

  // Auto-fill farmer if current user is a farmer
  React.useEffect(() => {
    if (isFarmer && currentUser) {
      const fr = farmers.find(f => (f as any).userId === currentUser.id)
      setSelectedFarmer(fr ? fr.id : currentUser.id)
    }
  }, [isFarmer, currentUser, farmers])

  const fileRef = useRef<HTMLInputElement>(null)
  const videoGalleryRef = useRef<HTMLInputElement>(null)
  const videoCameraRef = useRef<HTMLInputElement>(null)

  const filteredCropTypes = cropTypesList.filter(type => {
    const label = CROP_LABELS[type as CropType] || type
    const matchSearch = label.includes(searchCrop) || searchCrop === ''
    const meta = cropTypesMeta[type]
    const matchCategory = categoryFilter === 'all' || (meta?.subcategory === categoryFilter) ||
      (categoryFilter === 'fruit' && !meta?.subcategory && isFruitCrop(type as CropType)) ||
      (categoryFilter === 'vegetable' && !meta?.subcategory && !isFruitCrop(type as CropType) && meta?.subcategory !== 'grain')
    return matchSearch && matchCategory
  })

  const handlePlantingDate = (date: string) => {
    setPlantingDate(date)
    if (date && selectedCrop) {
      setHarvestDate(calcHarvestDate(date, selectedCrop as CropType))
    }
  }

  const captureGPS = () => {
    if (!navigator.geolocation) {
      alert('المتصفح لا يدعم تحديد الموقع')
      return
    }
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLat(parseFloat(pos.coords.latitude.toFixed(4)))
        setGpsLng(parseFloat(pos.coords.longitude.toFixed(4)))
        setGpsLoading(false)
      },
      () => {
        alert('تعذّر تحديد الموقع. تأكد من تفعيل GPS وإذن الموقع.')
        setGpsLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  const handleImageUpload = useCallback(async (files: FileList | File[]) => {
    const arr = Array.from(files)
    if (arr.length === 0) return
    setCompressing(true)
    try {
      const urls = await apiUploadImages(arr)
      setImages(prev => [...prev, ...urls])
    } catch (e: any) {
      alert(e.message || 'فشل رفع الصور')
    } finally {
      setCompressing(false)
    }
  }, [])

  const handleAddVideo = useCallback(async (file: File) => {
    setVideoLoading(true)
    try {
      const url = await apiUploadVideo(file)
      setVideos(prev => {
        const next = [...prev, url]
        // if no images, auto-select video as cover
        if (images.length === 0) setCoverMediaType('video')
        return next
      })
    } catch (e: any) {
      alert(e.message || 'فشل رفع الفيديو')
    } finally {
      setVideoLoading(false)
    }
  }, [])

  const validateStep = (s: number) => {
    const newErrors: Record<string, string> = {}
    if (s === 1 && !selectedCrop) newErrors.crop = 'اختر نوع المحصول'
    if (s === 2) {
      if (!isFarmer && !selectedFarmer) newErrors.farmer = 'اختر الفلاح'
      const isFruit = selectedCrop ? isFruitCrop(selectedCrop as CropType) : false
      const hidePlanting = selectedCrop ? (cropTypesMeta[selectedCrop]?.hidePlantingDate ?? false) : false
      if (!isFruit && !hidePlanting && !plantingDate) newErrors.plantingDate = 'تاريخ الغرس مطلوب'
      if (!harvestDate) newErrors.harvestDate = 'تاريخ الجاهزية مطلوب'
      if (!quantity) newErrors.quantity = 'الكمية مطلوبة'
      if (!wilaya) newErrors.wilaya = 'الولاية مطلوبة'
    }
    return newErrors
  }

  const nextStep = () => {
    const errs = validateStep(step)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setStep(s => s + 1)
  }

  const prevStep = () => setStep(s => s - 1)

  const handleSubmit = async () => {
    const farmer = farmers.find(f => f.id === selectedFarmer)
    const isFruit = selectedCrop ? isFruitCrop(selectedCrop as CropType) : false
    const hidePlanting = selectedCrop ? (cropTypesMeta[selectedCrop]?.hidePlantingDate ?? false) : false
    // For fruits or hidden-planting crops, derive planting date from harvest date and crop duration
    const effectivePlanting = (isFruit || hidePlanting) && harvestDate && selectedCrop
      ? (() => {
          const days = CROP_DAYS_TO_MATURITY[selectedCrop as CropType] ?? 90
          const d = new Date(harvestDate)
          d.setDate(d.getDate() - days)
          return d.toISOString().split('T')[0]
        })()
      : plantingDate
    const computedStage = calcCropStage(effectivePlanting, harvestDate)
    try {
      await addCrop({
        farmerId: selectedFarmer,
        type: selectedCrop! as CropType,
        plantingDate: effectivePlanting,
        expectedHarvestDate: harvestDate,
        estimatedQuantityKg: parseInt(quantity),
        stage: computedStage,
        images,
        videos,
        coverMediaType,
        gpsLat: gpsLat ?? farmer?.gpsLat ?? 36.5,
        gpsLng: gpsLng ?? farmer?.gpsLng ?? 3.0,
        wilaya: wilaya || farmer?.wilaya || '',
        commune: commune || '',
        pricePerKg: price ? parseFloat(price) : undefined,
        description,
        marketTarget,
      })
      setSubmitted(true)
      setTimeout(() => navigate(isFarmer ? '/farmer' : '/agent'), 1500)
    } catch (e: any) {
      alert(e.message || 'فشل حفظ المحصول. تأكد من اتصالك بالإنترنت وأن الخادم يعمل.')
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sage-50" dir="rtl">
        <div className="text-center px-6">
          <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Check size={48} className="text-white" />
          </div>
          <h2 className="text-2xl font-black text-primary-700">تم حفظ المحصول!</h2>
          <p className="text-gray-500 mt-2">سيتم مزامنة البيانات قريباً</p>
        </div>
      </div>
    )
  }

  const stepTitles = [
    'اختر المحصول',
    'المعلومات الأساسية',
    'السعر والسوق',
    'الصور والموقع',
  ]

  return (
    <div className="min-h-screen bg-sage-50 flex flex-col" dir="rtl">
      {/* Header */}
      <div
        className="px-4 pt-10 pb-5"
        style={{ background: 'linear-gradient(135deg, #2D6A4F 0%, #1B4332 100%)' }}
      >
        <button onClick={() => step > 1 ? prevStep() : navigate(-1)} className="text-white mb-3 flex items-center gap-1">
          <ArrowRight size={20} />
          <span className="text-sm font-bold">{step > 1 ? 'السابق' : 'رجوع'}</span>
        </button>
        <h1 className="text-white text-2xl font-black">🌱 إضافة محصول جديد</h1>
        <p className="text-sage-300 text-sm mt-1">{stepTitles[step - 1]}</p>

        {/* Step indicator */}
        <div className="flex gap-2 mt-3">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                s < step ? 'bg-white' : s === step ? 'bg-harvest-300' : 'bg-white bg-opacity-30'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* STEP 1: Crop category selection */}
        {step === 1 && (
          <div className="px-4 py-5">
            {/* Search */}
            <div className="relative mb-4">
              <input
                type="text"
                value={searchCrop}
                onChange={e => setSearchCrop(e.target.value)}
                placeholder="ابحث عن محصول..."
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 text-right text-base bg-white focus:outline-none focus:border-primary-500"
              />
              <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Category filter */}
            <div className="flex gap-2 mb-3">
              {(['all', 'vegetable', 'fruit', 'grain'] as const).map(f => (
                <button key={f} type="button" onClick={() => setCategoryFilter(f)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all ${categoryFilter === f ? 'bg-primary-500 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200'}`}>
                  {f === 'all' ? 'الكل' : f === 'vegetable' ? '🥦 خضر' : f === 'fruit' ? '🍎 فواكه' : '🌾 حبوب'}
                </button>
              ))}
            </div>

            <p className="text-gray-600 font-bold mb-3 text-sm">اختر نوع المحصول:</p>

            {/* 3-column grid */}
            <div className="grid grid-cols-3 gap-3">
              {filteredCropTypes.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedCrop(type)}
                  className={`relative rounded-2xl overflow-hidden transition-all aspect-square w-full flex items-end justify-center pb-3 ${
                    selectedCrop === type
                      ? 'ring-2 ring-primary-500 shadow-lg scale-95'
                      : 'border border-gray-100 bg-white shadow-sm hover:shadow-md hover:-translate-y-1'
                  }`}
                >
                  {/* The Image is fully visible, slightly padded so it's not cut off */}
                  <div className="absolute inset-0 z-0 p-2">
                     <CropImage
                        type={type as CropType}
                        className="w-full h-full object-contain rounded-xl"
                        emojiSize="text-6xl"
                     />
                  </div>

                   {/* The floating badge centered at the bottom */}
                  <div className="relative z-20">
                    <span className={`block px-5 py-1.5 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.08)] text-sm font-black transition-colors ${
                      selectedCrop === type 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-white/95 backdrop-blur-sm text-gray-800'
                    }`}>
                      {CROP_LABELS[type as CropType] || type}
                    </span>
                  </div>

                  {/* Selected checkmark overlay */}
                  {selectedCrop === type && (
                    <div className="absolute top-2 right-2 z-20 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            {errors.crop && <p className="text-red-500 text-sm mt-2">{errors.crop}</p>}
          </div>
        )}

        {/* STEP 2: Basic info */}
        {step === 2 && (
          <div className="px-4 py-5 space-y-4">
            {/* Selected crop display */}
            {selectedCrop && (
              <div className="bg-white rounded-2xl p-3 flex items-center gap-3 shadow-sm border border-gray-100">
                <CropImage type={selectedCrop as CropType} className="w-12 h-12 rounded-xl flex-shrink-0" emojiSize="text-3xl" />
                <div>
                  <div className="font-black text-gray-800">{CROP_LABELS[selectedCrop as CropType] || selectedCrop}</div>
                  <div className="text-xs text-gray-400">المحصول المختار</div>
                </div>
              </div>
            )}

            {/* Farmer - only show for agents */}
            {!isFarmer && (
              <div>
                <label className="block text-gray-700 font-black mb-1.5 text-base">الفلاح</label>
                <select
                  value={selectedFarmer}
                  onChange={e => {
                    setSelectedFarmer(e.target.value)
                    const farmer = farmers.find(f => f.id === e.target.value)
                    if (farmer) setWilaya(farmer.wilaya)
                  }}
                  className={`w-full border-2 rounded-xl px-4 py-3 text-right text-base bg-white focus:outline-none focus:border-primary-500 ${
                    errors.farmer ? 'border-red-400' : 'border-gray-200'
                  }`}
                >
                  <option value="">اختر الفلاح</option>
                  {myFarmers.map(f => (
                    <option key={f.id} value={f.id}>{f.name} - {f.wilaya}</option>
                  ))}
                </select>
                {errors.farmer && <p className="text-red-500 text-sm mt-1">{errors.farmer}</p>}
              </div>
            )}

            {/* Show farmer name badge when farmer is logged in */}
            {isFarmer && currentUser && (
              <div className="bg-green-50 border-2 border-green-300 rounded-xl px-4 py-3 flex items-center gap-3">
                <span className="text-2xl">👨‍🌾</span>
                <div>
                  <div className="font-black text-green-800">{currentUser.name}</div>
                  <div className="text-xs text-green-600">أنت صاحب هذا المحصول</div>
                </div>
              </div>
            )}

            {/* Dates */}
            {(() => {
              const hidePlanting = selectedCrop ? (cropTypesMeta[selectedCrop]?.hidePlantingDate ?? false) : false
              const isFruit = selectedCrop ? isFruitCrop(selectedCrop as CropType) : false
              return null; // just to compute
            })()}
            <div className={`grid gap-3 ${(selectedCrop && isFruitCrop(selectedCrop as CropType)) || (selectedCrop && cropTypesMeta[selectedCrop]?.hidePlantingDate) ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {(!selectedCrop || (!isFruitCrop(selectedCrop as CropType) && !cropTypesMeta[selectedCrop]?.hidePlantingDate)) && (
                <div>
                  <label className="block text-gray-700 font-black mb-1.5 text-sm">تاريخ الغرس</label>
                  <input
                    type="date"
                    value={plantingDate}
                    onChange={e => handlePlantingDate(e.target.value)}
                    className={`w-full border-2 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-primary-500 ${
                      errors.plantingDate ? 'border-red-400' : 'border-gray-200'
                    }`}
                  />
                  {errors.plantingDate && <p className="text-red-500 text-xs mt-1">{errors.plantingDate}</p>}
                </div>
              )}
              <div>
                <label className="block text-gray-700 font-black mb-1.5 text-sm">تاريخ الجاهزية المتوقع</label>
                <input
                  type="date"
                  value={harvestDate}
                  onChange={e => setHarvestDate(e.target.value)}
                  className={`w-full border-2 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-primary-500 ${
                    errors.harvestDate ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {errors.harvestDate && <p className="text-red-500 text-xs mt-1">{errors.harvestDate}</p>}
              </div>
            </div>

            {/* Stage date markers — show when planting + harvest dates are set */}
            {(plantingDate || isFruitCrop((selectedCrop ?? 'tomato') as CropType)) && harvestDate && (() => {
              const isFruit = selectedCrop ? isFruitCrop(selectedCrop as CropType) : false
              const startMs = isFruit
                ? new Date(harvestDate).getTime() - (CROP_DAYS_TO_MATURITY[selectedCrop! as CropType] ?? 90) * 86400000
                : new Date(plantingDate).getTime()
              const endMs = new Date(harvestDate).getTime()
              const total = endMs - startMs
              const now = Date.now()
              const pct = Math.min(1, Math.max(0, (now - startMs) / total))
              const stageIcons = ['🌱','🌿','🌸','🍅']
              const stageColors = ['#74b569','#2D6A4F','#22c55e','#dc2626']
              // Stage start dates: 0%, 25%, 50%, then "جاهز" = 7 days before harvest
              const stageDates = [
                new Date(startMs),
                new Date(startMs + 0.25 * total),
                new Date(startMs + 0.50 * total),
                new Date(endMs - 7 * 86400000),
              ]
              const stageLabelsVeg = ['بذرة','نمو','إزهار','جاهز']
              const stageLabelsfruit = ['إزهار','نمو','نضج','جاهز']
              const labels = isFruit ? stageLabelsfruit : stageLabelsVeg
              const activeIdx = now >= endMs - 7 * 86400000 ? 3
                : pct >= 0.5 ? 2
                : pct >= 0.25 ? 1
                : 0
              return (
                <div>
                  <p className="font-black text-gray-700 text-sm mb-2">مراحل المحصول</p>
                  <div className="grid grid-cols-4 gap-2">
                    {stageDates.map((stageDate, idx) => {
                      const active = idx === activeIdx
                      return (
                        <div
                          key={idx}
                          className="rounded-xl py-2 px-1 flex flex-col items-center gap-1 border-2 transition-all"
                          style={{
                            borderColor: active ? stageColors[idx] : '#e5e7eb',
                            background: active ? stageColors[idx] + '18' : '#f9fafb',
                          }}
                        >
                          <span className="text-xl">{stageIcons[idx]}</span>
                          <span className="text-xs font-black" style={{ color: active ? stageColors[idx] : '#9ca3af' }}>
                            {labels[idx]}
                          </span>
                          <span className="text-xs font-bold text-gray-500 text-center leading-tight">
                            {stageDate.toLocaleDateString('ar-DZ', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })()}

            {/* Quantity */}
            <div>
              <label className="block text-gray-700 font-black mb-1.5 text-base">الكمية (كغ)</label>
              <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                placeholder="5000"
                className={`w-full border-2 rounded-xl px-4 py-3 text-right text-base bg-white focus:outline-none focus:border-primary-500 ${
                  errors.quantity ? 'border-red-400' : 'border-gray-200'
                }`}
              />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
            </div>

            {/* Wilaya */}
            <div>
              <label className="block text-gray-700 font-black mb-1.5 text-base">الولاية</label>
              <select
                value={wilaya}
                onChange={e => { setWilaya(e.target.value); setCommune('') }}
                className={`w-full border-2 rounded-xl px-4 py-3 text-right text-base bg-white focus:outline-none focus:border-primary-500 ${
                  errors.wilaya ? 'border-red-400' : 'border-gray-200'
                }`}
              >
                <option value="">اختر الولاية</option>
                {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
              {errors.wilaya && <p className="text-red-500 text-sm mt-1">{errors.wilaya}</p>}
            </div>
            {/* Commune */}
            {wilaya && (
              <div>
                <label className="block text-gray-700 font-black mb-1.5 text-base">البلدية <span className="text-gray-400 font-normal text-sm">(اختياري)</span></label>
                <select
                  value={commune}
                  onChange={e => setCommune(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-right text-base bg-white focus:outline-none focus:border-primary-500"
                >
                  <option value="">اختر البلدية</option>
                  {getCommunesByWilayaName(wilaya).map(c => (
                    <option key={c.code} value={c.nameAr}>{c.nameAr}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Price & Market Target */}
        {step === 3 && (
          <div className="px-4 py-5 space-y-5">
            <div className="bg-primary-50 rounded-2xl p-4 text-center">
              <CropImage type={selectedCrop! as CropType} className="w-20 h-20 mx-auto mb-2 rounded-2xl shadow-sm" emojiSize="text-5xl" />
              <div className="font-black text-primary-700">{selectedCrop && CROP_LABELS[selectedCrop as CropType] || selectedCrop}</div>
              <div className="text-xs text-gray-500 mt-1">{quantity ? `${parseInt(quantity).toLocaleString()} كغ` : ''}</div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-gray-700 font-black mb-1.5 text-base">السعر (دج/كغ) - اختياري</label>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="45"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-right text-base bg-white focus:outline-none focus:border-primary-500"
              />
              <p className="text-xs text-gray-400 mt-1">اتركه فارغاً إذا كان قابلاً للتفاوض</p>
            </div>

            {/* Market Target */}
            <div>
              <label className="block text-gray-700 font-black mb-2 text-base">السوق المستهدف</label>
              <div className="grid grid-cols-2 gap-3">
                {(['محلي', 'تصدير'] as MarketTarget[]).map(m => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => setMarketTarget(m)}
                    className={`rounded-2xl py-4 flex flex-col items-center gap-2 border-2 transition-all ${
                      marketTarget === m
                        ? m === 'محلي' ? 'bg-yellow-500 text-white border-harvest-500' : 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-600 border-gray-200'
                    }`}
                  >
                    <span className="text-3xl">{m === 'محلي' ? '🏠' : '✈️'}</span>
                    <span className="font-black text-lg">{m}</span>
                    <span className={`text-xs ${marketTarget === m ? 'text-white text-opacity-80' : 'text-gray-400'}`}>
                      {m === 'محلي' ? 'السوق الداخلي' : 'السوق الخارجي'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 font-black mb-1.5 text-base">وصف المحصول (اختياري)</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                placeholder="أضف تفاصيل عن نوع التربة، طريقة الري، الأسمدة المستخدمة..."
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-right text-base bg-white focus:outline-none focus:border-primary-500 resize-none"
              />
            </div>
          </div>
        )}

        {/* STEP 4: Photos & GPS */}
        {step === 4 && (
          <div className="px-4 py-5 space-y-5">
            {/* Images - free grid */}
            <div>
              <label className="block text-gray-700 font-black mb-2 text-base">
                <Camera size={16} className="inline ml-1 text-primary-500" />
                صور المحصول ({images.length})
              </label>

              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {images.map((img, i) => (
                    <div key={i} className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '1' }}>
                      <img src={img} alt={`صورة ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow"
                      >
                        <span className="text-white text-xs font-black">✕</span>
                      </button>
                      {i === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-primary-600 bg-opacity-80 text-white text-xs font-bold text-center py-0.5">
                          الغلاف
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={compressing}
                className="w-full border-2 border-dashed border-primary-300 bg-primary-50 rounded-xl px-4 py-4 flex items-center justify-center gap-2 hover:bg-primary-100 transition-all"
              >
                {compressing ? (
                  <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera size={20} className="text-primary-500" />
                )}
                <span className="font-bold text-primary-700 text-sm">
                  {compressing ? 'جاري الضغط...' : '+ إضافة صورة'}
                </span>
              </button>
              <p className="text-xs text-gray-400 text-center mt-1">سيتم ضغط الصور تلقائياً · الصورة الأولى هي الغلاف</p>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={e => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleImageUpload(e.target.files)
                    e.target.value = ''
                  }
                }}
              />
            </div>

            {/* Videos */}
            <div>
              <label className="block text-gray-700 font-black mb-2 text-base">
                <Video size={16} className="inline ml-1 text-red-500" />
                فيديوهات الحقل ({videos.length})
              </label>

              {videos.length > 0 && (
                <div className="space-y-2 mb-2">
                  {videos.map((v, i) => (
                    <div key={i} className="relative rounded-xl overflow-hidden bg-black">
                      <video src={v} controls className="w-full rounded-xl max-h-48 object-cover" />
                      <button
                        type="button"
                        onClick={() => setVideos(prev => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1 shadow z-10"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => videoGalleryRef.current?.click()}
                  disabled={videoLoading}
                  className="border-2 border-dashed border-red-300 bg-red-50 rounded-xl py-4 flex flex-col items-center justify-center gap-1.5 hover:bg-red-100 transition-all"
                >
                  {videoLoading ? (
                    <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="text-2xl">📁</span>
                      <span className="text-red-700 font-bold text-sm">رفع من المعرض</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => videoCameraRef.current?.click()}
                  disabled={videoLoading}
                  className="border-2 border-dashed border-red-300 bg-red-50 rounded-xl py-4 flex flex-col items-center justify-center gap-1.5 hover:bg-red-100 transition-all"
                >
                  {videoLoading ? (
                    <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="text-2xl">🎥</span>
                      <span className="text-red-700 font-bold text-sm">تسجيل فيديو</span>
                    </>
                  )}
                </button>
              </div>
              <input
                ref={videoGalleryRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleAddVideo(f); e.target.value = '' }}
              />
              <input
                ref={videoCameraRef}
                type="file"
                accept="video/*"
                capture="environment"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleAddVideo(f); e.target.value = '' }}
              />
              <p className="text-xs text-gray-400 text-center mt-2">الحد الأقصى 50MB · يدعم MP4, MOV, WebM</p>
            </div>

            {/* Cover media selector — only when both exist */}
            {images.length > 0 && videos.length > 0 && (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <h3 className="font-black text-gray-800 text-base mb-3">🎯 ما يظهر أولاً في البطاقة</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCoverMediaType('image')}
                    className="rounded-2xl p-4 flex flex-col items-center gap-2 border-2 transition-all"
                    style={{
                      borderColor: coverMediaType === 'image' ? '#22c55e' : '#e5e7eb',
                      background: coverMediaType === 'image' ? '#f0fdf4' : '#fff',
                    }}
                  >
                    <Image size={28} className={coverMediaType === 'image' ? 'text-green-600' : 'text-gray-400'} />
                    <span className={`font-black text-sm ${coverMediaType === 'image' ? 'text-green-700' : 'text-gray-500'}`}>صورة</span>
                    {coverMediaType === 'image' && (
                      <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverMediaType('video')}
                    className="rounded-2xl p-4 flex flex-col items-center gap-2 border-2 transition-all"
                    style={{
                      borderColor: coverMediaType === 'video' ? '#ef4444' : '#e5e7eb',
                      background: coverMediaType === 'video' ? '#fff5f5' : '#fff',
                    }}
                  >
                    <Video size={28} className={coverMediaType === 'video' ? 'text-red-500' : 'text-gray-400'} />
                    <span className={`font-black text-sm ${coverMediaType === 'video' ? 'text-red-600' : 'text-gray-500'}`}>فيديو</span>
                    {coverMediaType === 'video' && (
                      <span className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* GPS via Map Picker */}
            <div>
              <label className="block text-gray-700 font-black mb-1.5 text-base">
                <MapPin size={16} className="inline ml-1 text-primary-500" />
                الموقع الجغرافي للحقل
              </label>

              {gpsLat ? (
                <div className="border-2 border-green-400 bg-green-50 rounded-xl p-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowMapPicker(true)}
                    className="text-green-600 text-sm font-bold underline"
                  >
                    تغيير
                  </button>
                  <div className="flex items-center gap-2 text-green-700 font-bold">
                    <Check size={16} className="text-green-500" />
                    <span className="text-sm">{gpsLat}°N, {gpsLng}°E</span>
                    <MapPin size={16} />
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowMapPicker(true)}
                  className="w-full border-2 border-dashed border-primary-300 bg-primary-50 rounded-xl px-4 py-5 flex flex-col items-center gap-2 hover:bg-primary-100 transition-all"
                >
                  <Map size={28} className="text-primary-500" />
                  <span className="font-black text-primary-700 text-base">حدد موقع الحقل على الخريطة</span>
                  <span className="text-xs text-gray-400">اضغط لفتح الخريطة وضع الدبوس على حقلك</span>
                </button>
              )}
            </div>

            {/* Map Picker Modal */}
            {showMapPicker && (
              <Suspense fallback={<div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center"><div className="text-white font-bold">جاري تحميل الخريطة...</div></div>}>
                <MapPicker
                  lat={gpsLat}
                  lng={gpsLng}
                  onChange={(lat, lng) => { setGpsLat(lat); setGpsLng(lng) }}
                  onClose={() => setShowMapPicker(false)}
                />
              </Suspense>
            )}

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-primary-500 text-white rounded-2xl py-4 font-black text-xl shadow-lg hover:bg-primary-600 active:scale-95 transition-all"
            >
              حفظ المحصول 🌱
            </button>
          </div>
        )}
      </div>

      {/* Step dots + navigation */}
      <div className="px-4 py-4 bg-white border-t border-gray-100 flex items-center justify-between">
        {step > 1 ? (
          <button
            onClick={prevStep}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-bold"
          >
            <ArrowRight size={18} />
            السابق
          </button>
        ) : (
          <div />
        )}

        {/* Progress dots */}
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`rounded-full transition-all ${
                s === step ? 'w-6 h-3 bg-primary-500' : s < step ? 'w-3 h-3 bg-primary-300' : 'w-3 h-3 bg-gray-200'
              }`}
            />
          ))}
        </div>

        {step < 4 ? (
          <button
            onClick={nextStep}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-primary-500 text-white font-bold"
          >
            التالي
            <ChevronLeft size={18} />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}
