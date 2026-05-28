import express from 'express'
import cors from 'cors'
import compression from 'compression'
import path from 'path'
import { Config } from './models/Config'

import authRoutes from './routes/auth'
import usersRoutes from './routes/users'
import farmersRoutes from './routes/farmers'
import cropsRoutes from './routes/crops'
import equipmentRoutes from './routes/equipment'
import landsRoutes from './routes/lands'
import adminRoutes from './routes/admin'
import agentManagementRoutes from './routes/agentManagement'

const app = express()

app.set('etag', false)
app.use(compression())
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  next()
})

const allowedOrigins = [
  'https://mantoudj.rflydz.com',
  'https://mantoudjfellahbladi.com',
  'https://www.mantoudjfellahbladi.com',
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost',
  'https://localhost',
  'capacitor://localhost',
].filter(Boolean) as string[]
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true)
    else callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/farmers', farmersRoutes)
app.use('/api/crops', cropsRoutes)
app.use('/api/equipment', equipmentRoutes)
app.use('/api/lands', landsRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/agent-management', agentManagementRoutes)

// Public config endpoint — no auth required
app.get('/api/config/:type', async (req, res) => {
  try {
    const doc = await Config.findOne({ configType: req.params.type })
    res.json(doc ? doc.items : [])
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

app.get('/api/health', (_, res) => res.json({ status: 'ok' }))
app.use((_, res) => res.status(404).json({ error: 'Route not found' }))

export default app
