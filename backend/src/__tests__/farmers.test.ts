import request from 'supertest'
import app from '../app'
import { connectTestDB, clearCollections, disconnectTestDB, createUser, createFarmer } from './helpers'

let agentToken: string
let buyerToken: string

beforeAll(async () => { await connectTestDB() })
afterEach(async () => { await clearCollections() })
afterAll(async () => { await disconnectTestDB() })

beforeEach(async () => {
  const agent = await createUser({ role: 'agent' })
  agentToken = agent.token
  const buyer = await createUser({ role: 'buyer', phone: `056${Date.now().toString().slice(-7)}` })
  buyerToken = buyer.token
})

// ─────────────────────────────────────────────────────────────
// GET /api/farmers
// ─────────────────────────────────────────────────────────────
describe('GET /api/farmers', () => {
  it('يرجع قائمة فارغة في البداية', async () => {
    const res = await request(app).get('/api/farmers')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('يرجع الفلاحين بعد إضافتهم', async () => {
    await createFarmer(agentToken)
    await createFarmer(agentToken, { name: 'فلاح آخر', phone: '0661112233' })
    const res = await request(app).get('/api/farmers')
    expect(res.status).toBe(200)
    expect(res.body.length).toBe(2)
  })

  it('يصفّي الفلاحين حسب الولاية', async () => {
    await createFarmer(agentToken, { wilaya: 'الجزائر' })
    await createFarmer(agentToken, { wilaya: 'وهران', phone: '0661234567' })
    const res = await request(app).get('/api/farmers?wilaya=وهران')
    expect(res.status).toBe(200)
    expect(res.body.length).toBe(1)
    expect(res.body[0].wilaya).toBe('وهران')
  })
})

// ─────────────────────────────────────────────────────────────
// GET /api/farmers/:id
// ─────────────────────────────────────────────────────────────
describe('GET /api/farmers/:id', () => {
  it('يرجع الفلاح بالـ id الصحيح', async () => {
    const farmer = await createFarmer(agentToken, { name: 'فلاح مميز' })
    const res = await request(app).get(`/api/farmers/${farmer.id}`)
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('فلاح مميز')
  })

  it('يرجع 404 لـ id غير موجود', async () => {
    const res = await request(app).get('/api/farmers/64a000000000000000000000')
    expect(res.status).toBe(404)
  })
})

// ─────────────────────────────────────────────────────────────
// POST /api/farmers
// ─────────────────────────────────────────────────────────────
describe('POST /api/farmers', () => {
  it('يضيف فلاحاً جديداً بنجاح كـ agent', async () => {
    const res = await request(app)
      .post('/api/farmers')
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ name: 'فلاح جديد', phone: '0551234567', wilaya: 'باتنة' })
    expect(res.status).toBe(201)
    expect(res.body.name).toBe('فلاح جديد')
    expect(res.body.id).toBeDefined()
  })

  it('يرجع 400 إذا كانت الحقول الأساسية ناقصة', async () => {
    const res = await request(app)
      .post('/api/farmers')
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ name: 'فلاح بدون هاتف', wilaya: 'الجزائر' })
    expect(res.status).toBe(400)
  })

  it('يرجع 401 بدون token', async () => {
    const res = await request(app).post('/api/farmers').send({ name: 'فلاح', phone: '055', wilaya: 'الجزائر' })
    expect(res.status).toBe(401)
  })

  it('يرجع 403 إذا كان المستخدم buyer', async () => {
    const res = await request(app)
      .post('/api/farmers')
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ name: 'فلاح', phone: '0551111111', wilaya: 'الجزائر' })
    expect(res.status).toBe(403)
  })

  it('يحفظ الإحداثيات GPS إذا أُرسلت', async () => {
    const res = await request(app)
      .post('/api/farmers')
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ name: 'فلاح موقع', phone: '0559999999', wilaya: 'الجزائر', gpsLat: 36.7, gpsLng: 3.05 })
    expect(res.status).toBe(201)
    expect(res.body.gpsLat).toBe(36.7)
    expect(res.body.gpsLng).toBe(3.05)
  })
})

// ─────────────────────────────────────────────────────────────
// POST /api/farmers/:id/reviews
// ─────────────────────────────────────────────────────────────
describe('POST /api/farmers/:id/reviews', () => {
  let farmerId: string

  beforeEach(async () => {
    const farmer = await createFarmer(agentToken)
    farmerId = farmer.id
  })

  it('يضيف تقييماً بنجاح', async () => {
    const res = await request(app)
      .post(`/api/farmers/${farmerId}/reviews`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ rating: 4, comment: 'فلاح ممتاز ومتعاون' })
    expect(res.status).toBe(201)
  })

  it('يرجع 400 إذا كان التقييم خارج النطاق 1-5', async () => {
    const res = await request(app)
      .post(`/api/farmers/${farmerId}/reviews`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ rating: 6, comment: 'ممتاز' })
    expect(res.status).toBe(400)
  })

  it('يرجع 400 إذا كان التعليق فارغاً', async () => {
    const res = await request(app)
      .post(`/api/farmers/${farmerId}/reviews`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ rating: 3, comment: '' })
    expect(res.status).toBe(400)
  })

  it('يرجع 409 إذا قيّم نفس المستخدم مرتين', async () => {
    await request(app)
      .post(`/api/farmers/${farmerId}/reviews`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ rating: 4, comment: 'تقييم أول' })
    const res = await request(app)
      .post(`/api/farmers/${farmerId}/reviews`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ rating: 5, comment: 'تقييم ثاني' })
    expect(res.status).toBe(409)
  })

  it('يرجع 401 بدون token', async () => {
    const res = await request(app)
      .post(`/api/farmers/${farmerId}/reviews`)
      .send({ rating: 4, comment: 'تقييم' })
    expect(res.status).toBe(401)
  })
})
