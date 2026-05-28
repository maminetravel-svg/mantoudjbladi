import { Router, Response } from 'express'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { Farmer } from '../models/Farmer'
import { User } from '../models/User'
import { Crop } from '../models/Crop'
import { Equipment } from '../models/Equipment'
import { Land } from '../models/Land'
import { ConnectionRequest } from '../models/ConnectionRequest'

const router = Router()

// ─── AGENT: قائمة الفلاحين ─────────────────────────────────────────────────

// GET /api/agent-management/farmers
router.get('/farmers', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userRole !== 'agent') return res.status(403).json({ error: 'وصول مرفوض' })
    const farmers = await Farmer.find({ agentId: req.userId })

    const result = await Promise.all(farmers.map(async (f) => {
      const fId = f.userId
        ? { $or: [{ farmerId: f.userId }, { farmerId: f._id.toString() }] }
        : { farmerId: f._id.toString() }
      const cropCount  = await Crop.countDocuments(fId)
      const equipCount = await Equipment.countDocuments(fId)
      const landCount  = await Land.countDocuments(fId)
      return {
        ...f.toObject(),
        id: f._id,
        productsCount: cropCount + equipCount + landCount,
      }
    }))

    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// PUT /api/agent-management/farmers/:farmerId/toggle
router.put('/farmers/:farmerId/toggle', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userRole !== 'agent') return res.status(403).json({ error: 'وصول مرفوض' })
    const farmer = await Farmer.findOne({ _id: req.params.farmerId, agentId: req.userId })
    if (!farmer) return res.status(404).json({ error: 'الفلاح غير موجود' })
    farmer.isActiveForAgent = !farmer.isActiveForAgent
    await farmer.save()
    res.json({ isActiveForAgent: farmer.isActiveForAgent })
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// PUT /api/agent-management/farmers/:farmerId
router.put('/farmers/:farmerId', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userRole !== 'agent') return res.status(403).json({ error: 'وصول مرفوض' })
    const { name, phone, wilaya, commune, specialization } = req.body
    if (name && name.length > 100)
      return res.status(400).json({ error: 'الاسم طويل جداً' })
    if (phone && (phone.length > 20 || !/^[0-9+\s\-]+$/.test(phone)))
      return res.status(400).json({ error: 'رقم هاتف غير صالح' })
    const farmer = await Farmer.findOneAndUpdate(
      { _id: req.params.farmerId, agentId: req.userId },
      { name, phone, wilaya, commune, specialization },
      { new: true }
    )
    if (!farmer) return res.status(404).json({ error: 'الفلاح غير موجود' })
    res.json(farmer)
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// DELETE /api/agent-management/farmers/:farmerId
router.delete('/farmers/:farmerId', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userRole !== 'agent') return res.status(403).json({ error: 'وصول مرفوض' })
    const farmer = await Farmer.findOneAndDelete({ _id: req.params.farmerId, agentId: req.userId })
    if (!farmer) return res.status(404).json({ error: 'الفلاح غير موجود' })
    res.json({ message: 'تم حذف الفلاح' })
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// GET /api/agent-management/farmers/:farmerId/profile  — ملف الفلاح الكامل
router.get('/farmers/:farmerId/profile', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userRole !== 'agent') return res.status(403).json({ error: 'وصول مرفوض' })
    const farmer = await Farmer.findOne({ _id: req.params.farmerId, agentId: req.userId })
    if (!farmer) return res.status(404).json({ error: 'الفلاح غير موجود' })

    const farmerIdQuery = farmer.userId
      ? { $or: [{ farmerId: farmer.userId }, { farmerId: farmer._id.toString() }] }
      : { farmerId: farmer._id.toString() }

    const crops     = await Crop.find(farmerIdQuery).select('-inspectionRequests -preOrders')
    const equipment = await Equipment.find(farmerIdQuery)
    const lands     = await Land.find(farmerIdQuery)

    res.json({ farmer: { ...farmer.toObject(), id: farmer._id }, crops, equipment, lands })
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// ─── CONNECTION REQUESTS ──────────────────────────────────────────────────────

