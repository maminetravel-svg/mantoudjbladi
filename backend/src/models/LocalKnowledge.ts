import mongoose, { Schema, Document } from 'mongoose'

export interface ILocalKnowledge extends Document {
  topic: string
  content: string
  wilaya?: string
  userId: string
  userName?: string
  verified: boolean
  createdAt: Date
}

const LocalKnowledgeSchema = new Schema<ILocalKnowledge>({
  topic:    { type: String, required: true },
  content:  { type: String, required: true },
  wilaya:   { type: String },
  userId:   { type: String, required: true },
  userName: { type: String },
  verified: { type: Boolean, default: false },
}, { timestamps: true })

LocalKnowledgeSchema.index({ topic: 'text', content: 'text' })
LocalKnowledgeSchema.index({ wilaya: 1 })

export const LocalKnowledge = mongoose.model<ILocalKnowledge>('LocalKnowledge', LocalKnowledgeSchema)
