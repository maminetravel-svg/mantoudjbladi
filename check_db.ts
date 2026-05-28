import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', 'backend', '.env') });

const ConfigSchema = new mongoose.Schema({
  configType: String,
  items: Array
});

const Config = mongoose.model('Config', ConfigSchema);

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mantoudj_bladi');
    const doc = await Config.findOne({ configType: 'gemini' });
    console.log('Gemini Config:', JSON.stringify(doc, null, 2));
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err);
  }
}

check();
