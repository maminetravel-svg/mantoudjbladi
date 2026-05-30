import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import compression from 'compression'
import dotenv from 'dotenv'
import path from 'path'
import { connectDB } from './lib/db'

import authRoutes from './routes/auth'
import usersRoutes from './routes/users'
import farmersRoutes from './routes/farmers'
import cropsRoutes from './routes/crops'
import equipmentRoutes from './routes/equipment'
import landsRoutes from './routes/lands'
import uploadsRoutes from './routes/uploads'
import adminRoutes from './routes/admin'
import agentManagementRoutes from './routes/agentManagement'
import aiRoutes from './routes/ai'
import knowledgeRoutes from './routes/knowledge'
import googleAuthRoutes from './routes/googleAuth'
import { authLimiter, otpLimiter, apiLimiter, uploadLimiter } from './middleware/rateLimiter'
import { Config } from './models/Config'
import { Crop } from './models/Crop'
import { Equipment } from './models/Equipment'
import { Land } from './models/Land'
import { Farmer } from './models/Farmer'

dotenv.config({ path: path.join(__dirname, '..', '.env') })
connectDB()

const app = express()
const PORT = process.env.PORT || 3001

// Security & performance middleware
app.set('etag', false)
app.use(compression())
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(mongoSanitize())
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  next()
})

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL || 'https://mantoudj.rflydz.com',
  'https://mantoudjfellahbladi.com',
  'https://www.mantoudjfellahbladi.com',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost',
  'https://localhost',
  'capacitor://localhost',
]
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true)
    else callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files statically and force them through the /api route so Nginx proxies it automatically
app.use('/api/static', express.static(path.join(__dirname, '..', 'uploads')))
// Keep old route for backwards compatibility
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

// Routes
app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/auth/forgot-password', otpLimiter)
app.use('/api/users', apiLimiter, usersRoutes)
app.use('/api/farmers', apiLimiter, farmersRoutes)
app.use('/api/crops', apiLimiter, cropsRoutes)
app.use('/api/equipment', apiLimiter, equipmentRoutes)
app.use('/api/lands', apiLimiter, landsRoutes)
app.use('/api/uploads', uploadLimiter, uploadsRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/agent-management', apiLimiter, agentManagementRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/knowledge', apiLimiter, knowledgeRoutes)
app.use('/api/auth', authLimiter, googleAuthRoutes)

// Public config endpoint — no auth required
app.get('/api/config/:type', async (req, res) => {
  try {
    let doc = await Config.findOne({ configType: req.params.type })
    if (!doc && req.params.type === 'landing') {
      doc = await Config.create({
        configType: 'landing',
        items: [
          { key: 'heroTitle', labelAr: 'منصة منتوج بلادي الرقمية', emoji: '🌱', isActive: true, order: 0 },
          { key: 'heroSubtitle', labelAr: 'التسويق يبدأ من يوم البذور. منصتكم الموثوقة لتسويق وتصفح المحاصيل الفلاحية والمعدات والأراضي الفلاحية في الجزائر.', emoji: '🚜', isActive: true, order: 1 },
          { key: 'apkUrl', labelAr: '/apk/mantoudj-bladi.apk', emoji: '📱', isActive: true, order: 2 },
          { key: 'showStats', labelAr: 'إظهار إحصائيات المنصة', emoji: '📊', isActive: true, order: 3 },
          { key: 'contactPhone', labelAr: '0555000000', emoji: '📞', isActive: true, order: 4 },
        ]
      })
    }
    res.json(doc ? doc.items : [])
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

// Public stats endpoint
app.get('/api/public-stats', async (req, res) => {
  try {
    const [crops, equipment, lands, farmers] = await Promise.all([
      Crop.countDocuments({ status: 'approved' }),
      Equipment.countDocuments({ status: 'approved' }),
      Land.countDocuments({ status: 'approved' }),
      Farmer.countDocuments(),
    ])
    // Get unique wilayas
    const uniqueWilayas = await Crop.distinct('wilaya', { status: 'approved' })
    const wilayasCount = uniqueWilayas.length || 48
    res.json({ crops, equipment, lands, farmers, wilayas: wilayasCount })
  } catch (err) {
    console.error('Error fetching public stats:', err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// Health check
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 404 handler
app.use((_, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`🌱 Mantoudj Bladi API running on port ${PORT}`)
})

export default app
