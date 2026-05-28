import mongoose, { Schema, Document } from 'mongoose'

export interface IFarmerReview {
  _id: string
  buyerId: string
  buyerName: string
  rating: number
  comment: string
  createdAt: Date
}

export interface IFarmer extends Document {
  name: string
  phone: string
  wilaya: string
  commune?: string
  gpsLat: number
  gpsLng: number
  trustScore: number
  dealsCompleted: number
  specialization?: string
  agentId: string
  userId?: string
  isActiveForAgent: boolean
  reviews: IFarmerReview[]
  createdAt: Date
}

const ReviewSchema = new Schema({
  buyerId:   { type: String, required: true },
  buyerName: { type: String, required: true },
  rating:    { type: Number, required: true, min: 1, max: 5 },
  comment:   { type: String, required: true },
}, { timestamps: true })

const FarmerSchema = new Schema<IFarmer>({
  name:           { type: String, required: true },
  phone:          { type: String, required: true },
  wilaya:         { type: String, required: true },
  commune:        { type: String },
  gpsLat:         { type: Number, default: 0 },
  gpsLng:         { type: Number, default: 0 },
  trustScore:     { type: Number, default: 0 },
  dealsCompleted: { type: Number, default: 0 },
  specialization: { type: String },
  agentId:          { type: String, required: true },
  userId:           { type: String },
  isActiveForAgent: { type: Boolean, default: true },
  reviews:          { type: [ReviewSchema], default: [] },
}, { timestamps: true })

// ── Indexes ─────────────────────────────────────────────────
FarmerSchema.index({ agentId: 1, isActiveForAgent: 1 })  // فلاحو الوكيل
FarmerSchema.index({ wilaya: 1 })
FarmerSchema.index({ userId: 1 }, { sparse: true })
FarmerSchema.index({ name: 'text' })                     // البحث بالاسم

export const Farmer = mongoose.model<IFarmer>('Farmer', FarmerSchema)
