import mongoose, { Schema, Document } from 'mongoose'

export interface ILand extends Document {
  area: number
  wilaya: string
  commune?: string
  gpsLat: number
  gpsLng: number
  goal: string
  priceType: string
  price?: number
  description?: string
  documents: string[]
  features: string[]
  images: string[]
  videos: string[]
  coverMediaType: 'image' | 'video'
  phone?: string
  agentId: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
}

const LandSchema = new Schema<ILand>({
  area:        { type: Number, required: true },
  wilaya:      { type: String, required: true },
  commune:     { type: String },
  gpsLat:      { type: Number, default: 0 },
  gpsLng:      { type: Number, default: 0 },
  goal:        { type: String, required: true },
  priceType:   { type: String, required: true },
  price:       { type: Number },
  description: { type: String },
  documents:   { type: [String], default: [] },
  features:    { type: [String], default: [] },
  images:      { type: [String], default: [] },
  videos:      { type: [String], default: [] },
  coverMediaType: { type: String, enum: ['image', 'video'], default: 'image' },
  phone:       { type: String },
  agentId:     { type: String, required: true },
  status:      { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
}, { timestamps: true })

// ── Indexes ─────────────────────────────────────────────────
LandSchema.index({ wilaya: 1, status: 1, createdAt: -1 })
LandSchema.index({ agentId: 1, createdAt: -1 })
LandSchema.index({ goal: 1, wilaya: 1, status: 1 })
LandSchema.index({ gpsLat: 1, gpsLng: 1 })

export const Land = mongoose.model<ILand>('Land', LandSchema)
