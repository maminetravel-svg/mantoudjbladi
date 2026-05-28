import rateLimit from 'express-rate-limit'
import { Request } from 'express'

// دالة موحدة لاستخراج IP بشكل آمن (IPv4 و IPv6)
function getClientKey(req: Request): string {
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim()
    || req.socket.remoteAddress
    || 'unknown'
  // تحويل IPv6 mapped IPv4 إلى IPv4 عادي
  return ip.replace(/^::ffff:/, '')
}

// Auth endpoints — محاولات تسجيل الدخول
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'محاولات كثيرة جداً، حاول بعد 15 دقيقة' },
  keyGenerator: getClientKey,
  standardHeaders: true,
  legacyHeaders: false,
})

// Login — أكثر تقييداً لمنع brute force
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'محاولات تسجيل دخول كثيرة، حاول بعد 15 دقيقة' },
  keyGenerator: getClientKey,
  standardHeaders: true,
  legacyHeaders: false,
})

// OTP / forgot password — أكثر تقييداً
export const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'تجاوزت الحد المسموح لطلبات OTP، حاول بعد ساعة' },
  keyGenerator: getClientKey,
  standardHeaders: true,
  legacyHeaders: false,
})

// API عام — للحماية من الاستنزاف
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  message: { error: 'طلبات كثيرة جداً، أبطئ قليلاً' },
  keyGenerator: getClientKey,
  standardHeaders: true,
  legacyHeaders: false,
})

// AI endpoint — للتحكم في التكلفة (مرتبط بالمستخدم)
export const aiLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 20,
  message: { error: 'DAILY_LIMIT_REACHED' },
  keyGenerator: (req: any) => req.userId || getClientKey(req),
  standardHeaders: true,
  legacyHeaders: false,
})

// رفع الملفات
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  message: { error: 'تجاوزت حد الرفع، حاول بعد ساعة' },
  keyGenerator: getClientKey,
  standardHeaders: true,
  legacyHeaders: false,
})
