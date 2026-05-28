import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { User } from './models/User'
import { Farmer } from './models/Farmer'
import { Crop } from './models/Crop'
import { Config } from './models/Config'

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mantoudj_bladi')
  console.log('🌱 Seeding...')

  await User.deleteMany({})
  await Farmer.deleteMany({})
  await Crop.deleteMany({})
  await Config.deleteMany({})

  const [adminPw, agentPw, buyerPw, farmerPw] = await Promise.all([
    bcrypt.hash('admin123', 10),
    bcrypt.hash('agent123', 10),
    bcrypt.hash('buyer123', 10),
    bcrypt.hash('farmer123', 10),
  ])

  await User.create({
    name: 'المشرف العام', phone: '0555000000', password: adminPw,
    role: 'agent', wilaya: 'الجزائر', isAdmin: true, trustScore: 5, dealsCount: 0,
  })

  const agent = await User.create({
    name: 'أحمد وكيل', phone: '0555000001', password: agentPw,
    role: 'agent', wilaya: 'الجزائر', trustScore: 4.8, dealsCount: 24,
  })
  await User.create({
    name: 'محمد مشتري', phone: '0555000002', password: buyerPw,
    role: 'buyer', wilaya: 'وهران', trustScore: 4.2, dealsCount: 8,
  })
  const farmerUser = await User.create({
    name: 'علي فلاح', phone: '0555000003', password: farmerPw,
    role: 'farmer', wilaya: 'تيزي وزو', trustScore: 4.9, dealsCount: 15,
  })

  const farmer = await Farmer.create({
    name: 'علي فلاح', phone: '0555000003', wilaya: 'تيزي وزو',
    commune: 'بوعرفة', gpsLat: 36.7, gpsLng: 4.05,
    trustScore: 4.9, dealsCompleted: 15,
    specialization: 'طماطم وفلفل',
    agentId: agent._id.toString(),
    userId: farmerUser._id.toString(),
  })

  await Crop.create({
    farmerId: farmer._id.toString(),
    agentId: agent._id.toString(),
    type: 'tomato', plantingDate: '2025-01-15',
    expectedHarvestDate: '2025-04-15',
    estimatedQuantityKg: 5000, stage: 'growth',
    wilaya: 'تيزي وزو', pricePerKg: 80,
    description: 'طماطم عضوية عالية الجودة',
    marketTarget: 'محلي', gpsLat: 36.72, gpsLng: 4.05,
  })

  // ── Seed crop types config ──────────────────────────────────────────────────
  await Config.create({
    configType: 'cropTypes',
    items: [
      { key: 'tomato',     labelAr: 'طماطم',       emoji: '🍅', isActive: true, order: 0 },
      { key: 'potato',     labelAr: 'بطاطا',        emoji: '🥔', isActive: true, order: 1 },
      { key: 'citrus',     labelAr: 'حمضيات',       emoji: '🍊', isActive: true, order: 2 },
      { key: 'watermelon', labelAr: 'بطيخ',         emoji: '🍉', isActive: true, order: 3 },
      { key: 'pepper',     labelAr: 'فلفل',         emoji: '🫑', isActive: true, order: 4 },
      { key: 'onion',      labelAr: 'بصل',          emoji: '🧅', isActive: true, order: 5 },
      { key: 'wheat',      labelAr: 'قمح',          emoji: '🌾', isActive: true, order: 6 },
      { key: 'olive',      labelAr: 'زيتون',        emoji: '🫒', isActive: true, order: 7 },
      { key: 'carrot',     labelAr: 'جزر',          emoji: '🥕', isActive: true, order: 8 },
      { key: 'garlic',     labelAr: 'ثوم',          emoji: '🧄', isActive: true, order: 9 },
      { key: 'eggplant',   labelAr: 'باذنجان',      emoji: '🍆', isActive: true, order: 10 },
      { key: 'zucchini',   labelAr: 'كوسة',         emoji: '🥒', isActive: true, order: 11 },
      { key: 'cucumber',   labelAr: 'خيار',         emoji: '🥒', isActive: true, order: 12 },
      { key: 'lettuce',    labelAr: 'خس',           emoji: '🥬', isActive: true, order: 13 },
      { key: 'fig',        labelAr: 'تين',          emoji: '🍈', isActive: true, order: 14 },
      { key: 'grape',      labelAr: 'عنب',          emoji: '🍇', isActive: true, order: 15 },
      { key: 'apricot',    labelAr: 'مشمش',         emoji: '🍑', isActive: true, order: 16 },
      { key: 'peach',      labelAr: 'خوخ',          emoji: '🍑', isActive: true, order: 17 },
      { key: 'apple',      labelAr: 'تفاح',         emoji: '🍎', isActive: true, order: 18 },
      { key: 'dates',      labelAr: 'تمور',         emoji: '🌴', isActive: true, order: 19 },
      { key: 'corn',       labelAr: 'ذرة',          emoji: '🌽', isActive: true, order: 20 },
      { key: 'barley',     labelAr: 'شعير',         emoji: '🌾', isActive: true, order: 21 },
      { key: 'pumpkin',    labelAr: 'قرع',          emoji: '🎃', isActive: true, order: 22 },
      { key: 'beans',      labelAr: 'فاصوليا',      emoji: '🫘', isActive: true, order: 23 },
      { key: 'lentils',    labelAr: 'عدس',          emoji: '🫘', isActive: true, order: 24 },
      { key: 'chickpeas',  labelAr: 'حمص',          emoji: '🫘', isActive: true, order: 25 },
      { key: 'sunflower',  labelAr: 'عباد الشمس',   emoji: '🌻', isActive: true, order: 26 },
      { key: 'strawberry', labelAr: 'فراولة',       emoji: '🍓', isActive: true, order: 27 },
    ],
  })

  // ── Seed equipment types config ─────────────────────────────────────────────
  await Config.create({
    configType: 'equipmentTypes',
    items: [
      { key: 'irrigation', labelAr: 'معدات ري',       emoji: '💧', isActive: true, order: 0 },
      { key: 'tractors',   labelAr: 'جرارات',         emoji: '🚜', isActive: true, order: 1 },
      { key: 'greenhouse', labelAr: 'بيوت بلاستيكية', emoji: '🏚️', isActive: true, order: 2 },
      { key: 'fertilizer', labelAr: 'أسمدة',          emoji: '🪣', isActive: true, order: 3 },
      { key: 'seeds',      labelAr: 'بذور',           emoji: '🌱', isActive: true, order: 4 },
    ],
  })

  console.log('✅ Done!')
  console.log('🔑 Admin:  0555000000 / admin123')
  console.log('👤 Agent:  0555000001 / agent123')
  console.log('👤 Buyer:  0555000002 / buyer123')
  console.log('👤 Farmer: 0555000003 / farmer123')
  await mongoose.disconnect()
}

seed().catch(e => { console.error(e); process.exit(1) })
