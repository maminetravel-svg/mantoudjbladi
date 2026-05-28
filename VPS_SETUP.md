# دليل تثبيت الخادم (VPS Setup Guide)

## المتطلبات
- VPS بنظام Ubuntu 22.04 أو Debian 12
- ذاكرة: 1GB RAM كحد أدنى (2GB مستحسن)
- تخزين: 20GB

---

## الخطوة 1: تجهيز الـ VPS (SSH إلى الخادم)

```bash
# تحديث النظام
apt update && apt upgrade -y

# تثبيت Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# تثبيت MongoDB
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt update && apt install -y mongodb-org
systemctl start mongod && systemctl enable mongod

# تثبيت PM2 و Nginx
npm install -g pm2
apt install -y nginx

# إنشاء مجلد التطبيق
mkdir -p /var/www/mantoudj-bladi/{frontend,backend/uploads}
mkdir -p /var/log/mantoudj
```

---

## الخطوة 2: إعداد البيئة

```bash
# إنشاء ملف .env للـ backend
nano /var/www/mantoudj-bladi/backend/.env
```

أضف هذا المحتوى (عدّل القيم):
```
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb://localhost:27017/mantoudj_bladi
JWT_SECRET=اكتب_مفتاح_سري_طويل_هنا_مثلا_60_حرف_عشوائي
FRONTEND_URL=http://IP_الخاص_بك
```

---

## الخطوة 3: إعداد Nginx

```bash
# نسخ إعدادات Nginx
cp /var/www/mantoudj-bladi/nginx.conf /etc/nginx/sites-available/mantoudj-bladi

# تعديل اسم الخادم
nano /etc/nginx/sites-available/mantoudj-bladi
# غيّر YOUR_DOMAIN_OR_IP بـ IP الخاص بك

# تفعيل الموقع
ln -s /etc/nginx/sites-available/mantoudj-bladi /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# اختبار وإعادة تشغيل
nginx -t && systemctl reload nginx
```

---

## الخطوة 4: نشر التطبيق من جهازك المحلي

```bash
# على جهازك (Windows) — في مجلد المشروع:
# عدّل VPS_IP في deploy.sh أولاً
bash deploy.sh
```

---

## الخطوة 5: تهيئة قاعدة البيانات

```bash
# على الـ VPS
cd /var/www/mantoudj-bladi/backend
NODE_ENV=production node -e "
const { execSync } = require('child_process');
"
# أو شغّل الـ seed:
cd /var/www/mantoudj-bladi/backend
node dist/seed.js
```

---

## الخطوة 6: التحقق من عمل كل شيء

```bash
# حالة PM2
pm2 status
pm2 logs mantoudj-bladi-api --lines 50

# اختبار الـ API
curl http://localhost:3001/api/health

# اختبار Nginx
curl http://IP_الخاص_بك/api/health
```

---

## تثبيت التطبيق على الهاتف (PWA)

### Android:
1. افتح المتصفح Chrome
2. اذهب إلى `http://IP_الخاص_بك`
3. انقر على ⋮ (القائمة) → **"إضافة إلى الشاشة الرئيسية"**
4. التطبيق سيُثبَّت كتطبيق عادي

### iPhone (Safari):
1. افتح Safari
2. اذهب إلى الموقع
3. انقر على زر المشاركة ↑
4. اختر **"إضافة إلى الشاشة الرئيسية"**

---

## تجديد SSL (HTTPS) مجاني - اختياري

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

---

## أوامر مفيدة

```bash
# إعادة تشغيل الـ backend
pm2 restart mantoudj-bladi-api

# عرض السجلات
pm2 logs mantoudj-bladi-api

# إعادة تشغيل Nginx
systemctl reload nginx

# حالة MongoDB
systemctl status mongod
```
