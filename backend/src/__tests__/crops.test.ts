import request from 'supertest'
import app from '../app'
import { connectTestDB, clearCollections, disconnectTestDB, createUser, createFarmer, createCrop } from './helpers'

let agentToken: string
let buyerToken: string
let farmerId: string

beforeAll(async () => { await connectTestDB() })
afterEach(async () => { await clearCollections() })
afterAll(async () => { await disconnectTestDB() })

beforeEach(async () => {
  const agent = await createUser({ role: 'agent' })
  agentToken = agent.token
  const buyer = await createUser({ role: 'buyer', phone: `056${Date.now().toString().slice(-7)}` })
  buyerToken = buyer.token
  const farmer = await createFarmer(agentToken)
  farmerId = farmer.id
})

// ─────────────────────────────────────────────────────────────
// GET /api/crops
// ─────────────────────────────────────────────────────────────
describe('GET /api/crops', () => {
  it('يرجع قائمة فارغة في البداية', async () => {
    const res = await request(app).get('/api/crops')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('يرجع المحاصيل المعتمدة فقط (لا يرجع pending)', async () => {
    // محصول عادي (approved بالافتراضي عبر auto-approve)
    await createCrop(agentToken, farmerId)
    const res = await request(app).get('/api/crops')
    expect(res.status).toBe(200)
    // كل ما يُرجع يجب ألا يكون pending أو rejected
    res.body.forEach((c: any) => {
      expect(['pending', 'rejected']).not.toContain(c.status)
    })
  })

  it('يصفّي حسب الولاية', async () => {
    await createCrop(agentToken, farmerId, { wilaya: 'الجزائر' })
    await createCrop(agentToken, farmerId, { wilaya: 'وهران' })
    const res = await request(app).get('/api/crops?wilaya=وهران')
    expect(res.status).toBe(200)
    res.body.forEach((c: any) => expect(c.wilaya).toBe('وهران'))
  })

  it('يصفّي حسب نوع المحصول', async () => {
    await createCrop(agentToken, farmerId, { type: 'tomato' })
    await createCrop(agentToken, farmerId, { type: 'potato' })
    const res = await request(app).get('/api/crops?type=tomato')
    expect(res.status).toBe(200)
    res.body.forEach((c: any) => expect(c.type).toBe('tomato'))
  })

  it('يصفّي حسب المرحلة', async () => {
    await createCrop(agentToken, farmerId, { stage: 'growth' })
    await createCrop(agentToken, farmerId, { stage: 'ready' })
    const res = await request(app).get('/api/crops?stage=ready')
    expect(res.status).toBe(200)
    res.body.forEach((c: any) => expect(c.stage).toBe('ready'))
  })
})

// ─────────────────────────────────────────────────────────────
// GET /api/crops/:id
// ─────────────────────────────────────────────────────────────
describe('GET /api/crops/:id', () => {
  it('يرجع المحصول بمعلومات الفلاح', async () => {
    const crop = await createCrop(agentToken, farmerId)
    const res = await request(app).get(`/api/crops/${crop.id}`)
    expect(res.status).toBe(200)
    expect(res.body.type).toBe('tomato')
    expect(res.body.farmerInfo).toBeDefined()
  })

  it('يرجع 404 لمحصول غير موجود', async () => {
    const res = await request(app).get('/api/crops/64a000000000000000000000')
    expect(res.status).toBe(404)
  })
})

// ─────────────────────────────────────────────────────────────
// POST /api/crops
// ─────────────────────────────────────────────────────────────
describe('POST /api/crops', () => {
  it('يضيف محصولاً جديداً بنجاح', async () => {
    const res = await request(app)
      .post('/api/crops')
      .set('Authorization', `Bearer ${agentToken}`)
      .send({
        farmerId,
        type: 'watermelon',
        plantingDate: '2026-02-01',
        estimatedQuantityKg: 2000,
        wilaya: 'الجزائر',
        stage: 'seeds',
        pricePerKg: 50,
      })
    expect(res.status).toBe(201)
    expect(res.body.type).toBe('watermelon')
    expect(res.body.estimatedQuantityKg).toBe(2000)
    expect(res.body.pricePerKg).toBe(50)
  })

  it('يرجع 400 إذا كانت حقول أساسية ناقصة', async () => {
    const res = await request(app)
      .post('/api/crops')
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ farmerId, type: 'tomato' }) // بدون wilaya و estimatedQuantityKg
    expect(res.status).toBe(400)
  })

  it('يرجع 401 بدون token', async () => {
    const res = await request(app).post('/api/crops').send({ farmerId, type: 'tomato' })
    expect(res.status).toBe(401)
  })

  it('يضع المرحلة الافتراضية seeds إذا لم تُحدَّد', async () => {
    const res = await request(app)
      .post('/api/crops')
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ farmerId, type: 'tomato', plantingDate: '2026-01-01', estimatedQuantityKg: 500, wilaya: 'الجزائر' })
    expect(res.status).toBe(201)
    expect(res.body.stage).toBe('seeds')
  })
})

