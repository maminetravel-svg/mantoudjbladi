import { Router, Response } from 'express'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { requireAuth, requireAdmin, AuthRequest } from '../middleware/auth'
import multer from 'multer'
import {
  uploadImageRaw,
  uploadImagesRaw,
  uploadVideo,
  processImage,
  imageUrls,
  fileUrl,
  VIDEO_RULES,
} from '../middleware/upload'

const router = Router()

// POST /api/uploads/image — رفع ومعالجة صورة واحدة
router.post('/image', requireAuth, (req: AuthRequest, res: Response) => {
  uploadImageRaw(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message })
    if (!req.file) return res.status(400).json({ error: 'لم يتم رفع أي صورة' })

    try {
      const baseFilename = `${uuidv4()}`
      const files = await processImage(req.file.buffer, baseFilename)
      const urls = imageUrls(req, files)
      res.json(urls)
    } catch (processErr) {
      console.error('[Image Process Error]', processErr)
      res.status(500).json({ error: 'فشلت معالجة الصورة' })
    }
  })
})

// POST /api/uploads/images — رفع ومعالجة صور متعددة
router.post('/images', requireAuth, (req: AuthRequest, res: Response) => {
  uploadImagesRaw(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message })
    const files = req.files as Express.Multer.File[]
    if (!files?.length) return res.status(400).json({ error: 'لم يتم رفع أي صورة' })

    try {
      const results = await Promise.all(
        files.map(async (file) => {
          const baseFilename = `${uuidv4()}`
          const processed = await processImage(file.buffer, baseFilename)
          return imageUrls(req, processed)
        })
      )
      res.json({
        urls: results.map(r => r.url),        // للتوافق مع الكود القديم
        images: results,                       // النسخ الثلاث لكل صورة
      })
    } catch (processErr) {
      console.error('[Images Process Error]', processErr)
      res.status(500).json({ error: 'فشلت معالجة الصور' })
    }
  })
})

// POST /api/uploads/video — رفع فيديو مع التحقق من القواعد
router.post('/video', requireAuth, (req: AuthRequest, res: Response) => {
  uploadVideo(req, res, async (err) => {
    if (err) {
      // خطأ حجم الملف
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          error: `حجم الفيديو يتجاوز الحد المسموح (${VIDEO_RULES.maxSizeMB}MB)`,
          maxSizeMB: VIDEO_RULES.maxSizeMB,
        })
      }
      return res.status(400).json({ error: err.message })
    }
    if (!req.file) return res.status(400).json({ error: 'لم يتم رفع أي فيديو' })

    try {
      const fileSizeMB = req.file.size / (1024 * 1024)
      const url = fileUrl(req, 'videos', req.file.filename)

      // محاولة التحقق من مدة الفيديو بـ ffprobe إذا كان متاحاً
      let duration: number | null = null
      try {
        duration = await getVideoDuration(req.file.path)
        if (duration && duration > VIDEO_RULES.maxDurationSec) {
          // حذف الملف المرفوع
          fs.unlink(req.file.path, () => {})
          return res.status(400).json({
            error: `مدة الفيديو تتجاوز الحد المسموح (${VIDEO_RULES.maxDurationSec / 60} دقائق)`,
            maxDurationMin: VIDEO_RULES.maxDurationSec / 60,
          })
        }
      } catch {
        // ffprobe غير متاح — نتابع بدون فحص المدة
      }

      res.json({
        url,
        filename: req.file.filename,
        sizeMB: Math.round(fileSizeMB * 10) / 10,
        duration,
      })
    } catch (videoErr) {
      console.error('[Video Upload Error]', videoErr)
      res.status(500).json({ error: 'خطأ في معالجة الفيديو' })
    }
  })
})

// ── مساعد: مدة الفيديو بـ ffprobe ────────────────────────
function getVideoDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const { execFile } = require('child_process')
    execFile('ffprobe', [
      '-v', 'quiet',
      '-print_format', 'json',
      '-show_format',
      filePath,
    ], (err: any, stdout: string) => {
      if (err) return reject(err)
      try {
        const info = JSON.parse(stdout)
        resolve(parseFloat(info.format.duration))
      } catch {
        reject(new Error('تعذر قراءة مدة الفيديو'))
      }
    })
  })
}

// ── APK Upload configuration ──────────────────────────────
const apkStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(__dirname, '..', '..', 'uploads', 'apks')
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    cb(null, dir)
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${uuidv4()}${ext}`)
  },
})

function apkFilter(_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const ext = path.extname(file.originalname).toLowerCase()
  if (ext === '.apk') cb(null, true)
  else cb(new Error('يجب رفع ملف بصيغة APK فقط (.apk)'))
}

const uploadApk = multer({
  storage: apkStorage,
  fileFilter: apkFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max limit
}).single('apk')

// POST /api/uploads/apk — رفع ملف APK جديد (للمشرفين فقط)
router.post('/apk', requireAuth, requireAdmin, (req: AuthRequest, res: Response) => {
  uploadApk(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'حجم ملف APK يتجاوز الحد المسموح به (100MB)' })
      }
      return res.status(400).json({ error: err.message })
    }
    if (!req.file) return res.status(400).json({ error: 'لم يتم رفع أي ملف' })

    const url = fileUrl(req, 'apks', req.file.filename)
    res.json({ url, filename: req.file.filename })
  })
})

export default router
