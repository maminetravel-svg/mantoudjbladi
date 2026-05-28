import mongoose, { Schema, Document } from 'mongoose'

export interface IOtp extends Document {
  phone: string
  hash: string
  expiry: Date
}

const OtpSchema = new Schema<IOtp>({
  phone:  { type: String, required: true, index: true },
  hash:   { type: String, required: true },
  expiry: { type: Date, required: true },
})

// TTL index: MongoDB يحذف الوثيقة تلقائياً بعد انتهاء الصلاحية
OtpSchema.index({ expiry: 1 }, { expireAfterSeconds: 0 })

export const Otp = mongoose.model<IOtp>('Otp', OtpSchema)
