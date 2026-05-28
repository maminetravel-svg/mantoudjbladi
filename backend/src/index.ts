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

dotenv.config({ path: path.join(__dirname, '..', '.env') })
connectDB()

const app = express()
const PORT = process.env.PORT || 3001

// Security & performance middleware
app.use(compression())
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(mongoSanitize())

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL || 'https://mantoudj.rflydz.com',
  'https://mantoudjfellahbladi.com',
  'https://www.mantoudjfellahbladi.com',
  'http://localhost:3000',
  'http://localhost:5173',
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
    const doc = await Config.findOne({ configType: req.params.type })
    res.json(doc ? doc.items : [])
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
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
