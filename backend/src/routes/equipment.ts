import { Router, Request, Response } from 'express'
import { Equipment } from '../models/Equipment'
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth'
import { Config } from '../models/Config'
import { User } from '../models/User'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const filter: any = { status: { $nin: ['pending', 'rejected'] } }
    if (req.query.wilaya)   filter.wilaya = req.query.wilaya
    if (req.query.category) filter.category = req.query.category
    const equipment = await Equipment.find(filter).sort({ createdAt: -1 })

    // Attach owner names
    const agentIds = [...new Set(equipment.map(e => e.agentId))]
    const owners = await User.find({ _id: { $in: agentIds } }).select('name')
    const ownerMap: Record<string, string> = {}
    owners.forEach(u => { ownerMap[u._id.toString()] = u.name })

    res.json(equipment.map(e => ({ ...e.toObject(), id: e._id, ownerName: ownerMap[e.agentId] || '' })))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const eq = await Equipment.findById(req.params.id)
    if (!eq) return res.status(404).json({ error: 'المعدة غير موجودة' })
    const owner = await User.findById(eq.agentId).select('name').catch(() => null)
    res.json({ ...eq.toObject(), id: eq._id, ownerName: owner?.name || '' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { name, category, description, pricePerDay, wilaya, phone, images, videos, coverMediaType } = req.body
    if (!name || !category || !wilaya || !phone)
      return res.status(400).json({ error: 'الاسم والفئة والولاية والهاتف مطلوبة' })

    const autoApproveConfig = await Config.findOne({ configType: 'autoApprove' })
    const autoApproveItem = autoApproveConfig?.items?.find((i: any) => i.key === 'equipment')
    const status = (autoApproveItem as any)?.isActive !== false ? 'approved' : 'pending'

    const eq = await Equipment.create({
      name, category, description,
      pricePerDay: pricePerDay ? Number(pricePerDay) : undefined,
      wilaya, phone,
      images: images ?? [],
      videos: videos ?? [],
      coverMediaType: coverMediaType || 'image',
      gpsLat: req.body.gpsLat ? Number(req.body.gpsLat) : undefined,
      gpsLng: req.body.gpsLng ? Number(req.body.gpsLng) : undefined,
      agentId: req.userId!,
      status,
    })
    res.status(201).json({ ...eq.toObject(), id: eq._id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

router.put('/:id/images', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const eq = await Equipment.findById(req.params.id)
    if (!eq) return res.status(404).json({ error: 'المعدة غير موجودة' })
    if (eq.agentId !== req.userId) return res.status(403).json({ error: 'غير مسموح' })

    eq.images = req.body.images ?? []
    await eq.save()
    res.json({ ...eq.toObject(), id: eq._id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const eq = await Equipment.findById(req.params.id)
    if (!eq) return res.status(404).json({ error: 'المعدة غير موجودة' })
    if (eq.agentId !== req.userId) return res.status(403).json({ error: 'غير مسموح' })
    await eq.deleteOne()
    res.json({ message: 'تم حذف المعدة' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

router.put('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const eq = await Equipment.findById(req.params.id)
    if (!eq) return res.status(404).json({ error: 'المعدة غير موجودة' })
    if (eq.agentId !== req.userId && !req.isAdmin) {
      return res.status(403).json({ error: 'غير مسموح لك بتعديل هذا الإعلان' })
    }

    const { name, category, description, pricePerDay, wilaya, phone, images, videos, coverMediaType } = req.body
    if (name) eq.name = name
    if (category) eq.category = category
    if (description !== undefined) eq.description = description
    if (pricePerDay !== undefined) eq.pricePerDay = pricePerDay ? Number(pricePerDay) : undefined
    if (wilaya) eq.wilaya = wilaya
    if (phone) eq.phone = phone
    if (images) eq.images = images
    if (videos) eq.videos = videos
    if (coverMediaType) eq.coverMediaType = coverMediaType

    await eq.save()
    res.json({ ...eq.toObject(), id: eq._id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

export default router