// POST /api/agent-management/connect-request  — وسيط يرسل طلب ربط لفلاح مستقل
router.post('/connect-request', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userRole !== 'agent') return res.status(403).json({ error: 'وصول مرفوض' })
    const { farmerUserId } = req.body
    if (!farmerUserId) return res.status(400).json({ error: 'معرّف الفلاح مطلوب' })

    // Accept MB-ID (e.g. MB-26051) or MongoDB ObjectId
    const isMbId = farmerUserId.toString().startsWith('MB-')
    const farmerUser = isMbId
      ? await User.findOne({ mbId: farmerUserId, role: 'farmer' })
      : await User.findById(farmerUserId).catch(() => null)
    if (!farmerUser || farmerUser.role !== 'farmer')
      return res.status(404).json({ error: 'الفلاح غير موجود، تحقق من الرقم' })

    const resolvedFarmerId = farmerUser._id.toString()

    const agentUser = await User.findById(req.userId)
    if (!agentUser) return res.status(404).json({ error: 'الوسيط غير موجود' })

    const existingFarmer = await Farmer.findOne({ agentId: req.userId, userId: resolvedFarmerId })
    if (existingFarmer) return res.status(409).json({ error: 'الفلاح مرتبط بك مسبقاً' })

    const existingReq = await ConnectionRequest.findOne({ agentId: req.userId, farmerId: resolvedFarmerId, status: 'pending' })
    if (existingReq) return res.status(409).json({ error: 'طلب ربط معلق بالفعل' })

    const request = await ConnectionRequest.create({
      agentId: req.userId,
      agentName: agentUser.name,
      farmerId: resolvedFarmerId,
      farmerName: farmerUser.name,
    })

    res.status(201).json(request)
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// GET /api/agent-management/pending-connections  — فلاح يرى طلبات الربط الواردة
router.get('/pending-connections', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userRole !== 'farmer') return res.status(403).json({ error: 'وصول مرفوض' })
    const requests = await ConnectionRequest.find({ farmerId: req.userId, status: 'pending' }).sort({ createdAt: -1 })
    res.json(requests)
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// PUT /api/agent-management/connections/:requestId/accept
router.put('/connections/:requestId/accept', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userRole !== 'farmer') return res.status(403).json({ error: 'وصول مرفوض' })
    const request = await ConnectionRequest.findOne({ _id: req.params.requestId, farmerId: req.userId, status: 'pending' })
    if (!request) return res.status(404).json({ error: 'الطلب غير موجود' })

    request.status = 'accepted'
    await request.save()

    const farmerUser = await User.findById(req.userId)
    if (!farmerUser) return res.status(404).json({ error: 'المستخدم غير موجود' })

    const existingFarmer = await Farmer.findOne({ agentId: request.agentId, userId: req.userId })
    if (!existingFarmer) {
      await Farmer.create({
        name: farmerUser.name,
        phone: farmerUser.phone,
        wilaya: farmerUser.wilaya,
        agentId: request.agentId,
        userId: req.userId,
      })
    }

    res.json({ message: 'تم قبول طلب الربط' })
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// PUT /api/agent-management/connections/:requestId/reject
router.put('/connections/:requestId/reject', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userRole !== 'farmer') return res.status(403).json({ error: 'وصول مرفوض' })
    const request = await ConnectionRequest.findOne({ _id: req.params.requestId, farmerId: req.userId, status: 'pending' })
    if (!request) return res.status(404).json({ error: 'الطلب غير موجود' })
    request.status = 'rejected'
    await request.save()
    res.json({ message: 'تم رفض طلب الربط' })
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// DELETE /api/agent-management/disconnect/:farmerId  — قطع الاتصال
router.delete('/disconnect/:farmerId', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (req.userRole !== 'agent') return res.status(403).json({ error: 'وصول مرفوض' })
    const farmer = await Farmer.findOne({ _id: req.params.farmerId, agentId: req.userId })
    if (!farmer) return res.status(404).json({ error: 'الفلاح غير موجود' })
    await Farmer.findByIdAndDelete(farmer._id)
    res.json({ message: 'تم قطع الاتصال' })
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

export default router
