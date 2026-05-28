import { Router, Response } from 'express'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { requireAdmin } from '../middleware/auth'
import { LocalKnowledge } from '../models/LocalKnowledge'
import { User } from '../models/User'

const router = Router()

// POST /api/knowledge — المستخدم يحفظ معلومة
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { topic, content } = req.body
    if (!topic?.trim() || !content?.trim())
      return res.status(400).json({ error: 'الموضوع والمحتوى مطلوبان' })
    if (content.length > 1000)
      return res.status(400).json({ error: 'المحتوى طويل جداً' })

    const user = await User.findById(req.userId).select('wilaya name').lean()
    const entry = await LocalKnowledge.create({
      topic: topic.trim(),
      content: content.trim(),
      wilaya: (user as any)?.wilaya,
      userId: req.userId,
      userName: (user as any)?.name,
      verified: true, // المعلومات المحفوظة يدوياً من قِبَل المستخدم تُفعَّل فوراً
    })
    res.status(201).json(entry)
  } catch {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// GET /api/knowledge/search — البحث (تستخدمه الـ AI)
router.get('/search', async (req, res) => {
  try {
    const { q, wilaya } = req.query
    if (!q) return res.json([])
    if ((q as string).length > 200) return res.json([])

    const filter: any = { verified: true }
    if (wilaya) filter.$or = [{ wilaya }, { wilaya: { $exists: false } }, { wilaya: '' }]

    const byText = await LocalKnowledge.find(
      { ...filter, $text: { $search: q as string } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } }).limit(5).lean()

    res.json(byText)
  } catch {
    res.json([])
  }
})

// GET /api/knowledge — لوحة الأدمين: كل المعلومات
router.get('/', requireAuth, requireAdmin as any, async (_req, res: Response) => {
  try {
    const entries = await LocalKnowledge.find().sort({ createdAt: -1 }).limit(100).lean()
    res.json(entries)
  } catch {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// PUT /api/knowledge/:id/verify — الأدمين يوثّق المعلومة
router.put('/:id/verify', requireAuth, requireAdmin as any, async (req, res: Response) => {
  try {
    const entry = await LocalKnowledge.findByIdAndUpdate(req.params.id, { verified: true }, { new: true })
    res.json(entry)
  } catch {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// DELETE /api/knowledge/:id — الأدمين يحذف
router.delete('/:id', requireAuth, requireAdmin as any, async (req, res: Response) => {
  try {
    await LocalKnowledge.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

export default router
