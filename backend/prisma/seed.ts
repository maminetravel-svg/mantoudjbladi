import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo users
  const agentPassword = await bcrypt.hash('agent123', 10)
  const buyerPassword = await bcrypt.hash('buyer123', 10)
  const farmerPassword = await bcrypt.hash('farmer123', 10)

  const agent = await prisma.user.upsert({
    where: { phone: '0555000001' },
    update: {},
    create: {
      name: 'أحمد وكيل',
      phone: '0555000001',
      password: agentPassword,
      role: 'agent',
      wilaya: 'الجزائر',
      trustScore: 4.8,
      dealsCount: 24,
    },
  })

  const buyer = await prisma.user.upsert({
    where: { phone: '0555000002' },
    update: {},
    create: {
      name: 'محمد مشتري',
      phone: '0555000002',
      password: buyerPassword,
      role: 'buyer',
      wilaya: 'وهران',
      trustScore: 4.2,
      dealsCount: 8,
    },
  })

  const farmerUser = await prisma.user.upsert({
    where: { phone: '0555000003' },
    update: {},
    create: {
      name: 'علي فلاح',
      phone: '0555000003',
      password: farmerPassword,
      role: 'farmer',
      wilaya: 'تيزي وزو',
      trustScore: 4.9,
      dealsCount: 15,
    },
  })

  // Create farmer profile
  const farmer = await prisma.farmer.upsert({
    where: { userId: farmerUser.id },
    update: {},
    create: {
      name: 'علي فلاح',
      phone: '0555000003',
      wilaya: 'تيزي وزو',
      commune: 'بوعرفة',
      gpsLat: 36.7,
      gpsLng: 4.05,
      trustScore: 4.9,
      dealsCompleted: 15,
      specialization: 'طماطم وفلفل',
      agentId: agent.id,
      userId: farmerUser.id,
    },
  })

  // Add a demo crop
  await prisma.crop.create({
    data: {
      farmerId: farmer.id,
      agentId: agent.id,
      type: 'tomato',
      plantingDate: '2025-01-15',
      expectedHarvestDate: '2025-04-15',
      estimatedQuantityKg: 5000,
      stage: 'growth',
      wilaya: 'تيزي وزو',
      pricePerKg: 80,
      description: 'طماطم عضوية عالية الجودة',
      marketTarget: 'محلي',
      gpsLat: 36.72,
      gpsLng: 4.05,
    },
  })

  console.log('✅ Seed completed!')
  console.log('👤 Agent:  0555000001 / agent123')
  console.log('👤 Buyer:  0555000002 / buyer123')
  console.log('👤 Farmer: 0555000003 / farmer123')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
