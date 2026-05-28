import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads')

// ── أحجام الصور المُنشأة تلقائياً ─────────────────────────
export const IMAGE_SIZES = {
  thumbnail: { width: 200, height: 200 },  // للقوائم والبطاقات السريعة
  medium:    { width: 600, height: 600 },  // للعرض العادي
  full:      { width: 1200, height: 1200 }, // للتفاصيل والتكبير
}

// ── قواعد الفيديو ─────────────────────────────────────────
export const VIDEO_RULES = {
  maxSizeMB: 50,           // الحجم الأقصى 50MB
  maxDurationSec: 90,      // المدة الأقصى 90 ثانية (1.5 دقيقة)
  allowedMimes: ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo'],
  allowedExts: ['.mp4', '.mov', '.webm', '.avi'],
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

// إنشاء المجلدات
ensureDir(path.join(UPLOADS_DIR, 'images', 'thumbnail'))
ensureDir(path.join(UPLOADS_DIR, 'images', 'medium'))
ensureDir(path.join(UPLOADS_DIR, 'images', 'full'))
ensureDir(path.join(UPLOADS_DIR, 'videos'))

// ── تخزين مؤقت في الذاكرة لمعالجة الصور بـ Sharp ─────────
const memoryStorage = multer.memoryStorage()

// ── تخزين على الديسك للفيديوهات ───────────────────────────
const videoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.join(UPLOADS_DIR, 'videos')),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${uuidv4()}${ext}`)
  },
})

function imageFilter(_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
  if (allowed.includes(file.mimetype)) cb(null, true)
  else cb(new Error('نوع الصورة غير مدعوم (JPEG, PNG, WebP فقط)'))
}

function videoFilter(_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (VIDEO_RULES.allowedMimes.includes(file.mimetype)) cb(null, true)
  else cb(new Error('نوع الفيديو غير مدعوم (MP4, MOV, WebM فقط)'))
}

// ── معالجة الصورة بـ Sharp → ينشئ 3 نسخ WebP ─────────────
export async function processImage(
  buffer: Buffer,
  baseFilename: string
): Promise<{ thumbnail: string; medium: string; full: string }> {
  const name = baseFilename.replace(/\.[^.]+$/, '') // بدون امتداد

  const process = async (size: { width: number; height: number }, folder: string) => {
    const filename = `${name}.webp`
    const outputPath = path.join(UPLOADS_DIR, 'images', folder, filename)
    await sharp(buffer)
      .resize(size.width, size.height, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(outputPath)
    return filename
  }

  const [thumbFile, medFile, fullFile] = await Promise.all([
    process(IMAGE_SIZES.thumbnail, 'thumbnail'),
    process(IMAGE_SIZES.medium, 'medium'),
    process(IMAGE_SIZES.full, 'full'),
  ])

  return { thumbnail: thumbFile, medium: medFile, full: fullFile }
}

// ── Multer instances ───────────────────────────────────────
export const uploadImageRaw = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB في الذاكرة (سيُضغط لأقل)
}).single('image')

export const uploadImagesRaw = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 15 * 1024 * 1024 },
}).array('images', 10)

export const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFilter,
  limits: { fileSize: VIDEO_RULES.maxSizeMB * 1024 * 1024 },
}).single('video')

// ── دوال المساعدة لعنوان الملف ────────────────────────────
export function fileUrl(req: any, folder: string, filename: string): string {
  const base = process.env.API_URL || process.env.FRONTEND_URL || `${req.protocol}://${req.get('host')}`
  return `${base}/api/static/${folder}/${filename}`
}

export function imageUrls(req: any, filenames: { thumbnail: string; medium: string; full: string }) {
  return {
    thumbnail: fileUrl(req, 'images/thumbnail', filenames.thumbnail),
    medium:    fileUrl(req, 'images/medium',    filenames.medium),
    full:      fileUrl(req, 'images/full',      filenames.full),
    // الـ URL الافتراضي يُستخدم في قاعدة البيانات (medium للعرض العادي)
    url:       fileUrl(req, 'images/medium',    filenames.medium),
  }
}

// للتوافق مع الكود القديم — يُنشئ نسخة medium فقط في الذاكرة القديمة
export const uploadImage = uploadImageRaw
export const uploadImages = uploadImagesRaw
