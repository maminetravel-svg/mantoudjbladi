import request from 'supertest'
import app from '../app'
import { connectTestDB, clearCollections, disconnectTestDB, createUser, createEquipment } from './helpers'

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
// GET /api/equipment
// ─────────────────────────────────────────────────────────────
describe('GET /api/equipment', () => {
  it('يرجع قائمة فارغة في البداية', async () => {
    const res = await request(app).get('/api/equipment')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBe(0)
  })

  it('يرجع المعدات المعتمدة مع ownerName', async () => {
    await createEquipment(agentToken)
    const res = await request(app).get('/api/equipment')
    expect(res.status).toBe(200)
    expect(res.body.length).toBe(1)
    expect(res.body[0].ownerName).toBeDefined()
  })

  it('يصفّي حسب الولاية', async () => {
    await createEquipment(agentToken, { wilaya: 'الجزائر' })
    await createEquipment(agentToken, { name: 'معدة أخرى', wilaya: 'وهران', phone: '0661234567' })
    const res = await request(app).get('/api/equipment?wilaya=وهران')
    expect(res.status).toBe(200)
    expect(res.body.length).toBe(1)
    expect(res.body[0].wilaya).toBe('وهران')
  })

  it('يصفّي حسب الفئة', async () => {
    await createEquipment(agentToken, { category: 'جرارات' })
    await createEquipment(agentToken, { name: 'مضخة', category: 'معدات ري', phone: '0661234567' })
    const res = await request(app).get('/api/equipment?category=جرارات')
    expect(res.status).toBe(200)
    expect(res.body.length).toBe(1)
    expect(res.body[0].category).toBe('جرارات')
  })
})

// ─────────────────────────────────────────────────────────────
// GET /api/equipment/:id
// ─────────────────────────────────────────────────────────────
describe('GET /api/equipment/:id', () => {
  it('يرجع المعدة بالـ id مع ownerName', async () => {
    const eq = await createEquipment(agentToken, { name: 'جرار خاص' })
    const res = await request(app).get(`/api/equipment/${eq.id}`)
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('جرار خاص')
    expect(res.body.ownerName).toBeDefined()
  })

  it('يرجع 404 لـ id غير موجود', async () => {
    const res = await request(app).get('/api/equipment/64a000000000000000000000')
    expect(res.status).toBe(404)
  })
})

// ─────────────────────────────────────────────────────────────
// POST /api/equipment
// ─────────────────────────────────────────────────────────────
describe('POST /api/equipment', () => {
  it('يضيف معدة جديدة بنجاح', async () => {
    const res = await request(app)
      .post('/api/equipment')
      .set('Authorization', `Bearer ${agentToken}`)
      .send({
        name: 'مضخة رش',
        category: 'معدات ري',
        description: 'مضخة لري الحقول',
        wilaya: 'الجزائر',
        phone: '0550123456',
        pricePerDay: 3000,
      })
    expect(res.status).toBe(201)
    expect(res.body.name).toBe('مضخة رش')
    expect(res.body.pricePerDay).toBe(3000)
    expect(res.body.id).toBeDefined()
  })

  it('يرجع 400 إذا كانت الحقول الأساسية ناقصة (بدون phone)', async () => {
    const res = await request(app)
      .post('/api/equipment')
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ name: 'جرار', category: 'جرارات', wilaya: 'الجزائر' })
    expect(res.status).toBe(400)
  })

  it('يرجع 401 بدون token', async () => {
    const res = await request(app)
      .post('/api/equipment')
      .send({ name: 'جرار', category: 'جرارات', wilaya: 'الجزائر', phone: '055' })
    expect(res.status).toBe(401)
  })

  it('يحفظ الصور والفيديوهات و coverMediaType', async () => {
    const res = await request(app)
      .post('/api/equipment')
      .set('Authorization', `Bearer ${agentToken}`)
      .send({
        name: 'جرار بصور',
        category: 'جرارات',
        description: 'وصف',
        wilaya: 'الجزائر',
        phone: '0550000001',
        images: ['data:image/png;base64,abc'],
        coverMediaType: 'image',
      })
    expect(res.status).toBe(201)
    expect(res.body.images.length).toBe(1)
    expect(res.body.coverMediaType).toBe('image')
  })
})

// ─────────────────────────────────────────────────────────────
// PUT /api/equipment/:id
// ─────────────────────────────────────────────────────────────
describe('PUT /api/equipment/:id', () => {
  it('يحدّث المعدة بنجاح من نفس المالك', async () => {
    const eq = await createEquipment(agentToken)
    const res = await request(app)
      .put(`/api/equipment/${eq.id}`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ name: 'اسم محدّث', pricePerDay: 5000 })
    expect(res.status).toBe(200)
    expect(res.body.name).toBe('اسم محدّث')
    expect(res.body.pricePerDay).toBe(5000)
  })

  it('يرجع 403 إذا حاول مستخدم آخر التعديل', async () => {
    const eq = await createEquipment(agentToken)
    const other = await createUser({ role: 'agent', phone: `057${Date.now().toString().slice(-7)}` })
    const res = await request(app)
      .put(`/api/equipment/${eq.id}`)
      .set('Authorization', `Bearer ${other.token}`)
      .send({ name: 'تعديل غير مصرح' })
    expect(res.status).toBe(403)
  })

  it('يرجع 404 لمعدة غير موجودة', async () => {
    const res = await request(app)
      .put('/api/equipment/64a000000000000000000000')
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ name: 'اسم' })
    expect(res.status).toBe(404)
  })
})

// ─────────────────────────────────────────────────────────────
// DELETE /api/equipment/:id
// ─────────────────────────────────────────────────────────────
describe('DELETE /api/equipment/:id', () => {
  it('يحذف المعدة بنجاح من نفس المالك', async () => {
    const eq = await createEquipment(agentToken)
    const res = await request(app)
      .delete(`/api/equipment/${eq.id}`)
      .set('Authorization', `Bearer ${agentToken}`)
    expect(res.status).toBe(200)

    // تحقق من الحذف
    const check = await request(app).get(`/api/equipment/${eq.id}`)
    expect(check.status).toBe(404)
  })

  it('يرجع 403 إذا حاول مستخدم آخر الحذف', async () => {
    const eq = await createEquipment(agentToken)
    const other = await createUser({ role: 'agent', phone: `057${Date.now().toString().slice(-7)}` })
    const res = await request(app)
      .delete(`/api/equipment/${eq.id}`)
      .set('Authorization', `Bearer ${other.token}`)
    expect(res.status).toBe(403)

    // التحقق أن المعدة لا تزال موجودة
    const check = await request(app).get(`/api/equipment/${eq.id}`)
    expect(check.status).toBe(200)
  })

  it('يرجع 401 بدون token', async () => {
    const eq = await createEquipment(agentToken)
    const res = await request(app).delete(`/api/equipment/${eq.id}`)
    expect(res.status).toBe(401)
  })
})
