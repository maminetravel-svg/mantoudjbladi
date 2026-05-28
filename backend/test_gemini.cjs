const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const fs = require('fs');

// Basic env parser
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

async function test() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mantoudj_bladi';
    console.log('Connecting to Mongo...');
    await mongoose.connect(mongoUri);
    const doc = await Config.findOne({ configType: 'gemini' });
    const apiKey = doc?.items?.[0]?.labelAr;
    
    if (!apiKey) {
      console.log('No API KEY found in database!');
      return;
    }

    console.log('Key Preview:', apiKey.slice(0, 8) + '...');
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    console.log('Sending test prompt: "Hello"');
    const result = await model.generateContent("Hello");
    const response = await result.response.text();
    console.log('SUCCESS! Response:', response);

  } catch (err) {
    console.log('FAILED!');
    console.log('Error Name:', err.name);
    console.log('Error Message:', err.message);
    if (err.response) {
      console.log('Response Status:', err.response.status);
      console.log('Response Data:', JSON.stringify(err.response.data, null, 2));
    }
  } finally {
    await mongoose.disconnect();
  }
}

test();
