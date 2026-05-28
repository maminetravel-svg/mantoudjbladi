import { Router, Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import { generateMbId } from '../utils/mbId'
import { Farmer } from '../models/Farmer'

const router = Router()

function makeToken(userId: string, role: string, isAdmin = false) {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is not set')
  return jwt.sign({ userId, role, isAdmin }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

function safeUser(user: any) {
  const { password, resetToken, resetTokenExpiry, __v, ...rest } = user.toObject()
  return { ...rest, id: rest._id }
}

// POST /api/auth/google — التحقق من Google ID Token
router.post('/google', async (req: Request, res: Response) => {
  try {
    const { idToken, wilaya, role, phone, name: customName, commune } = req.body
    if (!idToken) return res.status(400).json({ error: 'Google token مطلوب' })

    const clientId = process.env.GOOGLE_CLIENT_ID
    if (!clientId) return res.status(503).json({ error: 'خدمة Google غير مفعّلة' })

    // التحقق من ID Token مع Google
    const client = new OAuth2Client(clientId)
    let googleId: string, email: string | undefined, name: string

    try {
      const ticket = await client.verifyIdToken({ idToken, audience: clientId })
      const payload = ticket.getPayload()
      if (!payload?.sub) return res.status(400).json({ error: 'توكن Google غير صالح' })
      googleId = payload.sub
      email = payload.email
      name = payload.name || payload.email?.split('@')[0] || 'مستخدم'
    } catch {
      return res.status(400).json({ error: 'فشل التحقق من حساب Google' })
    }

    // البحث عن مستخدم موجود
    let user = await User.findOne({ $or: [{ googleId }, ...(email ? [{ email }] : [])] })

    if (user) {
      // تحديث googleId إذا سجّل قديماً بالإيميل
      if (!user.googleId) {
        user.googleId = googleId
        await user.save()
      }
      if ((user as any).isBlocked) return res.status(403).json({ error: 'تم حظر هذا الحساب' })
      const token = makeToken(user._id.toString(), user.role, (user as any).isAdmin)
      return res.json({ user: safeUser(user), token })
    }

    // مستخدم جديد — يحتاج اختيار الولاية والدور
    if (!wilaya || !role) {
      return res.status(202).json({
        needsSetup: true,
        idToken,
        googleId,
        email,
        name,
        message: 'أكمل إنشاء حسابك',
      })
    }

    if (!['agent', 'buyer', 'farmer'].includes(role)) {
      return res.status(400).json({ error: 'دور غير صالح' })
    }

    // إنشاء حساب جديد
    const mbId = await generateMbId(wilaya)
    user = await User.create({
      name: customName || name,
      phone: phone || `google_${googleId}`,
      password: `google_oauth_${googleId}`, // لن يُستخدم للدخول
      wilaya,
      commune: commune || '',
      role,
      googleId,
      email,
      mbId,
      isActive: true,
    })

    if (role === 'farmer') {
      await Farmer.create({
        name,
        phone: email || `google_${googleId}`,
        wilaya,
        agentId: user._id.toString(),
        userId: user._id.toString(),
      })
    }

    const token = makeToken(user._id.toString(), user.role)
    res.status(201).json({ user: safeUser(user), token })
  } catch (err: any) {
    console.error('[Google Auth Error]', err?.message)
    res.status(500).json({ error: 'خطأ في التحقق من حساب Google' })
  }
})

export default router
