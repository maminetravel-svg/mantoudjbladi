import { Router, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { requireAdmin, requireSuperAdmin, AuthRequest } from '../middleware/auth'
import { User } from '../models/User'
import { generateMbId } from '../utils/mbId'
import { Farmer } from '../models/Farmer'
import { Crop } from '../models/Crop'
import { Equipment } from '../models/Equipment'
import { Land } from '../models/Land'
import { Config } from '../models/Config'

const router = Router()

// All admin routes require admin token
router.use(requireAdmin)

// ─── Stats ────────────────────────────────────────────────────────────────────
router.get('/stats', async (_req: AuthRequest, res: Response) => {
  try {
    const [users, farmers, crops, equipment, lands] = await Promise.all([
      User.countDocuments(),
      Farmer.countDocuments(),
      Crop.countDocuments(),
      Equipment.countDocuments(),
      Land.countDocuments(),
    ])

    const byRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ])

    const byStage = await Crop.aggregate([
      { $group: { _id: '$stage', count: { $sum: 1 } } },
    ])

    const blocked = await User.countDocuments({ isBlocked: true })
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('-password -__v')
    const recentCrops = await Crop.find().sort({ createdAt: -1 }).limit(5)

    res.json({ users, farmers, crops, equipment, lands, blocked, byRole, byStage, recentUsers, recentCrops })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// ─── Users ─────────────────────────────────────────────────────────────────────
router.get('/users', async (req: AuthRequest, res: Response) => {
  try {
    const { search, role, blocked, page = '1', limit = '20' } = req.query
    const filter: any = {}
    if (role) filter.role = role
    if (blocked === 'true') filter.isBlocked = true
    if (blocked === 'false') filter.isBlocked = false
    if (search) {
      const escaped = (search as string).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      filter.$or = [
        { name: { $regex: escaped, $options: 'i' } },
        { phone: { $regex: escaped, $options: 'i' } },
        { wilaya: { $regex: escaped, $options: 'i' } },
      ]
    }

    const pageNum = Math.max(1, parseInt(page as string))
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string)))
    const skip = (pageNum - 1) * limitNum
    const [docs, total] = await Promise.all([
      User.find(filter).select('-password -__v').sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(filter),
    ])
    res.json({ users: docs.map(u => ({ ...u.toObject(), id: u._id })), total, page: pageNum })
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

router.put('/users/:id/block', async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ error: 'المستخدم غير موجود' })
    if ((user as any).isAdmin) return res.status(403).json({ error: 'لا يمكن حظر مشرف' })
    ;(user as any).isBlocked = !(user as any).isBlocked
    await user.save()
    res.json({ isBlocked: (user as any).isBlocked })
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

router.put('/users/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, wilaya, role } = req.body
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ error: 'المستخدم غير موجود' })
    if ((user as any).isAdmin) return res.status(403).json({ error: 'لا يمكن تعديل مشرف' })
    if (name) user.name = name
    if (phone) user.phone = phone
    if (wilaya) user.wilaya = wilaya
    if (role && ['farmer', 'agent', 'buyer'].includes(role)) user.role = role
    await user.save()
    const { password: _, resetToken: __, resetTokenExpiry: ___, __v, ...rest } = user.toObject()
    res.json({ user: rest })
  } catch (err: any) {
    if (err.code === 11000) return res.status(400).json({ error: 'رقم الهاتف مستخدم مسبقاً' })
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

router.delete('/users/:id', async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ error: 'المستخدم غير موجود' })
    if ((user as any).isAdmin) return res.status(403).json({ error: 'لا يمكن حذف مشرف' })
    await user.deleteOne()
    res.json({ message: 'تم حذف المستخدم' })
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// ─── Crops ─────────────────────────────────────────────────────────────────────
router.get('/crops', async (req: AuthRequest, res: Response) => {
  try {
    const { search, stage, wilaya, status, page = '1', limit = '20' } = req.query
    const filter: any = {}
    if (stage) filter.stage = stage
    if (wilaya) filter.wilaya = wilaya
    if (status) filter.status = status
    if (search) {
      const escapedSearch = (search as string).slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      filter.$or = [
        { wilaya: { $regex: escapedSearch, $options: 'i' } },
        { type: { $regex: escapedSearch, $options: 'i' } },
        { description: { $regex: escapedSearch, $options: 'i' } },
      ]
    }
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string)
    const [docs, total] = await Promise.all([
      Crop.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit as string)),
      Crop.countDocuments(filter),
    ])

    // Attach farmer/user name for each crop
    const farmerIds = [...new Set(docs.map(c => c.farmerId))]
    const [farmerDocs, userDocs] = await Promise.all([
      Farmer.find({ _id: { $in: farmerIds } }).select('name wilaya phone'),
      User.find({ _id: { $in: farmerIds } }).select('name phone'),
    ])
    const farmerMap: Record<string, any> = {}
    farmerDocs.forEach(f => { farmerMap[f._id.toString()] = { name: f.name, phone: f.phone } })
    userDocs.forEach(u => { if (!farmerMap[u._id.toString()]) farmerMap[u._id.toString()] = { name: u.name, phone: u.phone } })

    res.json({
      crops: docs.map(c => ({
        ...c.toObject(), id: c._id,
        farmerName: farmerMap[c.farmerId]?.name || '—',
        farmerPhone: farmerMap[c.farmerId]?.phone || '',
      })),
      total,
      page: parseInt(page as string),
    })
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

