import mongoose from 'mongoose'
import request from 'supertest'
import app from '../app'

export async function connectTestDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI!)
  }
}

export async function disconnectTestDB() {
  await mongoose.connection.dropDatabase()
  await mongoose.disconnect()
}

export async function clearCollections() {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
}

/** Register a test user and return { user, token } */
export async function createUser(overrides: {
  name?: string
  phone?: string
  password?: string
  wilaya?: string
  role?: string
} = {}) {
  const data = {
    name: overrides.name ?? 'مستخدم تجريبي',
    phone: overrides.phone ?? `05${Date.now().toString().slice(-8)}`,
    password: overrides.password ?? 'password123',
    wilaya: overrides.wilaya ?? 'الجزائر',
    role: overrides.role ?? 'agent',
  }
  const res = await request(app).post('/api/auth/register').send(data)
  return { user: res.body.user, token: res.body.token, phone: data.phone, password: data.password }
}

/** Create an admin user directly via DB */
export async function createAdmin() {
  const { User } = await import('../models/User')
  const bcrypt = await import('bcryptjs')
  const jwt = await import('jsonwebtoken')

  const hashed = await bcrypt.hash('admin123', 10)
  const user = await User.create({
    name: 'مشرف',
    phone: `09${Date.now().toString().slice(-8)}`,
    password: hashed,
    wilaya: 'الجزائر',
    role: 'agent',
    isAdmin: true,
  })
  const token = jwt.sign(
    { userId: user._id.toString(), role: user.role, isAdmin: true },
    process.env.JWT_SECRET || 'test_secret_key_for_testing',
    { expiresIn: '1d' }
  )
  return { user, token }
}

/** Create a test farmer via API */
export async function createFarmer(token: string, overrides: Record<string, unknown> = {}) {
  const res = await request(app)
    .post('/api/farmers')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: overrides.name ?? 'فلاح تجريبي',
      phone: overrides.phone ?? `06${Date.now().toString().slice(-8)}`,
      wilaya: overrides.wilaya ?? 'الجزائر',
      ...overrides,
    })
  return res.body
}

/** Create a test crop via API */
export async function createCrop(token: string, farmerId: string, overrides: Record<string, unknown> = {}) {
  const res = await request(app)
    .post('/api/crops')
    .set('Authorization', `Bearer ${token}`)
    .send({
      farmerId,
      type: 'tomato',
      plantingDate: '2026-01-01',
      estimatedQuantityKg: 1000,
      wilaya: 'الجزائر',
      stage: 'growth',
      ...overrides,
    })
  return res.body
}

/** Create test equipment via API */
export async function createEquipment(token: string, overrides: Record<string, unknown> = {}) {
  const res = await request(app)
    .post('/api/equipment')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'جرار تجريبي',
      category: 'جرارات',
      description: 'جرار للاختبار',
      wilaya: 'الجزائر',
      phone: '0550000000',
      ...overrides,
    })
  return res.body
}

/** Create test land via API */
export async function createLand(token: string, overrides: Record<string, unknown> = {}) {
  const res = await request(app)
    .post('/api/lands')
    .set('Authorization', `Bearer ${token}`)
    .send({
      area: 5,
      wilaya: 'الجزائر',
      goal: 'بيع',
      priceType: 'ثابت',
      price: 10000000,
      description: 'أرض للاختبار',
      documents: 'دفتر عقاري',
      features: ['ماء', 'كهرباء'],
      phone: '0550000001',
      ...overrides,
    })
  return res.body
}
