import { Router, Request, Response } from 'express'
import { Land } from '../models/Land'
import { requireAuth, requireRole, AuthRequest } from '../middleware/auth'
import { Config } from '../models/Config'
import { User } from '../models/User'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const filter: any = { status: { $nin: ['pending', 'rejected'] } }
    if (req.query.wilaya) filter.wilaya = req.query.wilaya
    if (req.query.goal)   filter.goal = req.query.goal
    const lands = await Land.find(filter).sort({ createdAt: -1 })

    // Attach owner names
    const agentIds = [...new Set(lands.map(l => l.agentId))]
    const owners = await User.find({ _id: { $in: agentIds } }).select('name')
    const ownerMap: Record<string, string> = {}
    owners.forEach(u => { ownerMap[u._id.toString()] = u.name })

    res.json(lands.map(l => ({ ...l.toObject(), id: l._id, ownerName: ownerMap[l.agentId] || '' })))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const land = await Land.findById(req.params.id)
    if (!land) return res.status(404).json({ error: 'الأرض غير موجودة' })
    const owner = await User.findById(land.agentId).select('name').catch(() => null)
    res.json({ ...land.toObject(), id: land._id, ownerName: owner?.name || '' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { area, wilaya, commune, gpsLat, gpsLng, goal, priceType, price, description, documents, features, images, videos, coverMediaType, phone } = req.body
    if (!area || !wilaya || !goal || !priceType)
      return res.status(400).json({ error: 'المساحة والولاية والهدف ونوع السعر مطلوبة' })

    const autoApproveConfig = await Config.findOne({ configType: 'autoApprove' })
    const autoApproveItem = autoApproveConfig?.items?.find((i: any) => i.key === 'lands')
    const status = (autoApproveItem as any)?.isActive !== false ? 'approved' : 'pending'

    const land = await Land.create({
      area: Number(area), wilaya, commune,
      gpsLat: gpsLat ?? 0, gpsLng: gpsLng ?? 0,
      goal, priceType,
      price: price ? Number(price) : undefined,
      description,
      documents: documents ?? [],
      features: features ?? [],
      images: images ?? [],
      videos: videos ?? [],
      coverMediaType: coverMediaType || 'image',
      phone: phone || undefined,
      agentId: req.userId!,
      status,
    })
    res.status(201).json({ ...land.toObject(), id: land._id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const land = await Land.findById(req.params.id)
    if (!land) return res.status(404).json({ error: 'الأرض غير موجودة' })
    if ((land as any).agentId !== req.userId) return res.status(403).json({ error: 'غير مسموح' })
    await land.deleteOne()
    res.json({ message: 'تم حذف الأرض' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

router.put('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const land = await Land.findById(req.params.id)
    if (!land) return res.status(404).json({ error: 'الأرض غير موجودة' })
    if ((land as any).agentId !== req.userId && !req.isAdmin) {
      return res.status(403).json({ error: 'غير مسموح لك بتعديل هذا الإعلان' })
    }

    const { area, wilaya, commune, gpsLat, gpsLng, goal, priceType, price, description, documents, features, images, videos, coverMediaType, phone } = req.body

    if (area) land.area = Number(area)
    if (wilaya) land.wilaya = wilaya
    if (commune !== undefined) land.commune = commune
    if (gpsLat !== undefined) land.gpsLat = gpsLat
    if (gpsLng !== undefined) land.gpsLng = gpsLng
    if (goal) land.goal = goal
    if (priceType) land.priceType = priceType
    if (price !== undefined) land.price = price ? Number(price) : undefined
    if (description !== undefined) land.description = description
    if (documents) land.documents = documents
    if (features) land.features = features
    if (images) land.images = images
    if (videos) land.videos = videos
    if (coverMediaType) land.coverMediaType = coverMediaType
    if (phone !== undefined) land.phone = phone || undefined

    await land.save()
    res.json({ ...land.toObject(), id: land._id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

export default router
