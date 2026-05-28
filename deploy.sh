#!/bin/bash
set -e

VPS_USER="root"
VPS_HOST="194.135.88.105"
VPS_DIR="/var/www/mantoudj-bladi"
FRONTEND_URL="https://mantoudj.rflydz.com"

echo ""
echo "══════════════════════════════════════════════"
echo "  🌾 نشر منتوج بلادي → mantoudj.rflydz.com"
echo "══════════════════════════════════════════════"

echo ""
echo "📦 [1/4] بناء الـ Frontend..."
npm run build

echo ""
echo "📦 [2/4] بناء الـ Backend..."
cd backend && npm run build && cd ..

echo ""
echo "🚀 [3/4] رفع الملفات..."

# Clear remote dirs first, then upload
ssh ${VPS_USER}@${VPS_HOST} "rm -rf ${VPS_DIR}/frontend/* ${VPS_DIR}/backend/dist/*"

# Upload frontend
scp -r ./dist/* ${VPS_USER}@${VPS_HOST}:${VPS_DIR}/frontend/

# Upload backend dist
scp -r ./backend/dist/* ${VPS_USER}@${VPS_HOST}:${VPS_DIR}/backend/dist/

# Upload backend package.json and ecosystem config
scp ./backend/package.json ${VPS_USER}@${VPS_HOST}:${VPS_DIR}/backend/
scp ./ecosystem.config.js  ${VPS_USER}@${VPS_HOST}:${VPS_DIR}/

echo ""
echo "♻️  [4/4] إعادة تشغيل PM2..."
ssh ${VPS_USER}@${VPS_HOST} "
  cd ${VPS_DIR}/backend && npm install --production --silent
  cd ${VPS_DIR}
  pm2 start ecosystem.config.js --env production --update-env
  pm2 save
"

echo ""
echo "══════════════════════════════════════════════"
echo "  ✅ تم النشر → https://mantoudj.rflydz.com"
echo "══════════════════════════════════════════════"
