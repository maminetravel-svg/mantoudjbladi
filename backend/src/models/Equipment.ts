import mongoose, { Schema, Document } from 'mongoose'

export interface IEquipment extends Document {
  name: string
  category: string
  description?: string
  pricePerDay?: number
  wilaya: string
  phone: string
  images: string[]
  videos: string[]
  coverMediaType: 'image' | 'video'
  gpsLat?: number
  gpsLng?: number
  agentId: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
}

const EquipmentSchema = new Schema<IEquipment>({
  name:        { type: String, required: true },
  category:    { type: String, required: true },
  description: { type: String },
  pricePerDay: { type: Number },
  wilaya:      { type: String, required: true },
  phone:       { type: String, required: true },
  images:      { type: [String], default: [] },
  videos:      { type: [String], default: [] },
  coverMediaType: { type: String, enum: ['image', 'video'], default: 'image' },
  gpsLat:      { type: Number },
  gpsLng:      { type: Number },
  agentId:     { type: String, required: true },
  status:      { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
}, { timestamps: true })

// ── Indexes ─────────────────────────────────────────────────
EquipmentSchema.index({ wilaya: 1, status: 1, createdAt: -1 })
EquipmentSchema.index({ agentId: 1, createdAt: -1 })
EquipmentSchema.index({ category: 1, wilaya: 1, status: 1 })
EquipmentSchema.index({ gpsLat: 1, gpsLng: 1 })
EquipmentSchema.index({ name: 'text', description: 'text' })

export const Equipment = mongoose.model<IEquipment>('Equipment', EquipmentSchema)
