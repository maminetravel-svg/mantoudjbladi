import mongoose, { Schema, Document } from 'mongoose'

export interface IConnectionRequest extends Document {
  agentId: string
  agentName: string
  farmerId: string   // User ID of the farmer
  farmerName: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: Date
}

const ConnectionRequestSchema = new Schema<IConnectionRequest>({
  agentId:    { type: String, required: true },
  agentName:  { type: String, required: true },
  farmerId:   { type: String, required: true },
  farmerName: { type: String, required: true },
  status:     { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true })

export const ConnectionRequest = mongoose.model<IConnectionRequest>('ConnectionRequest', ConnectionRequestSchema)
