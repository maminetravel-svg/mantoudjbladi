export type UserRole = 'agent' | 'buyer' | 'farmer'
export type CropStage = 'seeds' | 'growth' | 'flowering' | 'ready'
export type CropType =
  | 'tomato' | 'potato' | 'citrus' | 'watermelon' | 'pepper' | 'onion' | 'wheat' | 'olive'
  | 'carrot' | 'garlic' | 'eggplant' | 'zucchini' | 'cucumber' | 'lettuce' | 'fig'
  | 'grape' | 'apricot' | 'peach' | 'apple' | 'dates' | 'corn' | 'barley'
  | 'pumpkin' | 'beans' | 'lentils' | 'chickpeas' | 'sunflower' | 'strawberry'
  | 'fennel' | 'banana' | 'cherry' | 'kiwi' | 'raspberry'
export type EquipmentCategory = 'معدات ري' | 'جرارات' | 'بيوت بلاستيكية' | 'أسمدة' | 'بذور'
export type LandGoal = 'بيع' | 'إيجار'
export type PriceType = 'ثابت' | 'قابل للتفاوض' | 'عرض'
export type MarketTarget = 'محلي' | 'تصدير'

export interface FarmerReview {
  id: string
  buyerId: string
  buyerName: string
  rating: number  // 1-5
  comment: string
  createdAt: string
}

export interface User {
  id: string
  name: string
  role: UserRole
  wilaya: string
  trustScore: number
  dealsCount: number
  phone?: string
  password?: string
  firstName?: string
  lastName?: string
  commune?: string
  gpsLat?: number
  gpsLng?: number
  mbId?: string
  isActive?: boolean
  isAdmin?: boolean
  isSuperAdmin?: boolean
  email?: string
  profileImage?: string
  badges?: string[]
  facebookUrl?: string
  tiktokUrl?: string
}

export interface AgentFarmer {
  id: string
  _id: string
  name: string
  phone: string
  wilaya: string
  commune?: string
  specialization?: string
  agentId: string
  userId?: string
  isActiveForAgent: boolean
  productsCount: number
  trustScore: number
  dealsCompleted: number
  createdAt: string
}

export interface ConnectionRequest {
  _id: string
  agentId: string
  agentName: string
  farmerId: string
  farmerName: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
}

export interface Farmer {
  id: string
  name: string
  phone: string
  wilaya: string
  gpsLat: number
  gpsLng: number
  agentId: string
  trustScore: number
  dealsCompleted: number
  specialization?: string
  commune?: string
  reviews?: FarmerReview[]
}

export interface InspectionRequest {
  id: string
  buyerId: string
  buyerName: string
  buyerPhone?: string
  cropId: string
  status: 'pending' | 'approved' | 'completed' | 'rejected'
  requestedAt: string
}

export interface PreOrder {
  id: string
  buyerId: string
  buyerName: string
  buyerPhone?: string
  cropId: string
  quantityKg: number
  pricePerKg: number
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
  createdAt: string
}


export interface Crop {
  id: string
  farmerId: string
  agentId: string
  type: CropType
  plantingDate: string
  expectedHarvestDate: string
  estimatedQuantityKg: number
  stage: CropStage
  images: string[]
  videos?: string[]  // base64 or object URL
  coverMediaType?: 'image' | 'video'
  gpsLat: number
  gpsLng: number
  wilaya: string
  commune?: string
  isOfflinePending: boolean
  pricePerKg?: number
  description?: string
  marketTarget?: MarketTarget
  viewCount?: number
  inspectionRequests: InspectionRequest[]
  preOrders: PreOrder[]
}

export interface Equipment {
  id: string
  name: string
  category: EquipmentCategory
  pricePerDay?: number
  wilaya: string
  commune?: string
  phone: string
  description: string
  images?: string[]
  videos?: string[]
  coverMediaType?: 'image' | 'video'
  gpsLat?: number
  gpsLng?: number
  createdAt: string
  agentId?: string
  ownerName?: string
}

export interface Land {
  id: string
  area: number
  wilaya: string
  commune?: string
  documents: string | string[]
  features: string[]
  price: number
  priceType?: PriceType
  goal: LandGoal
  description: string
  gpsLat?: number
  gpsLng?: number
  phone?: string
  images?: string[]
  videos?: string[]
  coverMediaType?: 'image' | 'video'
  createdAt: string
  agentId?: string
  ownerName?: string
}

export const CROP_LABELS: Record<CropType, string> = {
  tomato: 'طماطم', potato: 'بطاطا', citrus: 'حمضيات', watermelon: 'بطيخ',
  pepper: 'فلفل', onion: 'بصل', wheat: 'قمح', olive: 'زيتون',
  carrot: 'جزر', garlic: 'ثوم', eggplant: 'باذنجان', zucchini: 'كوسة',
  cucumber: 'خيار', lettuce: 'خس', fig: 'تين', grape: 'عنب',
  apricot: 'مشمش', peach: 'خوخ', apple: 'تفاح', dates: 'تمور',
  corn: 'ذرة', barley: 'شعير', pumpkin: 'قرع', beans: 'فاصوليا',
  lentils: 'عدس', chickpeas: 'حمص', sunflower: 'عباد الشمس', strawberry: 'فراولة',
  fennel: 'بسباس', banana: 'موز', cherry: 'كرز', kiwi: 'كيوي', raspberry: 'توت',
}

