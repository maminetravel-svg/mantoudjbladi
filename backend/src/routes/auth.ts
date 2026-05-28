import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import { Farmer } from '../models/Farmer'
import { requireAuth, AuthRequest } from '../middleware/auth'
import { loginLimiter, otpLimiter } from '../middleware/rateLimiter'
import { generateMbId } from '../utils/mbId'
import { sendOtpEmail } from '../services/email'
import { sendOtpSms } from '../services/sms'
import { Otp } from '../models/Otp'

const router = Router()

// POST /api/auth/send-register-otp
router.post('/send-register-otp', otpLimiter, async (req: Request, res: Response) => {
  try {
    const { phone } = req.body
    if (!phone) return res.status(400).json({ error: 'رقم الهاتف مطلوب' })

    const existing = await User.findOne({ phone })
    if (existing) return res.status(409).json({
      error: 'رقم الهاتف مسجل مسبقاً — إذا أنشأ لك وسيط حساباً، اضغط "نسيت كلمة المرور"',
      code: 'PHONE_EXISTS',
    })

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiry = new Date(Date.now() + 15 * 60 * 1000)
    const hash = await bcrypt.hash(otp, 10)
    await Otp.findOneAndReplace({ phone }, { phone, hash, expiry }, { upsert: true })

    try {
      const intlPhone = phone.startsWith('+') ? phone : `+213${phone.replace(/^0/, '')}`
      await sendOtpSms(intlPhone, otp)
    } catch (smsErr) {
      console.error('[Register OTP SMS Error]', smsErr)
      console.log(`[Register OTP fallback] phone=${phone.slice(0, 4)}****`)
    }

    res.json({ message: 'تم إرسال رمز التحقق' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

function makeToken(userId: string, role: string, isAdmin = false, isSuperAdmin = false) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set')
  return jwt.sign({ userId, role, isAdmin, isSuperAdmin }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

function safeUser(user: any) {
  const { password, __v, ...rest } = user.toObject()
  return { ...rest, id: rest._id }
}

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, phone, password, wilaya, role, commune, otp } = req.body
    if (!name || !phone || !password || !wilaya || !role)
      return res.status(400).json({ error: 'جميع الحقول مطلوبة' })
    if (!['agent', 'buyer', 'farmer'].includes(role))
      return res.status(400).json({ error: 'دور غير صالح' })
    if (password.length < 8)
      return res.status(400).json({ error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' })

    // Verify OTP
    const stored = await Otp.findOne({ phone })
    if (!stored) return res.status(400).json({ error: 'رمز التحقق غير موجود، اضغط "إرسال رمز التحقق" مجدداً' })
    if (stored.expiry < new Date()) {
      await Otp.deleteOne({ phone })
      return res.status(400).json({ error: 'انتهت صلاحية رمز التحقق، اضغط "إرسال رمز التحقق" مجدداً' })
    }
    const otpValid = await bcrypt.compare(otp, stored.hash)
    if (!otpValid) return res.status(400).json({ error: 'رمز التحقق غير صحيح' })
    await Otp.deleteOne({ phone })

    const existing = await User.findOne({ phone })
    if (existing) return res.status(409).json({
      error: 'رقم الهاتف مسجل مسبقاً — إذا أنشأ لك وسيط حساباً بهذا الرقم، اضغط "نسيت كلمة المرور" لتعيين كلمة سر جديدة والدخول',
      code: 'PHONE_EXISTS',
    })

    const mbId = await generateMbId(wilaya)
    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, phone, password: hashed, wilaya, commune: commune || '', role, mbId })

    if (role === 'farmer') {
      await Farmer.create({ name, phone, wilaya, commune: commune || '', agentId: user._id.toString(), userId: user._id.toString() })
    }

    const token = makeToken(user._id.toString(), user.role)
    res.status(201).json({ user: safeUser(user), token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// POST /api/auth/login
router.post('/login', loginLimiter, async (req: Request, res: Response) => {
  try {
    const { phone, password } = req.body
    if (!phone || !password)
      return res.status(400).json({ error: 'رقم الهاتف وكلمة المرور مطلوبان' })

    const user = await User.findOne({ phone })
    if (!user) return res.status(404).json({ error: 'رقم الهاتف غير مسجل' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ error: 'كلمة المرور غير صحيحة' })

    if ((user as any).isBlocked) return res.status(403).json({ error: 'تم حظر هذا الحساب' })

    const token = makeToken(user._id.toString(), user.role, (user as any).isAdmin, (user as any).isSuperAdmin)
    res.json({ user: safeUser(user), token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// POST /api/auth/forgot-password — generates OTP and stores it
router.post('/forgot-password', otpLimiter, async (req: Request, res: Response) => {
  try {
    const { phone } = req.body
    if (!phone) return res.status(400).json({ error: 'رقم الهاتف مطلوب' })

    const user = await User.findOne({ phone })
    // Always return 200 to avoid phone enumeration
    if (!user) return res.json({ message: 'إذا كان الرقم مسجلاً، ستصلك رسالة التحقق' })

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiry = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes

    user.resetToken = await bcrypt.hash(otp, 10)
    user.resetTokenExpiry = expiry
    await user.save()

    // إرسال OTP عبر SMS (Twilio)
    try {
      const intlPhone = phone.startsWith('+') ? phone : `+213${phone.replace(/^0/, '')}`
      await sendOtpSms(intlPhone, otp)
    } catch (smsErr) {
      console.error('[SMS OTP Error]', smsErr)
      // Fallback: إيميل إذا متوفر
      if (user.email && process.env.EMAIL_USER) {
        try { await sendOtpEmail(user.email, otp, user.name) } catch {}
      } else {
        console.log(`[RESET OTP fallback] phone=${phone.slice(0, 4)}****`)
      }
    }

    res.json({ message: 'إذا كان الرقم مسجلاً، ستصلك رسالة التحقق' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// POST /api/auth/reset-password — requires OTP token
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { phone, otp, newPassword } = req.body
    if (!phone || !otp || !newPassword)
      return res.status(400).json({ error: 'رقم الهاتف ورمز التحقق وكلمة المرور الجديدة مطلوبة' })
    if (newPassword.length < 8)
      return res.status(400).json({ error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' })

    const user = await User.findOne({ phone })
    if (!user || !user.resetToken || !user.resetTokenExpiry)
      return res.status(400).json({ error: 'رمز التحقق غير صالح أو منتهي الصلاحية' })

    if (user.resetTokenExpiry < new Date())
      return res.status(400).json({ error: 'انتهت صلاحية رمز التحقق، أعد الطلب' })

    const valid = await bcrypt.compare(otp, user.resetToken)
    if (!valid) return res.status(400).json({ error: 'رمز التحقق غير صحيح' })

    user.password = await bcrypt.hash(newPassword, 10)
    user.resetToken = undefined
    user.resetTokenExpiry = undefined
    await user.save()
    res.json({ message: 'تم تغيير كلمة المرور بنجاح' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

// GET /api/auth/me
router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.userId).select('-password -__v')
    if (!user) return res.status(404).json({ error: 'المستخدم غير موجود' })
    res.json({ ...user.toObject(), id: user._id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'خطأ في الخادم' })
  }
})

export default router