router.delete('/crops/:id', async (req: AuthRequest, res: Response) => {
  try {
    const crop = await Crop.findByIdAndDelete(req.params.id)
    if (!crop) return res.status(404).json({ error: 'المحصول غير موجود' })
    res.json({ message: 'تم حذف المحصول' })
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

router.put('/crops/:id/status', async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body
    if (!['pending', 'approved', 'rejected'].includes(status))
      return res.status(400).json({ error: 'حالة غير صالحة' })
    const crop = await Crop.findByIdAndUpdate(req.params.id, { status }, { new: true })
    if (!crop) return res.status(404).json({ error: 'المحصول غير موجود' })
    res.json({ ...crop.toObject(), id: crop._id })
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// ─── Equipment (admin) ──────────────────────────────────────────────────────
router.get('/equipment', async (req: AuthRequest, res: Response) => {
  try {
    const { search, wilaya, status, page = '1', limit = '20' } = req.query
    const filter: any = {}
    if (wilaya) filter.wilaya = wilaya
    if (status) filter.status = status
    if (search) {
      const escapedSearch = (search as string).slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      filter.$or = [
        { name: { $regex: escapedSearch, $options: 'i' } },
        { wilaya: { $regex: escapedSearch, $options: 'i' } },
        { description: { $regex: escapedSearch, $options: 'i' } },
      ]
    }
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string)
    const [docs, total] = await Promise.all([
      Equipment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit as string)),
      Equipment.countDocuments(filter),
    ])
    res.json({ equipment: docs.map(e => ({ ...e.toObject(), id: e._id })), total, page: parseInt(page as string) })
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

router.put('/equipment/:id/status', async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body
    if (!['pending', 'approved', 'rejected'].includes(status))
      return res.status(400).json({ error: 'حالة غير صالحة' })
    const eq = await Equipment.findByIdAndUpdate(req.params.id, { status }, { new: true })
    if (!eq) return res.status(404).json({ error: 'المعدة غير موجودة' })
    res.json({ ...eq.toObject(), id: eq._id })
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

router.delete('/equipment/:id', async (req: AuthRequest, res: Response) => {
  try {
    const eq = await Equipment.findByIdAndDelete(req.params.id)
    if (!eq) return res.status(404).json({ error: 'المعدة غير موجودة' })
    res.json({ message: 'تم حذف المعدة' })
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// ─── Lands (admin) ─────────────────────────────────────────────────────────
router.get('/lands', async (req: AuthRequest, res: Response) => {
  try {
    const { search, wilaya, goal, status, page = '1', limit = '20' } = req.query
    const filter: any = {}
    if (wilaya) filter.wilaya = wilaya
    if (goal) filter.goal = goal
    if (status) filter.status = status
    if (search) {
      const escapedSearch = (search as string).slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      filter.$or = [
        { wilaya: { $regex: escapedSearch, $options: 'i' } },
        { description: { $regex: escapedSearch, $options: 'i' } },
      ]
    }
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string)
    const [docs, total] = await Promise.all([
      Land.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit as string)),
      Land.countDocuments(filter),
    ])
    res.json({ lands: docs.map(l => ({ ...l.toObject(), id: l._id })), total, page: parseInt(page as string) })
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

router.put('/lands/:id/status', async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body
    if (!['pending', 'approved', 'rejected'].includes(status))
      return res.status(400).json({ error: 'حالة غير صالحة' })
    const land = await Land.findByIdAndUpdate(req.params.id, { status }, { new: true })
    if (!land) return res.status(404).json({ error: 'الأرض غير موجودة' })
    res.json({ ...land.toObject(), id: land._id })
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

router.delete('/lands/:id', async (req: AuthRequest, res: Response) => {
  try {
    const land = await Land.findByIdAndDelete(req.params.id)
    if (!land) return res.status(404).json({ error: 'الأرض غير موجودة' })
    res.json({ message: 'تم حذف الأرض' })
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// ─── Auto-approve settings ────────────────────────────────────────────────
router.get('/settings/autoApprove', async (_req: AuthRequest, res: Response) => {
  try {
    const doc = await Config.findOne({ configType: 'autoApprove' })
    // Default: all auto-approved
    const defaults = { crops: true, equipment: true, lands: true }
    if (!doc) return res.json(defaults)
    const result: any = { ...defaults }
    doc.items.forEach((item: any) => { result[item.key] = item.isActive !== false })
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

router.put('/settings/autoApprove', async (req: AuthRequest, res: Response) => {
  try {
    const { category, value } = req.body
    if (!['crops', 'equipment', 'lands'].includes(category))
      return res.status(400).json({ error: 'فئة غير صالحة' })

    let doc = await Config.findOne({ configType: 'autoApprove' })
    if (!doc) {
      doc = await Config.create({
        configType: 'autoApprove',
        items: [
          { key: 'crops', labelAr: 'المحاصيل', isActive: true },
          { key: 'equipment', labelAr: 'المعدات', isActive: true },
          { key: 'lands', labelAr: 'الأراضي', isActive: true },
        ],
      })
    }

    const item = doc.items.find((i: any) => i.key === category)
    if (item) {
      (item as any).isActive = value
    } else {
      doc.items.push({ key: category, labelAr: category, isActive: value } as any)
    }
    doc.markModified('items')
    await doc.save()

    const result: any = {}
    doc.items.forEach((i: any) => { result[i.key] = i.isActive !== false })
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// ─── Farmers ───────────────────────────────────────────────────────────────────
router.get('/farmers', async (req: AuthRequest, res: Response) => {
  try {
    const { search, page = '1', limit = '20' } = req.query
    const filter: any = {}
    if (search) {
      const escapedSearch = (search as string).slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      filter.$or = [
        { name: { $regex: escapedSearch, $options: 'i' } },
        { wilaya: { $regex: escapedSearch, $options: 'i' } },
      ]
    }
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string)
    const [docs, total] = await Promise.all([
      Farmer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit as string)),
      Farmer.countDocuments(filter),
    ])
    res.json({ farmers: docs.map(f => ({ ...f.toObject(), id: f._id })), total })
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

router.delete('/farmers/:id', async (req: AuthRequest, res: Response) => {
  try {
    const farmer = await Farmer.findByIdAndDelete(req.params.id)
    if (!farmer) return res.status(404).json({ error: 'الفلاح غير موجود' })
    res.json({ message: 'تم حذف الفلاح' })
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// ─── Default crop/equipment configs ─────────────────────────────────────────
const DEFAULT_CROP_TYPES = [
  { key: 'tomato',     labelAr: 'طماطم',       emoji: '🍅', order: 0 },
  { key: 'potato',     labelAr: 'بطاطا',        emoji: '🥔', order: 1 },
  { key: 'citrus',     labelAr: 'حمضيات',       emoji: '🍊', order: 2 },
  { key: 'watermelon', labelAr: 'بطيخ',         emoji: '🍉', order: 3 },
  { key: 'pepper',     labelAr: 'فلفل',         emoji: '🫑', order: 4 },
  { key: 'onion',      labelAr: 'بصل',          emoji: '🧅', order: 5 },
  { key: 'wheat',      labelAr: 'قمح',          emoji: '🌾', order: 6 },
  { key: 'olive',      labelAr: 'زيتون',        emoji: '🫒', order: 7 },
  { key: 'carrot',     labelAr: 'جزر',          emoji: '🥕', order: 8 },
  { key: 'garlic',     labelAr: 'ثوم',          emoji: '🧄', order: 9 },
  { key: 'eggplant',   labelAr: 'باذنجان',      emoji: '🍆', order: 10 },
  { key: 'zucchini',   labelAr: 'كوسة',         emoji: '🥒', order: 11 },
  { key: 'cucumber',   labelAr: 'خيار',         emoji: '🥒', order: 12 },
  { key: 'lettuce',    labelAr: 'خس',           emoji: '🥬', order: 13 },
  { key: 'fig',        labelAr: 'تين',          emoji: '🍈', order: 14 },
  { key: 'grape',      labelAr: 'عنب',          emoji: '🍇', order: 15 },
  { key: 'apricot',    labelAr: 'مشمش',         emoji: '🍑', order: 16 },
  { key: 'peach',      labelAr: 'خوخ',          emoji: '🍑', order: 17 },
  { key: 'apple',      labelAr: 'تفاح',         emoji: '🍎', order: 18 },
  { key: 'dates',      labelAr: 'تمور',         emoji: '🌴', order: 19 },
  { key: 'corn',       labelAr: 'ذرة',          emoji: '🌽', order: 20 },
  { key: 'barley',     labelAr: 'شعير',         emoji: '🌾', order: 21 },
  { key: 'pumpkin',    labelAr: 'قرع',          emoji: '🎃', order: 22 },
  { key: 'beans',      labelAr: 'فاصوليا',      emoji: '🫘', order: 23 },
  { key: 'lentils',    labelAr: 'عدس',          emoji: '🫘', order: 24 },
  { key: 'chickpeas',  labelAr: 'حمص',          emoji: '🫘', order: 25 },
  { key: 'sunflower',  labelAr: 'عباد الشمس',   emoji: '🌻', order: 26 },
  { key: 'strawberry', labelAr: 'فراولة',       emoji: '🍓', order: 27 },
]

const DEFAULT_EQUIP_TYPES = [
  { key: 'irrigation', labelAr: 'معدات ري',      emoji: '💧', order: 0 },
  { key: 'tractors',   labelAr: 'جرارات',        emoji: '🚜', order: 1 },
  { key: 'greenhouse', labelAr: 'بيوت بلاستيكية', emoji: '🏚️', order: 2 },
  { key: 'fertilizer', labelAr: 'أسمدة',         emoji: '🪣', order: 3 },
  { key: 'seeds',      labelAr: 'بذور',          emoji: '🌱', order: 4 },
]

const DEFAULT_CROP_DURATIONS = [
  { key: 'tomato',     labelAr: 'طماطم',       emoji: '🍅', days: 80,  order: 0 },
  { key: 'potato',     labelAr: 'بطاطا',        emoji: '🥔', days: 100, order: 1 },
  { key: 'pepper',     labelAr: 'فلفل',         emoji: '🫑', days: 85,  order: 2 },
  { key: 'onion',      labelAr: 'بصل',          emoji: '🧅', days: 120, order: 3 },
  { key: 'carrot',     labelAr: 'جزر',          emoji: '🥕', days: 90,  order: 4 },
  { key: 'garlic',     labelAr: 'ثوم',          emoji: '🧄', days: 160, order: 5 },
  { key: 'eggplant',   labelAr: 'باذنجان',      emoji: '🍆', days: 80,  order: 6 },
  { key: 'zucchini',   labelAr: 'كوسة',         emoji: '🥒', days: 50,  order: 7 },
  { key: 'cucumber',   labelAr: 'خيار',         emoji: '🥒', days: 55,  order: 8 },
  { key: 'lettuce',    labelAr: 'خس',           emoji: '🥬', days: 45,  order: 9 },
  { key: 'corn',       labelAr: 'ذرة',          emoji: '🌽', days: 90,  order: 10 },
  { key: 'wheat',      labelAr: 'قمح',          emoji: '🌾', days: 150, order: 11 },
  { key: 'barley',     labelAr: 'شعير',         emoji: '🌾', days: 140, order: 12 },
  { key: 'pumpkin',    labelAr: 'قرع',          emoji: '🎃', days: 100, order: 13 },
  { key: 'beans',      labelAr: 'فاصوليا',      emoji: '🫘', days: 60,  order: 14 },
  { key: 'lentils',    labelAr: 'عدس',          emoji: '🫘', days: 110, order: 15 },
  { key: 'chickpeas',  labelAr: 'حمص',          emoji: '🫘', days: 100, order: 16 },
  { key: 'sunflower',  labelAr: 'عباد الشمس',   emoji: '🌻', days: 100, order: 17 },
  { key: 'fennel',     labelAr: 'بسباس',        emoji: '🌿', days: 75,  order: 18 },
  { key: 'watermelon', labelAr: 'بطيخ',         emoji: '🍉', days: 80,  order: 19 },
  { key: 'strawberry', labelAr: 'فراولة',       emoji: '🍓', days: 40,  order: 20 },
  { key: 'apricot',    labelAr: 'مشمش',         emoji: '🍑', days: 70,  order: 21 },
  { key: 'cherry',     labelAr: 'كرز',          emoji: '🍒', days: 55,  order: 22 },
  { key: 'peach',      labelAr: 'خوخ',          emoji: '🍑', days: 100, order: 23 },
  { key: 'fig',        labelAr: 'تين',          emoji: '🍈', days: 75,  order: 24 },
  { key: 'grape',      labelAr: 'عنب',          emoji: '🍇', days: 100, order: 25 },
  { key: 'apple',      labelAr: 'تفاح',         emoji: '🍎', days: 150, order: 26 },
  { key: 'citrus',     labelAr: 'حمضيات',       emoji: '🍊', days: 270, order: 27 },
  { key: 'olive',      labelAr: 'زيتون',        emoji: '🫒', days: 200, order: 28 },
  { key: 'dates',      labelAr: 'تمور',         emoji: '🌴', days: 190, order: 29 },
  { key: 'banana',     labelAr: 'موز',          emoji: '🍌', days: 105, order: 30 },
  { key: 'kiwi',       labelAr: 'كيوي',         emoji: '🥝', days: 165, order: 31 },
  { key: 'raspberry',  labelAr: 'توت',          emoji: '🫐', days: 35,  order: 32 },
]

router.post('/config/:type/init-defaults', async (req: AuthRequest, res: Response) => {
  try {
    const defaults = req.params.type === 'cropTypes' ? DEFAULT_CROP_TYPES
      : req.params.type === 'cropDurations' ? DEFAULT_CROP_DURATIONS
      : DEFAULT_EQUIP_TYPES
    let doc = await Config.findOne({ configType: req.params.type })
    if (!doc) {
      doc = await Config.create({ configType: req.params.type, items: defaults.map(d => ({ ...d, isActive: true })) })
    } else {
      // Merge: add missing keys without removing existing ones
      const existingKeys = new Set(doc.items.map((i: any) => i.key))
      const toAdd = defaults.filter(d => !existingKeys.has(d.key)).map(d => ({ ...d, isActive: true }))
      if (toAdd.length > 0) {
        doc.items.push(...toAdd as any)
        await doc.save()
      }
    }
    res.json(doc.items)
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// ─── Config (crop types, equipment types, etc.) ────────────────────────────────
router.get('/config/:type', async (req: AuthRequest, res: Response) => {
  try {
    const doc = await Config.findOne({ configType: req.params.type })
    res.json(doc ? doc.items : [])
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

router.post('/config/:type/items', async (req: AuthRequest, res: Response) => {
  try {
    const { key, labelAr, emoji, order, image, subcategory, hidePlantingDate } = req.body
    if (!key || !labelAr) return res.status(400).json({ error: 'المفتاح والاسم مطلوبان' })

    let doc = await Config.findOne({ configType: req.params.type })
    if (!doc) doc = await Config.create({ configType: req.params.type, items: [] })

    const exists = doc.items.some((i: any) => i.key === key)
    if (exists) return res.status(409).json({ error: 'المفتاح موجود مسبقاً' })

    doc.items.push({ key, labelAr, emoji: emoji || '🌱', isActive: true, order: order ?? doc.items.length, ...(image ? { image } : {}), ...(subcategory ? { subcategory } : {}), ...(hidePlantingDate !== undefined ? { hidePlantingDate } : {}) } as any)
    await doc.save()
    res.status(201).json(doc.items)
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

router.put('/config/:type/items/:key', async (req: AuthRequest, res: Response) => {
  try {
    const doc = await Config.findOne({ configType: req.params.type })
    if (!doc) return res.status(404).json({ error: 'التكوين غير موجود' })

    const item = doc.items.find((i: any) => i.key === req.params.key)
    if (!item) return res.status(404).json({ error: 'العنصر غير موجود' })

    const { labelAr, emoji, isActive, order, days, image, subcategory, hidePlantingDate } = req.body
    if (labelAr !== undefined) (item as any).labelAr = labelAr
    if (emoji !== undefined) (item as any).emoji = emoji
    if (isActive !== undefined) (item as any).isActive = isActive
    if (order !== undefined) (item as any).order = order
    if (days !== undefined) (item as any).days = days
    if (image !== undefined) (item as any).image = image
    if (subcategory !== undefined) (item as any).subcategory = subcategory
    if (hidePlantingDate !== undefined) (item as any).hidePlantingDate = hidePlantingDate

    doc.markModified('items')
    await doc.save()
    res.json(doc.items)
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

router.delete('/config/:type/items/:key', async (req: AuthRequest, res: Response) => {
  try {
    const doc = await Config.findOne({ configType: req.params.type })
    if (!doc) return res.status(404).json({ error: 'التكوين غير موجود' })

    doc.items = doc.items.filter((i: any) => i.key !== req.params.key) as any
    await doc.save()
    res.json(doc.items)
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// ─── Gemini API Key (stored in Config, used by AI service) ──────────────────
router.get('/settings/gemini', async (_req: AuthRequest, res: Response) => {
  try {
    const doc = await Config.findOne({ configType: 'gemini' })
    const key = doc?.items?.[0]?.labelAr || ''
    res.json({ hasKey: !!key, keyPreview: key ? `${key.slice(0, 8)}...${key.slice(-4)}` : null })
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

router.put('/settings/gemini', async (req: AuthRequest, res: Response) => {
  try {
    const { apiKey } = req.body
    if (!apiKey?.startsWith('AIza')) return res.status(400).json({ error: 'مفتاح Gemini غير صالح' })
    let doc = await Config.findOne({ configType: 'gemini' })
    if (!doc) {
      doc = await Config.create({ configType: 'gemini', items: [{ key: 'apiKey', labelAr: apiKey, isActive: true }] })
    } else {
      if (doc.items.length === 0) doc.items.push({ key: 'apiKey', labelAr: apiKey, isActive: true } as any)
      else (doc.items[0] as any).labelAr = apiKey
      doc.markModified('items')
      await doc.save()
    }
    process.env.GEMINI_API_KEY = apiKey
    res.json({ success: true, keyPreview: `${apiKey.slice(0, 8)}...${apiKey.slice(-4)}` })
  } catch { res.status(500).json({ error: 'خطأ في الخادم' }) }
})

// GET /admin/users/:id/badges - get user badges
router.get('/users/:id/badges', requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('badges name role dealsCount trustScore')
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ badges: user.badges || [], dealsCount: user.dealsCount, trustScore: user.trustScore })
  } catch { res.status(500).json({ error: 'Server error' }) }
})

// PUT /admin/users/:id/badges - set user badges (full replace)
router.put('/users/:id/badges', requireAdmin, async (req, res) => {
  try {
    const { badges } = req.body
    if (!Array.isArray(badges)) return res.status(400).json({ error: 'badges must be array' })
    const user = await User.findByIdAndUpdate(req.params.id, { badges }, { new: true }).select('badges name role')
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ badges: user.badges })
  } catch { res.status(500).json({ error: 'Server error' }) }
})

// ─── Migration: generate MB-IDs for all users without one ────────────────────
router.post('/migrate/generate-mbids', async (_req: AuthRequest, res: Response) => {
  try {
    const users = await User.find({ mbId: { $exists: false } })
    let updated = 0
    for (const user of users) {
      if (!user.wilaya) continue
      try {
        const mbId = await generateMbId(user.wilaya)
        user.mbId = mbId
        await user.save()
        updated++
      } catch {}
    }
    res.json({ message: `تم توليد MB-ID لـ ${updated} مستخدم`, total: users.length, updated })
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// ─── Create user from admin ───────────────────────────────────────────────────
router.post('/create-user', async (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, password, wilaya, commune, role, email, profileImage } = req.body
    if (!name || !phone || !password || !wilaya || !role)
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' })
    if (!['agent', 'buyer', 'farmer'].includes(role))
      return res.status(400).json({ error: 'الدور غير صالح' })
    if (password.length < 8)
      return res.status(400).json({ error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' })
    const existing = await User.findOne({ phone })
    if (existing) return res.status(409).json({ error: 'رقم الهاتف مسجل مسبقاً' })
    const mbId = await generateMbId(wilaya)
    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, phone, password: hashed, wilaya, commune: commune || '', role, mbId, email: email || undefined, profileImage: profileImage || undefined })
    if (role === 'farmer') {
      await Farmer.create({ name, phone, wilaya, commune: commune || '', agentId: user._id.toString(), userId: user._id.toString() })
    }
    const { password: _p, __v, ...rest } = user.toObject()
    res.status(201).json({ user: { ...rest, id: rest._id } })
  } catch (err: any) {
    if (err.code === 11000) return res.status(400).json({ error: 'رقم الهاتف مستخدم مسبقاً' })
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// ─── Create crop from admin ───────────────────────────────────────────────────
router.post('/create-crop', async (req: AuthRequest, res: Response) => {
  try {
    const { farmerId, agentId, type, plantingDate, expectedHarvestDate, estimatedQuantityKg, wilaya, commune, pricePerKg, description, stage, images, videos, coverMediaType } = req.body
    if (!farmerId || !type || !estimatedQuantityKg || !wilaya)
      return res.status(400).json({ error: 'الحقول الأساسية مطلوبة' })
    const crop = await Crop.create({
      farmerId,
      agentId: agentId || farmerId,
      type,
      plantingDate: plantingDate ? new Date(plantingDate) : new Date(),
      expectedHarvestDate: expectedHarvestDate || undefined,
      estimatedQuantityKg: Number(estimatedQuantityKg),
      stage: stage || 'seeds',
      images: Array.isArray(images) ? images : [],
      videos: Array.isArray(videos) ? videos : [],
      coverMediaType: coverMediaType || 'image',
      wilaya,
      commune: commune || '',
      pricePerKg: pricePerKg ? Number(pricePerKg) : undefined,
      description,
      status: 'approved',
    })
    res.status(201).json({ ...crop.toObject(), id: crop._id })
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// ─── Create equipment from admin ──────────────────────────────────────────────
router.post('/create-equipment', async (req: AuthRequest, res: Response) => {
  try {
    const { agentId, name, category, description, pricePerDay, wilaya, phone } = req.body
    if (!name || !category || !wilaya || !agentId)
      return res.status(400).json({ error: 'الحقول الأساسية مطلوبة' })
    const eq = await Equipment.create({
      agentId, name, category, description,
      pricePerDay: pricePerDay ? Number(pricePerDay) : undefined,
      wilaya, phone: phone || '',
      images: [], videos: [],
      status: 'approved',
    })
    res.status(201).json({ ...eq.toObject(), id: eq._id })
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// ─── Create land from admin ───────────────────────────────────────────────────
router.post('/create-land', async (req: AuthRequest, res: Response) => {
  try {
    const { agentId, area, wilaya, commune, goal, priceType, price, description, phone } = req.body
    if (!area || !wilaya || !goal || !priceType || !agentId)
      return res.status(400).json({ error: 'الحقول الأساسية مطلوبة' })
    const land = await Land.create({
      agentId, area: Number(area), wilaya, commune: commune || '',
      goal, priceType, price: price ? Number(price) : undefined,
      description, phone: phone || '',
      images: [], videos: [], features: [], documents: [],
      status: 'approved',
    })
    res.status(201).json({ ...land.toObject(), id: land._id })
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// ─── Users list for dropdowns ─────────────────────────────────────────────────
router.get('/users-list', async (_req: AuthRequest, res: Response) => {
  try {
    const users = await User.find({ isBlocked: false }).select('name phone role wilaya').sort({ name: 1 }).limit(500)
    res.json(users.map(u => ({ id: u._id, name: u.name, phone: u.phone, role: u.role, wilaya: u.wilaya })))
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// ─── Farmers list for crop dropdown ──────────────────────────────────────────
router.get('/farmers-list', async (_req: AuthRequest, res: Response) => {
  try {
    const farmers = await Farmer.find().select('name phone wilaya userId agentId').sort({ name: 1 }).limit(500)
    res.json(farmers.map(f => ({ id: f._id, name: f.name, phone: f.phone, wilaya: f.wilaya, userId: f.userId })))
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// ─── Super Admin: manage admins ───────────────────────────────────────────────
router.get('/super/admins', requireSuperAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const admins = await User.find({ isAdmin: true }).select('-password -__v').sort({ createdAt: -1 })
    res.json(admins.map(u => ({ ...u.toObject(), id: u._id })))
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

router.put('/super/set-admin/:id', requireSuperAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { isAdmin, isSuperAdmin } = req.body
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ error: 'المستخدم غير موجود' })
    if (typeof isAdmin === 'boolean') user.isAdmin = isAdmin
    if (typeof isSuperAdmin === 'boolean') user.isSuperAdmin = isSuperAdmin
    await user.save()
    const { password: _p, __v, ...rest } = user.toObject()
    res.json({ user: { ...rest, id: rest._id } })
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

router.delete('/super/delete-admin/:id', requireSuperAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ error: 'المستخدم غير موجود' })
    if (user.isSuperAdmin) return res.status(403).json({ error: 'لا يمكن حذف المشرف العام' })
    await user.deleteOne()
    res.json({ message: 'تم حذف المشرف' })
  } catch (err) {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// ─── AI Level (Super Admin only) ──────────────────────────────────────────────
router.put('/super/users/:id/ai-level', requireSuperAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { aiLevel } = req.body
    if (![1, 2, 3].includes(aiLevel)) return res.status(400).json({ error: 'مستوى غير صالح' })
    const user = await User.findByIdAndUpdate(req.params.id, { aiLevel }, { new: true }).select('name aiLevel')
    if (!user) return res.status(404).json({ error: 'المستخدم غير موجود' })
    res.json(user)
  } catch {
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// POST /super/users/:id/login-as — تسجيل الدخول كمستخدم آخر (Super Admin فقط)
router.post('/super/users/:id/login-as', requireSuperAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password -__v')
    if (!user) return res.status(404).json({ error: 'المستخدم غير موجود' })
    if (user.isSuperAdmin) return res.status(403).json({ error: 'لا يمكن الدخول لحساب Super Admin آخر' })

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET not set')
    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role, isAdmin: user.isAdmin, isSuperAdmin: false },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    )
    res.json({ token, user: { ...user.toObject(), id: user._id } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// Public endpoint — no admin required
export { router as adminRouter }

export default router
