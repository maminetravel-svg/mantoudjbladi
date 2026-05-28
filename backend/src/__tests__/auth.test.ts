import request from 'supertest'
import app from '../app'
import { connectTestDB, clearCollections, disconnectTestDB } from './helpers'

beforeAll(async () => { await connectTestDB() })
afterEach(async () => { await clearCollections() })
afterAll(async () => { await disconnectTestDB() })

// ─────────────────────────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────────────────────────
describe('POST /api/auth/register', () => {
  const validData = {
    name: 'أحمد بن علي',
    phone: '0550123456',
    password: 'securePass1',
    wilaya: 'الجزائر',
    role: 'agent',
  }

  it('ينجح التسجيل ويرجع مستخدم وtoken', async () => {
    const res = await request(app).post('/api/auth/register').send(validData)
    expect(res.status).toBe(201)
    expect(res.body.token).toBeDefined()
    expect(res.body.user.phone).toBe(validData.phone)
    expect(res.body.user.password).toBeUndefined() // لا يُرجع كلمة المرور
  })

  it('يرجع 400 إذا كانت حقول ناقصة', async () => {
    const res = await request(app).post('/api/auth/register').send({ name: 'أحمد', phone: '0550111111' })
    expect(res.status).toBe(400)
    expect(res.body.error).toBeDefined()
  })

  it('يرجع 400 إذا كانت كلمة المرور أقل من 6 أحرف', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...validData, password: '123' })
    expect(res.status).toBe(400)
  })

  it('يرجع 400 إذا كان الدور غير صالح', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...validData, role: 'superuser' })
    expect(res.status).toBe(400)
  })

  it('يرجع 409 إذا كان رقم الهاتف مستخدماً مسبقاً', async () => {
    await request(app).post('/api/auth/register').send(validData)
    const res = await request(app).post('/api/auth/register').send(validData)
    expect(res.status).toBe(409)
    expect(res.body.error).toContain('مستخدم مسبقاً')
  })

  it('عند تسجيل فلاح يُنشأ سجل Farmer تلقائياً', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...validData, role: 'farmer' })
    expect(res.status).toBe(201)
    // التحقق عبر جلب قائمة الفلاحين
    const farmers = await request(app).get('/api/farmers')
    expect(farmers.body.length).toBeGreaterThan(0)
    expect(farmers.body[0].name).toBe(validData.name)
  })

  it('يقبل الأدوار الثلاثة المتاحة: agent, buyer, farmer', async () => {
    for (const role of ['agent', 'buyer', 'farmer']) {
      const res = await request(app).post('/api/auth/register').send({
        ...validData,
        phone: `055${role.length}${Date.now().toString().slice(-4)}`,
        role,
      })
      expect(res.status).toBe(201)
    }
  })
})

// ─────────────────────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────────────────────
describe('POST /api/auth/login', () => {
  const userData = { name: 'مستخدم', phone: '0660000001', password: 'mypassword', wilaya: 'وهران', role: 'buyer' }

  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(userData)
  })

  it('يسجّل الدخول بنجاح ويرجع token', async () => {
    const res = await request(app).post('/api/auth/login').send({
      phone: userData.phone,
      password: userData.password,
    })
    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
    expect(res.body.user.role).toBe('buyer')
  })

  it('يرجع 404 إذا كان رقم الهاتف غير مسجل', async () => {
    const res = await request(app).post('/api/auth/login').send({ phone: '0999999999', password: 'any' })
    expect(res.status).toBe(404)
  })

  it('يرجع 401 إذا كانت كلمة المرور خاطئة', async () => {
    const res = await request(app).post('/api/auth/login').send({ phone: userData.phone, password: 'wrongpass' })
    expect(res.status).toBe(401)
  })

  it('يرجع 400 إذا كانت البيانات ناقصة', async () => {
    const res = await request(app).post('/api/auth/login').send({ phone: userData.phone })
    expect(res.status).toBe(400)
  })
})

// ─────────────────────────────────────────────────────────────
// POST /api/auth/reset-password
// ─────────────────────────────────────────────────────────────
describe('POST /api/auth/reset-password', () => {
  const userData = { name: 'مستخدم', phone: '0770000001', password: 'oldpassword', wilaya: 'قسنطينة', role: 'agent' }

  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(userData)
  })

  it('يغيّر كلمة المرور بنجاح ويمكن تسجيل الدخول بالجديدة', async () => {
    const res = await request(app).post('/api/auth/reset-password').send({
      phone: userData.phone,
      newPassword: 'newPassword456',
    })
    expect(res.status).toBe(200)

    // تسجيل دخول بالكلمة الجديدة
    const loginRes = await request(app).post('/api/auth/login').send({
      phone: userData.phone,
      password: 'newPassword456',
    })
    expect(loginRes.status).toBe(200)

    // كلمة المرور القديمة لا تعمل
    const oldLogin = await request(app).post('/api/auth/login').send({
      phone: userData.phone,
      password: userData.password,
    })
    expect(oldLogin.status).toBe(401)
  })

  it('يرجع 404 إذا كان رقم الهاتف غير موجود', async () => {
    const res = await request(app).post('/api/auth/reset-password').send({
      phone: '0888888888',
      newPassword: 'newpass123',
    })
    expect(res.status).toBe(404)
  })

  it('يرجع 400 إذا كانت كلمة المرور الجديدة قصيرة', async () => {
    const res = await request(app).post('/api/auth/reset-password').send({
      phone: userData.phone,
      newPassword: '123',
    })
    expect(res.status).toBe(400)
  })
})

// ─────────────────────────────────────────────────────────────
// GET /api/auth/me
// ─────────────────────────────────────────────────────────────
describe('GET /api/auth/me', () => {
  it('يرجع بيانات المستخدم المصادق', async () => {
    const regRes = await request(app).post('/api/auth/register').send({
      name: 'مستخدم', phone: '0880000001', password: 'pass1234', wilaya: 'سطيف', role: 'farmer',
    })
    const token = regRes.body.token
    const res = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body.phone).toBe('0880000001')
    expect(res.body.password).toBeUndefined()
  })

  it('يرجع 401 بدون token', async () => {
    const res = await request(app).get('/api/auth/me')
    expect(res.status).toBe(401)
  })

  it('يرجع 401 مع token منتهي الصلاحية أو خاطئ', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer invalidtoken')
    expect(res.status).toBe(401)
  })
})
