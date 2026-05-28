import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import { User } from './models/User'

async function setAdmin() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mantoudj_bladi')

  const phone = process.argv[2] || '0555000000'
  const superFlag = process.argv[3] === '--super'
  const user = await User.findOneAndUpdate(
    { phone },
    { isAdmin: true, ...(superFlag ? { isSuperAdmin: true } : {}) },
    { new: true }
  )

  if (user) {
    const level = (user as any).isSuperAdmin ? 'مشرف عام' : 'مشرف'
    console.log(`✅ تم منح صلاحية ${level} للحساب: ${user.name} (${user.phone})`)
  } else {
    console.log(`❌ لم يُعثر على حساب بالرقم: ${phone}`)
  }

  await mongoose.disconnect()
}

setAdmin().catch(e => { console.error(e); process.exit(1) })
