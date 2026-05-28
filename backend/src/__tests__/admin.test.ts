import request from 'supertest'
import app from '../app'
import {
  connectTestDB, clearCollections, disconnectTestDB,
  createUser, createAdmin, createFarmer, createCrop, createEquipment, createLand
} from './helpers'

let adminToken: string
let agentToken: string

beforeAll(async () => { await connectTestDB() })
afterEach(async () => { await clearCollections() })
afterAll(async () => { await disconnectTestDB() })

beforeEach(async () => {
  const admin = await createAdmin()
  adminToken = admin.token
  const agent = await createUser({ role: 'agent' })
  agentToken = agent.token
})

// ─────────────────────────────────────────────────────────────
// الحماية: كل المسارات تتطلب صلاحيات admin
// ─────────────────────────────────────────────────────────────
describe('حماية مسارات admin', () => {
  it('يرجع 401 بدون token', async () => {
    const res = await request(app).get('/api/admin/stats')
    expect(res.status).toBe(401)
  })

  it('يرجع 403 لمستخدم عادي غير admin', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${agentToken}`)
    expect(res.status).toBe(403)
  })
})

// ─────────────────────────────────────────────────────────────
// GET /api/admin/stats
// ─────────────────────────────────────────────────────────────
describe('GET /api/admin/stats', () => {
  it('يرجع إحصائيات صحيحة', async () => {
    const farmer = await createFarmer(agentToken)
    await createCrop(agentToken, farmer.id)
    await createEquipment(agentToken)
    await createLand(agentToken)

    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body.users).toBeGreaterThan(0)
    expect(res.body.farmers).toBeGreaterThan(0)
    expect(res.body.crops).toBeGreaterThan(0)
    expect(res.body.equipment).toBeGreaterThan(0)
    expect(res.body.lands).toBeGreaterThan(0)
    expect(Array.isArray(res.body.byRole)).toBe(true)
    expect(res.body.recentUsers).toBeDefined()
  })
})

// ─────────────────────────────────────────────────────────────
// GET /api/admin/users
// ─────────────────────────────────────────────────────────────
describe('GET /api/admin/users', () => {
  it('يرجع قائمة المستخدمين مع pagination', async () => {
    await createUser({ role: 'buyer', phone: '0561111111' })
    await createUser({ role: 'farmer', phone: '0562222222' })

    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body.users).toBeDefined()
    expect(res.body.total).toBeGreaterThan(0)
    expect(res.body.page).toBe(1)
  })

  it('يصفّي حسب الدور', async () => {
    await createUser({ role: 'buyer', phone: '0563333333' })
    const res = await request(app)
      .get('/api/admin/users?role=buyer')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    res.body.users.forEach((u: any) => expect(u.role).toBe('buyer'))
  })

  it('يبحث حسب الاسم', async () => {
    await createUser({ role: 'agent', name: 'محمد بولعراس', phone: '0564444444' })
    const res = await request(app)
      .get('/api/admin/users?search=بولعراس')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body.users.length).toBeGreaterThan(0)
  })
})

// ─────────────────────────────────────────────────────────────
// PUT /api/admin/users/:id/block
// ─────────────────────────────────────────────────────────────
describe('PUT /api/admin/users/:id/block', () => {
  it('يحظر مستخدماً ثم يرفع الحظر (toggle)', async () => {
    const user = await createUser({ role: 'buyer', phone: '0565555555' })
    const userId = user.user.id

    // حظر
    const blockRes = await request(app)
      .put(`/api/admin/users/${userId}/block`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(blockRes.status).toBe(200)
    expect(blockRes.body.isBlocked).toBe(true)

    // رفع الحظر
    const unblockRes = await request(app)
      .put(`/api/admin/users/${userId}/block`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(unblockRes.status).toBe(200)
    expect(unblockRes.body.isBlocked).toBe(false)
  })

  it('يمنع تسجيل دخول المستخدم المحظور', async () => {
    const user = await createUser({ role: 'buyer', phone: '0566666666' })
    // حظر المستخدم
    await request(app)
      .put(`/api/admin/users/${user.user.id}/block`)
      .set('Authorization', `Bearer ${adminToken}`)

    // محاولة تسجيل الدخول
    const loginRes = await request(app).post('/api/auth/login').send({
      phone: '0566666666',
      password: user.password,
    })
    expect(loginRes.status).toBe(403)
  })
})

// ─────────────────────────────────────────────────────────────
// GET /api/admin/crops
// ─────────────────────────────────────────────────────────────
describe('GET /api/admin/crops', () => {
  it('يرجع كل المحاصيل بما فيها pending', async () => {
    const farmer = await createFarmer(agentToken)
    await createCrop(agentToken, farmer.id)
    const res = await request(app)
      .get('/api/admin/crops')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body.crops).toBeDefined()
    expect(res.body.total).toBeGreaterThan(0)
  })

  it('يصفّي حسب الحالة', async () => {
    const farmer = await createFarmer(agentToken)
    await createCrop(agentToken, farmer.id)
    const res = await request(app)
      .get('/api/admin/crops?status=approved')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    res.body.crops.forEach((c: any) => expect(c.status).toBe('approved'))
  })
})

// ─────────────────────────────────────────────────────────────
// PUT /api/admin/crops/:id/status
// ─────────────────────────────────────────────────────────────
describe('PUT /api/admin/crops/:id/status', () => {
  it('يرفض محصولاً', async () => {
    const farmer = await createFarmer(agentToken)
    const crop = await createCrop(agentToken, farmer.id)
    const res = await request(app)
      .put(`/api/admin/crops/${crop.id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'rejected' })
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('rejected')
  })

  it('يعتمد محصولاً', async () => {
    const farmer = await createFarmer(agentToken)
    const crop = await createCrop(agentToken, farmer.id)
    const res = await request(app)
      .put(`/api/admin/crops/${crop.id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'approved' })
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('approved')
  })

  it('يرجع 400 لحالة غير صالحة', async () => {
    const farmer = await createFarmer(agentToken)
    const crop = await createCrop(agentToken, farmer.id)
    const res = await request(app)
      .put(`/api/admin/crops/${crop.id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'unknown' })
    expect(res.status).toBe(400)
  })
})

