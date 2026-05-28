import { Router, Request, Response } from 'express'
import { Farmer } from '../models/Farmer'
import { User } from '../models/User'
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth'

const router = Router()

// GET /api/farmers
router.get('/', async (req: Request, res: Response) => {
  try {
    const filter: any = {}
    if (req.query.wilaya) filter.wilaya = req.query.wilaya
    const farmers = await Farmer.find(filter).sort({ createdAt: -1 })
    res.json(farmers.map(f => ({ ...f.toObject(), id: f._id })))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// GET /api/farmers/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const farmer = await Farmer.findById(req.params.id)
    if (!farmer) return res.status(404).json({ error: 'الفلاح غير موجود' })
    res.json({ ...farmer.toObject(), id: farmer._id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// POST /api/farmers
router.post('/', requireAuth, requireRole('agent', 'farmer'), async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, wilaya, commune, gpsLat, gpsLng, specialization } = req.body
    if (!name || !phone || !wilaya)
      return res.status(400).json({ error: 'الاسم والهاتف والولاية مطلوبة' })

    const farmer = await Farmer.create({
      name, phone, wilaya, commune,
      gpsLat: gpsLat ?? 0,
      gpsLng: gpsLng ?? 0,
      specialization,
      agentId: req.userId!,
    })
    res.status(201).json({ ...farmer.toObject(), id: farmer._id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// POST /api/farmers/:id/reviews — buyers, agents, and farmers can review
router.post('/:id/reviews', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { rating, comment } = req.body
    if (!rating || !comment?.trim())
      return res.status(400).json({ error: 'التقييم والتعليق مطلوبان' })
    if (rating < 1 || rating > 5)
      return res.status(400).json({ error: 'التقييم يجب أن يكون بين 1 و 5' })

    const farmer = await Farmer.findById(req.params.id)
    if (!farmer) return res.status(404).json({ error: 'الفلاح غير موجود' })

    const alreadyReviewed = farmer.reviews.some(r => r.buyerId === req.userId)
    if (alreadyReviewed) return res.status(409).json({ error: 'لقد قدّمت تقييماً من قبل' })

    const user = await User.findById(req.userId)
    farmer.reviews.push({
      buyerId: req.userId!,
      buyerName: user?.name || 'مشتري',
      rating: Number(rating),
      comment: comment.trim(),
    } as any)
    await farmer.save()

    res.status(201).json({ message: 'تم إرسال التقييم' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

export default router
