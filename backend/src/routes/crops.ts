import { Router, Request, Response } from 'express'
import { Crop } from '../models/Crop'
import { Farmer } from '../models/Farmer'
import { User } from '../models/User'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { Config } from '../models/Config'

const router = Router()

function formatCrop(c: any) {
  const obj = { ...c.toObject(), id: c._id }
  if (obj.preOrders) obj.preOrders = obj.preOrders.map((o: any) => ({ ...o, id: o._id }))
  if (obj.inspectionRequests) obj.inspectionRequests = obj.inspectionRequests.map((r: any) => ({ ...r, id: r._id }))
  return obj
}

// GET /api/crops/mine — محاصيل الوسيط/الفلاح الخاصة (بما فيها pending)
router.get('/mine', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const crops = await Crop.find({ agentId: req.userId }).sort({ createdAt: -1 })
    res.json(crops.map(formatCrop))
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// GET /api/crops
router.get('/', async (req: Request, res: Response) => {
  try {
    const filter: any = { status: { $nin: ['pending', 'rejected'] } }
    if (req.query.wilaya) filter.wilaya = req.query.wilaya
    if (req.query.type) filter.type = req.query.type
    if (req.query.stage) filter.stage = req.query.stage
    if (req.query.farmerId) filter.farmerId = req.query.farmerId

    // Exclude crops whose agent has deactivated the farmer
    const deactivatedFarmers = await Farmer.find({ isActiveForAgent: false })
    if (deactivatedFarmers.length > 0) {
      const norConditions: any[] = []
      for (const f of deactivatedFarmers) {
        norConditions.push({ farmerId: f._id.toString(), agentId: f.agentId })
        if (f.userId) norConditions.push({ farmerId: f.userId, agentId: f.agentId })
      }
      filter.$nor = norConditions
    }

    const crops = await Crop.find(filter).sort({ createdAt: -1 })

    // Attach agent phone where applicable
    const agentIds = [...new Set(crops.map(c => c.agentId).filter(Boolean))]
    const agents = await User.find({ _id: { $in: agentIds }, role: 'agent' }).select('_id phone name facebookUrl tiktokUrl')
    const agentMap: Record<string, { phone: string; name: string; facebookUrl?: string; tiktokUrl?: string }> = {}
    agents.forEach(a => { agentMap[a._id.toString()] = { phone: a.phone, name: a.name, facebookUrl: a.facebookUrl, tiktokUrl: a.tiktokUrl } })

    // Attach farmer phone for independent farmers (agentId === farmerId)
    const independentFarmerIds = crops
      .filter(c => c.agentId === c.farmerId)
      .map(c => c.farmerId)
      .filter(Boolean)
    const uniqueFarmerIds = [...new Set(independentFarmerIds)]
    const farmers = await User.find({ _id: { $in: uniqueFarmerIds } }).select('_id phone name')
    const farmerMap: Record<string, { phone: string; name: string }> = {}
    farmers.forEach(f => { farmerMap[f._id.toString()] = { phone: f.phone, name: f.name } })

    res.json(crops.map(c => {
      const obj: any = formatCrop(c)
      if (c.agentId && agentMap[c.agentId]) obj.agentInfo = agentMap[c.agentId]
      if (c.agentId === c.farmerId && farmerMap[c.farmerId]) obj.farmerInfo = farmerMap[c.farmerId]
      return obj
    }))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// GET /api/crops/my-crops — فلاح يرى كل محاصيله (بما فيها قيد الانتظار)
router.get('/my-crops', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userRole !== 'farmer' && req.userRole !== 'agent')
      return res.status(403).json({ error: 'وصول مرفوض' })

    const filter: any = {}
    if (req.userRole === 'farmer') filter.farmerId = req.userId
    else filter.agentId = req.userId

    const crops = await Crop.find(filter).sort({ createdAt: -1 })
    res.json(crops.map(formatCrop))
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// GET /api/crops/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const crop = await Crop.findById(req.params.id)
    if (!crop) return res.status(404).json({ error: 'المحصول غير موجود' })

    // Attach farmer info including userId for profile linking
    const farmer = await Farmer.findById(crop.farmerId)
    const agent = await User.findById(crop.agentId).select('facebookUrl tiktokUrl')
    const obj: any = formatCrop(crop)
    if (farmer) obj.farmerInfo = { ...farmer.toObject(), id: farmer._id }
    if (agent) {
      obj.agentFacebookUrl = agent.facebookUrl || ''
      obj.agentTiktokUrl = agent.tiktokUrl || ''
    }
    res.json(obj)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// POST /api/crops
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const {
      farmerId, type, plantingDate, expectedHarvestDate,
      estimatedQuantityKg, stage, images, videos, coverMediaType,
      gpsLat, gpsLng, wilaya, pricePerKg, description, marketTarget,
    } = req.body

    if (!farmerId || !type || !plantingDate || !estimatedQuantityKg || !wilaya)
      return res.status(400).json({ error: 'البيانات الأساسية مطلوبة' })

    const autoApproveConfig = await Config.findOne({ configType: 'autoApprove' })
    const autoApproveItem = autoApproveConfig?.items?.find((i: any) => i.key === 'crops')
    const status = autoApproveItem?.isActive !== false ? 'approved' : 'pending'

    const crop = await Crop.create({
      farmerId, agentId: req.userId,
      type, plantingDate, expectedHarvestDate,
      estimatedQuantityKg: Number(estimatedQuantityKg),
      stage: stage ?? 'seeds',
      images: images ?? [],
      videos: videos ?? [],
      coverMediaType: coverMediaType ?? 'image',
      gpsLat: gpsLat ?? 0, gpsLng: gpsLng ?? 0,
      wilaya,
      pricePerKg: pricePerKg ? Number(pricePerKg) : undefined,
      description, marketTarget,
      status,
    })
    res.status(201).json({ ...crop.toObject(), id: crop._id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// PUT /api/crops/:id
router.put('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const crop = await Crop.findById(req.params.id)
    if (!crop) return res.status(404).json({ error: 'المحصول غير موجود' })
    if (crop.agentId !== req.userId && !req.isAdmin)
      return res.status(403).json({ error: 'غير مسموح' })

    const {
      stage, images, videos, coverMediaType, description, pricePerKg,
      estimatedQuantityKg, wilaya, marketTarget, plantingDate, expectedHarvestDate,
      gpsLat, gpsLng,
    } = req.body

    if (stage !== undefined) crop.stage = stage
    if (images !== undefined) crop.images = images
    if (videos !== undefined) crop.videos = videos
    if (coverMediaType !== undefined) crop.coverMediaType = coverMediaType
    if (description !== undefined) crop.description = description
    if (pricePerKg !== undefined) crop.pricePerKg = Number(pricePerKg)
    if (estimatedQuantityKg !== undefined) crop.estimatedQuantityKg = Number(estimatedQuantityKg)

    // Admin-only fields
    if (req.isAdmin) {
      if (wilaya !== undefined) crop.wilaya = wilaya
      if (marketTarget !== undefined) crop.marketTarget = marketTarget
      if (plantingDate !== undefined) crop.plantingDate = plantingDate
      if (expectedHarvestDate !== undefined) crop.expectedHarvestDate = expectedHarvestDate
      if (gpsLat !== undefined) crop.gpsLat = Number(gpsLat)
      if (gpsLng !== undefined) crop.gpsLng = Number(gpsLng)
    }

    await crop.save()
    res.json({ ...crop.toObject(), id: crop._id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// POST /api/crops/:id/inspection
router.post('/:id/inspection', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const crop = await Crop.findById(req.params.id)
    if (!crop) return res.status(404).json({ error: 'المحصول غير موجود' })

    const user = await User.findById(req.userId)
    const { buyerName, buyerPhone } = req.body
    crop.inspectionRequests.push({
      buyerId: req.userId,
      buyerName: buyerName || user?.name || 'مشتري',
      buyerPhone: buyerPhone || user?.phone,
    } as any)
    await crop.save({ validateBeforeSave: false })
    res.status(201).json({ message: 'تم إرسال طلب المعاينة' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// POST /api/crops/:id/preorder
router.post('/:id/preorder', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { quantityKg, pricePerKg } = req.body
    if (!quantityKg || !pricePerKg)
      return res.status(400).json({ error: 'الكمية والسعر مطلوبان' })

    const crop = await Crop.findById(req.params.id)
    if (!crop) return res.status(404).json({ error: 'المحصول غير موجود' })

    const user = await User.findById(req.userId)
    crop.preOrders.push({
      buyerId: req.userId,
      buyerName: user?.name || 'مشتري',
      buyerPhone: user?.phone,
      quantityKg: Number(quantityKg),
      pricePerKg: Number(pricePerKg),
    } as any)
    await crop.save({ validateBeforeSave: false })
    res.status(201).json({ message: 'تم إرسال الطلب المسبق' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// PUT /api/crops/:id/inspection/:inspectionId
router.put('/:id/inspection/:inspectionId', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body
    const allowed = ['pending', 'approved', 'completed', 'rejected']
    if (!allowed.includes(status))
      return res.status(400).json({ error: 'حالة غير صالحة' })

    const crop = await Crop.findById(req.params.id)
    if (!crop) return res.status(404).json({ error: 'المحصول غير موجود' })

    const farmer = await Farmer.findById(crop.farmerId)
    const isOwner =
      crop.agentId?.toString() === req.userId ||
      crop.farmerId?.toString() === req.userId ||
      farmer?.agentId?.toString() === req.userId ||
      farmer?.userId?.toString() === req.userId

    if (!isOwner && !req.isAdmin)
      return res.status(403).json({ error: 'غير مسموح' })

    const inspection = crop.inspectionRequests.find(r => r._id.toString() === req.params.inspectionId)
    if (!inspection) return res.status(404).json({ error: 'الطلب غير موجود' })

    inspection.status = status
    await crop.save({ validateBeforeSave: false })
    res.json({ message: 'تم تحديث الحالة', status })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// PUT /api/crops/:id/preorder/:preorderId
router.put('/:id/preorder/:preorderId', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body
    const allowed = ['pending', 'accepted', 'rejected', 'completed']
    if (!allowed.includes(status))
      return res.status(400).json({ error: 'حالة غير صالحة' })

    const crop = await Crop.findById(req.params.id)
    if (!crop) return res.status(404).json({ error: 'المحصول غير موجود' })

    const farmer = await Farmer.findById(crop.farmerId)
    const isOwner =
      crop.agentId?.toString() === req.userId ||
      crop.farmerId?.toString() === req.userId ||
      farmer?.agentId?.toString() === req.userId ||
      farmer?.userId?.toString() === req.userId

    if (!isOwner && !req.isAdmin)
      return res.status(403).json({ error: 'غير مسموح' })

    const order = crop.preOrders.find(o => o._id.toString() === req.params.preorderId)
    if (!order) return res.status(404).json({ error: 'الطلب غير موجود' })

    order.status = status
    await crop.save()
    res.json({ message: 'تم تحديث الحالة', status })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// DELETE /api/crops/:id/inspection/:inspectionId — المشتري يلغي طلب معاينته (pending فقط)
router.delete('/:id/inspection/:inspectionId', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const crop = await Crop.findById(req.params.id)
    if (!crop) return res.status(404).json({ error: 'المحصول غير موجود' })

    const idx = crop.inspectionRequests.findIndex(r => r._id.toString() === req.params.inspectionId)
    if (idx === -1) return res.status(404).json({ error: 'الطلب غير موجود' })

    const inspection = crop.inspectionRequests[idx]
    if (inspection.buyerId?.toString() !== req.userId)
      return res.status(403).json({ error: 'غير مسموح' })
    if (inspection.status !== 'pending')
      return res.status(400).json({ error: 'لا يمكن حذف طلب مؤكد' })

    crop.inspectionRequests.splice(idx, 1)
    await crop.save({ validateBeforeSave: false })
    res.json({ message: 'تم إلغاء طلب المعاينة' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// DELETE /api/crops/:id/preorder/:preorderId — المشتري يلغي حجزه (pending فقط)
router.delete('/:id/preorder/:preorderId', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const crop = await Crop.findById(req.params.id)
    if (!crop) return res.status(404).json({ error: 'المحصول غير موجود' })

    const idx = crop.preOrders.findIndex(o => o._id.toString() === req.params.preorderId)
    if (idx === -1) return res.status(404).json({ error: 'الطلب غير موجود' })

    const order = crop.preOrders[idx]
    if (order.buyerId?.toString() !== req.userId)
      return res.status(403).json({ error: 'غير مسموح' })
    if (order.status !== 'pending')
      return res.status(400).json({ error: 'لا يمكن حذف طلب مؤكد' })

    crop.preOrders.splice(idx, 1)
    await crop.save()
    res.json({ message: 'تم إلغاء الحجز' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

export default router
