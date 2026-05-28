import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'

export interface AuthRequest extends Request {
  userId?: string
  userRole?: string
  isAdmin?: boolean
  isSuperAdmin?: boolean
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'غير مصرح' })
  }

  const token = header.slice(7)
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string; isAdmin?: boolean }
    req.userId = payload.userId
    req.userRole = payload.role
    req.isAdmin = payload.isAdmin || false
    next()
  } catch {
    return res.status(401).json({ error: 'الجلسة منتهية، يرجى تسجيل الدخول مجدداً' })
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.userRole || '')) {
      return res.status(403).json({ error: 'غير مسموح لك بهذا الإجراء' })
    }
    next()
  }
}

export async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'غير مصرح' })
  const token = header.slice(7)
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string; isAdmin?: boolean; isSuperAdmin?: boolean }
    if (!payload.isAdmin) return res.status(403).json({ error: 'صلاحيات المشرف مطلوبة' })
    req.userId = payload.userId
    req.userRole = payload.role
    req.isAdmin = true
    req.isSuperAdmin = payload.isSuperAdmin || false
    next()
  } catch {
    return res.status(401).json({ error: 'الجلسة منتهية' })
  }
}

export function requireSuperAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.isSuperAdmin) return res.status(403).json({ error: 'صلاحيات المشرف العام مطلوبة' })
  next()
}
