const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Basic env parser since we don't want to rely on dotenv package if not installed globally
function loadEnv() {
  const envPath = path.join(__dirname, 'backend', '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        process.env[match[1].trim()] = match[2].trim();
      }
    });
  }
}

loadEnv();

const ConfigSchema = new mongoose.Schema({
  configType: String,
  items: Array
});

const Config = mongoose.model('Config', ConfigSchema);

async function check() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mantoudj_bladi';
    console.log('Connecting to:', mongoUri);
    await mongoose.connect(mongoUri);
    const doc = await Config.findOne({ configType: 'gemini' });
    console.log('Gemini Config Result:');
    if (doc) {
      console.log(JSON.stringify(doc, null, 2));
    } else {
      console.log('No gemini config found in database.');
    }
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

check();
