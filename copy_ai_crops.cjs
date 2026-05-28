const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\TRETEC\\.gemini\\antigravity\\brain\\eea2e743-2d04-463f-ac12-c07c2e615879';
const destDir = path.join(__dirname, 'public', 'images', 'crops');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

let count = 0;
const targetCrops = ['tomato', 'potato', 'watermelon', 'pepper', 'onion', 'wheat', 'olive', 'carrot', 'garlic', 'zucchini', 'cucumber', 'lettuce', 'fig', 'grape', 'apple'];

try {
  const files = fs.readdirSync(srcDir);
  files.forEach(file => {
    if (file.endsWith('.png') && !file.startsWith('media__')) {
      const baseName = file.split('_')[0];
      if (targetCrops.includes(baseName)) {
        fs.copyFileSync(path.join(srcDir, file), path.join(destDir, baseName + '.jpg'));
        console.log(`Copied AI generated: ${baseName}.jpg`);
        count++;
      }
    }
  });
  console.log(`Successfully placed ${count} AI-generated high-quality images.`);
} catch (e) {
  console.error("Failed:", e.message);
}