// ─────────────────────────────────────────────────────────────
// PUT /api/admin/equipment/:id/status
// ─────────────────────────────────────────────────────────────
describe('PUT /api/admin/equipment/:id/status', () => {
  it('يرفض معدة', async () => {
    const eq = await createEquipment(agentToken)
    const res = await request(app)
      .put(`/api/admin/equipment/${eq.id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'rejected' })
    expect(res.status).toBe(200)
    expect(res.body.status).toBe('rejected')
  })
})

// ─────────────────────────────────────────────────────────────
// DELETE /api/admin/equipment/:id
// ─────────────────────────────────────────────────────────────
describe('DELETE /api/admin/equipment/:id', () => {
  it('يحذف معدة كـ admin', async () => {
    const eq = await createEquipment(agentToken)
    const res = await request(app)
      .delete(`/api/admin/equipment/${eq.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
  })
})

// ─────────────────────────────────────────────────────────────
// GET + PUT /api/admin/settings/autoApprove
// ─────────────────────────────────────────────────────────────
describe('GET/PUT /api/admin/settings/autoApprove', () => {
  it('يرجع الإعدادات الافتراضية', async () => {
    const res = await request(app)
      .get('/api/admin/settings/autoApprove')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(res.status).toBe(200)
    expect(res.body.crops).toBeDefined()
    expect(res.body.equipment).toBeDefined()
    expect(res.body.lands).toBeDefined()
  })

  it('يحدّث إعداد auto-approve للمحاصيل', async () => {
    const res = await request(app)
      .put('/api/admin/settings/autoApprove')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ category: 'crops', value: false })
    expect(res.status).toBe(200)

    // تحقق من الإعداد
    const check = await request(app)
      .get('/api/admin/settings/autoApprove')
      .set('Authorization', `Bearer ${adminToken}`)
    expect(check.body.crops).toBe(false)
  })

  it('عند إيقاف auto-approve، يصبح المحصول الجديد pending', async () => {
    // أوقف auto-approve
    await request(app)
      .put('/api/admin/settings/autoApprove')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ category: 'crops', value: false })

    // أضف محصولاً
    const farmer = await createFarmer(agentToken)
    const crop = await createCrop(agentToken, farmer.id)

    // لا يظهر في القائمة العامة (لأنه pending)
    const publicList = await request(app).get('/api/crops')
    const found = publicList.body.find((c: any) => c.id === crop.id)
    expect(found).toBeUndefined()

    // يظهر في لوحة الـ admin
    const adminList = await request(app)
      .get('/api/admin/crops?status=pending')
      .set('Authorization', `Bearer ${adminToken}`)
    const adminFound = adminList.body.crops.find((c: any) => c.id === crop.id)
    expect(adminFound).toBeDefined()
    expect(adminFound.status).toBe('pending')
  })
})