// ─────────────────────────────────────────────────────────────
// PUT /api/crops/:id
// ─────────────────────────────────────────────────────────────
describe('PUT /api/crops/:id', () => {
  it('يحدّث المحصول بنجاح من نفس الوكيل', async () => {
    const crop = await createCrop(agentToken, farmerId)
    const res = await request(app)
      .put(`/api/crops/${crop.id}`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ stage: 'ready', pricePerKg: 80 })
    expect(res.status).toBe(200)
    expect(res.body.stage).toBe('ready')
    expect(res.body.pricePerKg).toBe(80)
  })

  it('يرجع 403 إذا حاول وكيل آخر التعديل', async () => {
    const crop = await createCrop(agentToken, farmerId)
    const otherAgent = await createUser({ role: 'agent', phone: `057${Date.now().toString().slice(-7)}` })
    const res = await request(app)
      .put(`/api/crops/${crop.id}`)
      .set('Authorization', `Bearer ${otherAgent.token}`)
      .send({ stage: 'ready' })
    expect(res.status).toBe(403)
  })

  it('يرجع 404 لمحصول غير موجود', async () => {
    const res = await request(app)
      .put('/api/crops/64a000000000000000000000')
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ stage: 'ready' })
    expect(res.status).toBe(404)
  })
})

// ─────────────────────────────────────────────────────────────
// POST /api/crops/:id/inspection
// ─────────────────────────────────────────────────────────────
describe('POST /api/crops/:id/inspection', () => {
  it('يرسل طلب معاينة بنجاح', async () => {
    const crop = await createCrop(agentToken, farmerId)
    const res = await request(app)
      .post(`/api/crops/${crop.id}/inspection`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ buyerName: 'مشتري', buyerPhone: '0551234567' })
    expect(res.status).toBe(201)
    expect(res.body.message).toBeDefined()
  })

  it('يرجع 401 بدون token', async () => {
    const crop = await createCrop(agentToken, farmerId)
    const res = await request(app).post(`/api/crops/${crop.id}/inspection`).send({})
    expect(res.status).toBe(401)
  })
})

// ─────────────────────────────────────────────────────────────
// POST /api/crops/:id/preorder
// ─────────────────────────────────────────────────────────────
describe('POST /api/crops/:id/preorder', () => {
  it('يرسل طلب مسبق بنجاح', async () => {
    const crop = await createCrop(agentToken, farmerId)
    const res = await request(app)
      .post(`/api/crops/${crop.id}/preorder`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ quantityKg: 500, pricePerKg: 60 })
    expect(res.status).toBe(201)
  })

  it('يرجع 400 إذا كانت الكمية أو السعر ناقصين', async () => {
    const crop = await createCrop(agentToken, farmerId)
    const res = await request(app)
      .post(`/api/crops/${crop.id}/preorder`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ quantityKg: 500 }) // بدون pricePerKg
    expect(res.status).toBe(400)
  })
})

// ─────────────────────────────────────────────────────────────
// PUT /api/crops/:id/inspection/:inspectionId
// ─────────────────────────────────────────────────────────────
describe('PUT /api/crops/:id/inspection/:inspectionId (تحديث حالة المعاينة)', () => {
  it('يحدّث حالة المعاينة بنجاح', async () => {
    const crop = await createCrop(agentToken, farmerId)
    // أضف طلب معاينة
    await request(app)
      .post(`/api/crops/${crop.id}/inspection`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ buyerName: 'مشتري', buyerPhone: '0550000000' })

    // احصل على الطلب
    const cropRes = await request(app).get(`/api/crops/${crop.id}`)
    const inspectionId = cropRes.body.inspectionRequests[0]._id

    const res = await request(app)
      .put(`/api/crops/${crop.id}/inspection/${inspectionId}`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ status: 'approved' })
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('approved')
  })

  it('يرجع 400 لحالة غير صالحة', async () => {
    const crop = await createCrop(agentToken, farmerId)
    await request(app)
      .post(`/api/crops/${crop.id}/inspection`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ buyerName: 'مشتري', buyerPhone: '0550000000' })
    const cropRes = await request(app).get(`/api/crops/${crop.id}`)
    const inspectionId = cropRes.body.inspectionRequests[0]._id
    const res = await request(app)
      .put(`/api/crops/${crop.id}/inspection/${inspectionId}`)
      .set('Authorization', `Bearer ${agentToken}`)
      .send({ status: 'invalid_status' })
    expect(res.status).toBe(400)
  })
})

// ─────────────────────────────────────────────────────────────
// PUT /api/crops/:id/preorder/:preorderId
// ─────────────────────────────────────────────────────────────
describe('PUT /api/crops/:id/preorder/:preorderId (تحديث حالة الطلب المسبق)', () => {
  it('يقبل الحالات: pending, accepted, rejected, completed', async () => {
    const crop = await createCrop(agentToken, farmerId)
    await request(app)
      .post(`/api/crops/${crop.id}/preorder`)
      .set('Authorization', `Bearer ${buyerToken}`)
      .send({ quantityKg: 100, pricePerKg: 50 })
    const cropRes = await request(app).get(`/api/crops/${crop.id}`)
    const preorderId = cropRes.body.preOrders[0]._id

    for (const status of ['accepted', 'rejected', 'completed', 'pending']) {
      const res = await request(app)
        .put(`/api/crops/${crop.id}/preorder/${preorderId}`)
        .set('Authorization', `Bearer ${agentToken}`)
        .send({ status })
      expect(res.status).toBe(200)
      expect(res.body.status).toBe(status)
    }
  })
})