export const CROP_EMOJIS: Record<CropType, string> = {
  tomato: '🍅', potato: '🥔', citrus: '🍊', watermelon: '🍉',
  pepper: '🫑', onion: '🧅', wheat: '🌾', olive: '🫒',
  carrot: '🥕', garlic: '🧄', eggplant: '🍆', zucchini: '🥒',
  cucumber: '🥒', lettuce: '🥬', fig: '🍈', grape: '🍇',
  apricot: '🍑', peach: '🍑', apple: '🍎', dates: '🌴',
  corn: '🌽', barley: '🌾', pumpkin: '🎃', beans: '🫘',
  lentils: '🫘', chickpeas: '🫘', sunflower: '🌻', strawberry: '🍓',
  fennel: '🌿', banana: '🍌', cherry: '🍒', kiwi: '🥝', raspberry: '🫐',
}

export const STAGE_LABELS: Record<CropStage, string> = {
  seeds: 'بذرة',
  growth: 'نمو',
  flowering: 'إزهار',
  ready: 'جاهز',
}

export const FRUIT_CROPS = new Set<CropType>([
  'citrus', 'fig', 'grape', 'apricot', 'peach', 'apple', 'dates',
  'banana', 'cherry', 'kiwi', 'raspberry', 'olive',
])

export function isFruitCrop(type: CropType): boolean {
  return FRUIT_CROPS.has(type)
}

export const CROP_DAYS_TO_MATURITY: Record<CropType, number> = {
  // Vegetables / annuals
  tomato: 80, potato: 100, pepper: 85, onion: 120, carrot: 90,
  garlic: 160, eggplant: 80, zucchini: 50, cucumber: 55, lettuce: 45,
  corn: 90, wheat: 150, barley: 140, pumpkin: 100, beans: 60,
  lentils: 110, chickpeas: 100, sunflower: 100, fennel: 75,
  watermelon: 80, strawberry: 40,
  // Fruits / perennials (days from flowering/bud to harvest)
  apricot: 70, cherry: 55, peach: 100, fig: 75, grape: 100,
  apple: 150, citrus: 270, olive: 200, dates: 190,
  banana: 105, kiwi: 165, raspberry: 35,
}

/** Auto-calculate crop stage from planting and expected harvest dates */
export function calcCropStage(plantingDate: string, harvestDate: string): CropStage {
  const start = new Date(plantingDate).getTime()
  const end = new Date(harvestDate).getTime()
  const now = Date.now()
  if (now >= end) return 'ready'
  const total = end - start
  if (total <= 0) return 'ready'
  const elapsed = now - start
  const pct = Math.max(0, elapsed / total)
  const daysLeft = (end - now) / (1000 * 60 * 60 * 24)
  if (daysLeft <= 7) return 'ready'
  if (pct < 0.25) return 'seeds'
  if (pct < 0.50) return 'growth'
  if (pct < 0.75) return 'flowering'
  return 'ready'
}

/** Stage label adjusted for fruit crops (no "بذرة" stage) */
export function getStageLabel(stage: CropStage, cropType: CropType): string {
  if (isFruitCrop(cropType)) {
    const fruitLabels: Record<CropStage, string> = {
      seeds: 'إزهار',
      growth: 'نمو',
      flowering: 'نضج',
      ready: 'جاهز',
    }
    return fruitLabels[stage]
  }
  return STAGE_LABELS[stage]
}

/** Calculate expected harvest date from planting date and crop type */
export function calcHarvestDate(plantingDate: string, cropType: CropType): string {
  const days = CROP_DAYS_TO_MATURITY[cropType] ?? 90
  const d = new Date(plantingDate)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

export const EQUIPMENT_CATEGORIES: EquipmentCategory[] = [
  'معدات ري', 'جرارات', 'بيوت بلاستيكية', 'أسمدة', 'بذور'
]

export const LAND_DOCUMENTS = [
  'دفتر عقاري',
  'تنازل+شهادة حسن الجوار',
  'تنازل+شهادة حسن الجوار+مخطط',
  'عقد شراء',
  'حكم قضائي',
  'شهادة ملكية',
]

export const LAND_FEATURES = [
  'ماء', 'كهرباء', 'بئر', 'بئر ارتوازي', 'غاز', 'بيت', 'حديقة', 'طريق', 'تربة حمراء', 'سور'
]

export { WILAYA_NAMES as WILAYAS } from '../data/algeriaLocations'
