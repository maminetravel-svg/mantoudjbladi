import request from 'supertest'
import app from '../app'
import { connectTestDB, clearCollections, disconnectTestDB, createUser, createLand } from './helpers'

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
// GET /api/lands
// ─────────────────────────────────────────────────────────────
describe('GET /api/lands', () => {
  it('يرجع قائمة فارغة في البداية', async () => {
    const res = await request(app).get('/api/lands')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('يرجع الأراضي المعتمدة مع ownerName', async () => {
    await createLand(agentToken)
    const res = await request(app).get('/api/lands')
    expect(res.status).toBe(200)
    expect(res.body.length).toBe(1)
    expect(res.body[0].ownerName).toBeDefined()
  })

  it('يصفّي حسب الولاية', async () => {
    await createLand(agentToken, { wilaya: 'الجزائر' })
    await createLand(agentToken, { wilaya: 'سطيف', phone: '0661234567' })
    const res = await request(app).get('/api/lands?wilaya=سطيف')
    expect(res.status).toBe(200)
    expect(res.body.length).toBe(1)
    expect(res.body[0].wilaya).toBe('سطيف')
  })

  it('يصفّي حسب الهدف (بيع/إيجار)', async () => {
    await createLand(agentToken, { goal: 'بيع' })
    await createLand(agentToken, { goal: 'إيجار', phone: '0661234567' })
    const res = await request(app).get('/api/lands?goal=إيجار')
    expect(res.status).toBe(200)
    expect(res.body.length).toBe(1)
    expect(res.body[0].goal).toBe('إيجار')
  })
})

// ─────────────────────────────────────────────────────────────
// GET /api/lands/:id
// ─────────────────────────────────────────────────────────────
describe('GET /api/lands/:id', () => {
  it('يرجع الأرض بالـ id مع ownerName', async () => {
    const land = await createLand(agentToken, { area: 10 })
    const res = await request(app).get(`/api/lands/${land.id}`)
    expect(res.status).toBe(200)
    expect(res.body.area).toBe(10)
    expect(res.body.ownerName).toBeDefined()
  })

  it('يرجع 404 لـ id غير موجود', async () => {
    const res = await request(app).get('/api/lands/64a000000000000000000000')
    expect(res.status).toBe(404)
  })
})

// ─────────────────────────────────────────────────────────────
// POST /api/lands
// ─────────────────────────────────────────────────────────────
describe('POST /api/lands', () => {
  it('يضيف أرضاً جديدة بنجاح', async () => {
    const res = await request(app)
      .post('/api/lands')
      .set('Authorization', `Bearer ${agentToken}`)
      .send({
        area: 3.5,
        wilaya: 'باتنة',
        goal: 'بيع',
        priceType: 'ثابت',
        price: 8000000,
        description: 'أرض زراعية مميزة',
        documents: 'دفتر عقاري',
        features: ['ماء', 'بئر'],
        phone: '0551112233',
      })
    expect(res.status).toBe(201)
    expect(res.body.area).toBe(3.5)
    expect(res.body.goal).toBe('بيع')
    expect(res.body.phone).toBe('0551112233')
    expect(res.body.id).toBeDefined()
  })

  it('يرجع 400 إذا كانت الحقول الأساسية ناقصة', async () => {
    const res = await request(app)
      .post('/api/lands')
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ area: 5, wilaya: 'الجزائر' }) // بدون goal و priceType
    expect(res.status).toBe(400)
  })

  it('يرجع 401 بدون token', async () => {
    const res = await request(app)
      .post('/api/lands')
      .send({ area: 5, wilaya: 'الجزائر', goal: 'بيع', priceType: 'ثابت' })
    expect(res.status).toBe(401)
  })

  it('يحفظ رقم الهاتف بشكل صحيح', async () => {
    const land = await createLand(agentToken, { phone: '0771234567' })
    const res = await request(app).get(`/api/lands/${land.id}`)
    expect(res.body.phone).toBe('0771234567')
  })

  it('يحفظ الإحداثيات GPS اختياريًا', async () => {
    const res = await request(app)
      .post('/api/lands')
      .set('Authorization', `Bearer ${agentToken}`)
      .send({
        area: 2, wilaya: 'الجزائر', goal: 'إيجار',
        priceType: 'قابل للتفاوض', description: 'أرض',
        documents: 'عقد شراء', features: [], phone: '0550000002',
        gpsLat: 36.5, gpsLng: 3.1,
      })
    expect(res.status).toBe(201)
    expect(res.body.gpsLat).toBe(36.5)
    expect(res.body.gpsLng).toBe(3.1)
  })
})

// ─────────────────────────────────────────────────────────────
// PUT /api/lands/:id
// ─────────────────────────────────────────────────────────────
describe('PUT /api/lands/:id', () => {
  it('يحدّث الأرض بنجاح من نفس المالك', async () => {
    const land = await createLand(agentToken)
    const res = await request(app)
      .put(`/api/lands/${land.id}`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ area: 8, description: 'وصف محدّث', phone: '0559876543' })
    expect(res.status).toBe(200)
    expect(res.body.area).toBe(8)
    expect(res.body.description).toBe('وصف محدّث')
    expect(res.body.phone).toBe('0559876543')
  })

  it('يرجع 403 إذا حاول مستخدم آخر التعديل', async () => {
    const land = await createLand(agentToken)
    const other = await createUser({ role: 'agent', phone: `057${Date.now().toString().slice(-7)}` })
    const res = await request(app)
      .put(`/api/lands/${land.id}`)
      .set('Authorization', `Bearer ${other.token}`)
      .send({ area: 99 })
    expect(res.status).toBe(403)
  })

  it('يرجع 404 لأرض غير موجودة', async () => {
    const res = await request(app)
      .put('/api/lands/64a000000000000000000000')
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ area: 1 })
    expect(res.status).toBe(404)
  })
})

// ─────────────────────────────────────────────────────────────
// DELETE /api/lands/:id
// ─────────────────────────────────────────────────────────────
describe('DELETE /api/lands/:id', () => {
  it('يحذف الأرض بنجاح من نفس المالك', async () => {
    const land = await createLand(agentToken)
    const res = await request(app)
      .delete(`/api/lands/${land.id}`)
      .set('Authorization', `Bearer ${agentToken}`)
    expect(res.status).toBe(200)

    const check = await request(app).get(`/api/lands/${land.id}`)
    expect(check.status).toBe(404)
  })

  it('يرجع 403 إذا حاول مستخدم آخر الحذف', async () => {
    const land = await createLand(agentToken)
    const other = await createUser({ role: 'buyer', phone: `057${Date.now().toString().slice(-7)}` })
    const res = await request(app)
      .delete(`/api/lands/${land.id}`)
      .set('Authorization', `Bearer ${other.token}`)
    expect(res.status).toBe(403)
  })

  it('يرجع 401 بدون token', async () => {
    const land = await createLand(agentToken)
    const res = await request(app).delete(`/api/lands/${land.id}`)
    expect(res.status).toBe(401)
  })
})
