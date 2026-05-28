import mongoose, { Schema, Document } from 'mongoose'

export interface IBuyerReview {
  _id: string
  reviewerId: string
  reviewerName: string
  reviewerRole: string
  rating: number
  comment: string
  createdAt: Date
}

export interface IUser extends Document {
  name: string
  firstName?: string
  lastName?: string
  phone: string
  password: string
  role: 'agent' | 'buyer' | 'farmer'
  wilaya: string
  commune?: string
  gpsLat?: number
  gpsLng?: number
  trustScore: number
  dealsCount: number
  reviews: IBuyerReview[]
  isAdmin: boolean
  isSuperAdmin: boolean
  isBlocked: boolean
  mbId?: string
  isActive: boolean
  createdAt: Date
  resetToken?: string
  resetTokenExpiry?: Date
  googleId?: string
  email?: string
  profileImage?: string
  badges: string[]
  aiLevel?: 1 | 2 | 3
  geminiKey?: string
  facebookUrl?: string
  tiktokUrl?: string
}

const BuyerReviewSchema = new Schema({
  reviewerId:   { type: String, required: true },
  reviewerName: { type: String, required: true },
  reviewerRole: { type: String, required: true },
  rating:       { type: Number, required: true, min: 1, max: 5 },
  comment:      { type: String, required: true },
}, { timestamps: true })

const UserSchema = new Schema<IUser>({
  name:       { type: String, required: true },
  firstName:  { type: String },
  lastName:   { type: String },
  phone:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  role:       { type: String, enum: ['agent', 'buyer', 'farmer'], required: true },
  wilaya:     { type: String, required: true },
  commune:    { type: String },
  gpsLat:     { type: Number },
  gpsLng:     { type: Number },
  trustScore: { type: Number, default: 0 },
  dealsCount: { type: Number, default: 0 },
  reviews:    { type: [BuyerReviewSchema], default: [] },
  isAdmin:    { type: Boolean, default: false },
  isSuperAdmin: { type: Boolean, default: false },
  isBlocked:  { type: Boolean, default: false },
  mbId:       { type: String, unique: true, sparse: true },
  isActive:         { type: Boolean, default: true },
  resetToken:       { type: String },
  resetTokenExpiry: { type: Date },
  googleId:         { type: String },
  email:            { type: String },
  profileImage:     { type: String },
  badges:           { type: [String], default: [] },
  aiLevel:          { type: Number, enum: [1, 2, 3], default: 1 },
  geminiKey:        { type: String },
  facebookUrl:      { type: String },
  tiktokUrl:        { type: String },
}, { timestamps: true })

// ── Indexes ─────────────────────────────────────────────────
UserSchema.index({ wilaya: 1, role: 1 })
UserSchema.index({ role: 1, isBlocked: 1 })
UserSchema.index({ googleId: 1 }, { sparse: true })
UserSchema.index({ email: 1 }, { sparse: true })
UserSchema.index({ name: 'text' })

export const User = mongoose.model<IUser>('User', UserSchema)
