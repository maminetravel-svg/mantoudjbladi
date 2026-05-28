const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mantoudj_bladi').then(async () => {
  const hash = await bcrypt.hash('admin123', 10);
  const db = mongoose.connection.db;
  const result = await db.collection('users').updateOne(
    { phone: '0555000000' },
    { $set: { password: hash, isAdmin: true, role: 'agent', name: 'المشرف العام', wilaya: 'الجزائر' } },
    { upsert: true }
  );
  console.log('Admin user updated:', result);
  process.exit(0);
}).catch(e => { console.error(e); process.exit(1); });
