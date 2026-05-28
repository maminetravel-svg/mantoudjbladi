import { Router, Request, Response } from 'express'
import { User } from '../models/User'
import { Farmer } from '../models/Farmer'
import { Crop } from '../models/Crop'
import { Equipment } from '../models/Equipment'
import { Land } from '../models/Land'
import { requireAuth, AuthRequest } from '../middleware/auth'

const router = Router()

// GET /api/users/:id — works with User ID or Farmer record ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    // Try finding as a User first
    let user = await User.findById(req.params.id).select('-password -__v').catch(() => null)

    if (!user) {
      // Maybe it's a Farmer record ID — build a virtual profile from Farmer data
      const farmer = await Farmer.findById(req.params.id).catch(() => null)
      if (!farmer) return res.status(404).json({ error: 'المستخدم غير موجود' })

      const crops = await Crop.find({ farmerId: farmer._id.toString() })
        .select('-inspectionRequests -preOrders').sort({ createdAt: -1 })

      return res.json({
        id: farmer._id,
        _id: farmer._id,
        name: farmer.name,
        role: 'farmer',
        wilaya: farmer.wilaya,
        commune: farmer.commune,
        trustScore: farmer.trustScore,
        dealsCount: farmer.dealsCompleted,
        reviews: farmer.reviews || [],
        crops,
        isFarmerRecord: true,   // flag so frontend knows to post to /api/farmers/:id/reviews
        farmerRecordId: farmer._id,
      })
    }

    const obj: any = { ...user.toObject(), id: user._id }

    if (user.role === 'farmer') {
      const farmerRecord = await Farmer.findOne({ userId: user._id.toString() })
      if (farmerRecord) {
        obj.farmerRecordId = farmerRecord._id
        obj.isFarmerRecord = false
        obj.crops = await Crop.find({ farmerId: farmerRecord._id.toString(), status: { $nin: ['pending', 'rejected'] } })
          .select('-inspectionRequests -preOrders').sort({ createdAt: -1 })
        if (farmerRecord.reviews?.length) {
          const mapped = farmerRecord.reviews.map((r: any) => ({
            _id: r._id,
            reviewerId: r.buyerId,
            reviewerName: r.buyerName,
            reviewerRole: 'buyer',
            rating: r.rating,
            comment: r.comment,
            createdAt: r.createdAt,
          }))
          obj.reviews = [...(obj.reviews || []), ...mapped]
        }
      }
    }

    // Equipment and lands for all roles
    const [equipmentList, landsList] = await Promise.all([
      Equipment.find({ agentId: user._id.toString(), status: { $nin: ['pending', 'rejected'] } }).sort({ createdAt: -1 }),
      Land.find({ agentId: user._id.toString(), status: { $nin: ['pending', 'rejected'] } }).sort({ createdAt: -1 }),
    ])
    obj.equipment = equipmentList
    obj.lands = landsList

    delete obj.phone
    res.json(obj)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// POST /api/users/:id/reviews — review a buyer (farmers and agents only)
router.post('/:id/reviews', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { rating, comment } = req.body
    if (!rating || !comment?.trim())
      return res.status(400).json({ error: 'التقييم والتعليق مطلوبان' })
    if (rating < 1 || rating > 5)
      return res.status(400).json({ error: 'التقييم يجب أن يكون بين 1 و 5' })
    if (comment.trim().length > 500)
      return res.status(400).json({ error: 'التعليق لا يتجاوز 500 حرف' })

    const targetUser = await User.findById(req.params.id)
    if (!targetUser) return res.status(404).json({ error: 'المستخدم غير موجود' })

    const alreadyReviewed = targetUser.reviews.some(r => r.reviewerId === req.userId)
    if (alreadyReviewed) return res.status(409).json({ error: 'لقد قدّمت تقييماً من قبل' })

    const reviewer = await User.findById(req.userId)
    targetUser.reviews.push({
      reviewerId:   req.userId!,
      reviewerName: reviewer?.name || 'مستخدم',
      reviewerRole: reviewer?.role || 'agent',
      rating:       Number(rating),
      comment:      comment.trim(),
    } as any)
    await targetUser.save()
    res.status(201).json({ message: 'تم إرسال التقييم' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// PUT /api/users/me
router.put('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { name, firstName, lastName, phone, wilaya, commune, gpsLat, gpsLng, facebookUrl, tiktokUrl } = req.body

    if (name && name.length > 100)
      return res.status(400).json({ error: 'الاسم طويل جداً' })
    if (phone && (phone.length > 20 || !/^[0-9+\s\-]+$/.test(phone)))
      return res.status(400).json({ error: 'رقم هاتف غير صالح' })
    if (facebookUrl && facebookUrl.length > 200)
      return res.status(400).json({ error: 'رابط فيسبوك طويل جداً' })
    if (tiktokUrl && tiktokUrl.length > 200)
      return res.status(400).json({ error: 'رابط تيكتوك طويل جداً' })

    if (phone) {
      const existing = await User.findOne({ phone, _id: { $ne: req.userId } })
      if (existing) return res.status(409).json({ error: 'رقم الهاتف مستخدم مسبقاً' })
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { name, firstName, lastName, phone, wilaya, commune, gpsLat, gpsLng, facebookUrl, tiktokUrl } },
      { new: true, runValidators: true }
    ).select('-password -__v')

    if (!user) return res.status(404).json({ error: 'المستخدم غير موجود' })
    res.json({ ...user.toObject(), id: user._id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

export default router
