import mongoose, { Schema, Document } from 'mongoose'

export interface IInspectionRequest {
  _id: string
  buyerId: string
  buyerName: string
  buyerPhone?: string
  status: 'pending' | 'approved' | 'completed' | 'rejected'
  requestedAt: Date
}

export interface IPreOrder {
  _id: string
  buyerId: string
  buyerName: string
  buyerPhone?: string
  quantityKg: number
  pricePerKg: number
  status: 'pending' | 'accepted' | 'rejected' | 'completed'
  createdAt: Date
}

export interface ICrop extends Document {
  farmerId: string
  agentId: string
  type: string
  plantingDate: string
  expectedHarvestDate?: string
  estimatedQuantityKg: number
  stage: 'seeds' | 'growth' | 'flowering' | 'ready'
  images: string[]
  videos: string[]
  coverMediaType: string
  gpsLat: number
  gpsLng: number
  wilaya: string
  pricePerKg?: number
  description?: string
  marketTarget?: string
  isOfflinePending: boolean
  inspectionRequests: IInspectionRequest[]
  preOrders: IPreOrder[]
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
}

const InspectionSchema = new Schema({
  buyerId:    { type: String, required: true },
  buyerName:  { type: String, required: true },
  buyerPhone: { type: String },
  status:     { type: String, enum: ['pending', 'approved', 'completed', 'rejected'], default: 'pending' },
}, { timestamps: true })

const PreOrderSchema = new Schema({
  buyerId:    { type: String, required: true },
  buyerName:  { type: String, required: true },
  buyerPhone: { type: String },
  quantityKg: { type: Number, required: true },
  pricePerKg: { type: Number, required: true },
  status:     { type: String, enum: ['pending', 'accepted', 'rejected', 'completed'], default: 'pending' },
}, { timestamps: true })

const CropSchema = new Schema<ICrop>({
  farmerId:             { type: String, required: true },
  agentId:              { type: String, required: true },
  type:                 { type: String, required: true },
  plantingDate:         { type: String, required: true },
  expectedHarvestDate:  { type: String },
  estimatedQuantityKg:  { type: Number, required: true },
  stage:                { type: String, enum: ['seeds', 'growth', 'flowering', 'ready'], default: 'seeds' },
  images:               { type: [String], default: [] },
  videos:               { type: [String], default: [] },
  coverMediaType:       { type: String, default: 'image' },
  gpsLat:               { type: Number, default: 0 },
  gpsLng:               { type: Number, default: 0 },
  wilaya:               { type: String, required: true },
  pricePerKg:           { type: Number },
  description:          { type: String },
  marketTarget:         { type: String },
  isOfflinePending:     { type: Boolean, default: false },
  inspectionRequests:   { type: [InspectionSchema], default: [] },
  preOrders:            { type: [PreOrderSchema], default: [] },
  status:               { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
}, { timestamps: true })

// ── Indexes للأداء ──────────────────────────────────────────
CropSchema.index({ wilaya: 1, status: 1, createdAt: -1 })   // فلترة السوق الرئيسي
CropSchema.index({ agentId: 1, createdAt: -1 })              // محاصيل الوكيل
CropSchema.index({ farmerId: 1, createdAt: -1 })             // محاصيل الفلاح
CropSchema.index({ type: 1, wilaya: 1, status: 1 })          // بحث بالنوع والولاية
CropSchema.index({ gpsLat: 1, gpsLng: 1 })                  // البحث الجغرافي للخريطة
CropSchema.index({ status: 1, createdAt: -1 })               // فلترة الإدارة
CropSchema.index({ type: 'text', description: 'text' })      // البحث النصي الكامل

export const Crop = mongoose.model<ICrop>('Crop', CropSchema)
