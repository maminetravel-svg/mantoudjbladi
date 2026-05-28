import mongoose, { Schema, Document } from 'mongoose'

export interface IConfigItem {
  key: string
  labelAr: string
  emoji: string
  isActive: boolean
  order: number
  image?: string
  subcategory?: string
  hidePlantingDate?: boolean
}

export interface IConfig extends Document {
  configType: string
  items: IConfigItem[]
}

const ConfigItemSchema = new Schema<IConfigItem>({
  key:      { type: String, required: true },
  labelAr:  { type: String, required: true },
  emoji:    { type: String, default: '🌱' },
  isActive:          { type: Boolean, default: true },
  order:             { type: Number, default: 0 },
  image:             { type: String },
  subcategory:       { type: String },
  hidePlantingDate:  { type: Boolean, default: false },
})

const ConfigSchema = new Schema<IConfig>({
  configType: { type: String, required: true, unique: true },
  items:      { type: [ConfigItemSchema], default: [] },
}, { timestamps: true })

export const Config = mongoose.model<IConfig>('Config', ConfigSchema)
