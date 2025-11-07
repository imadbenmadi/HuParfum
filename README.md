# HuParfum - نظام متجر الريحات الجزائري

**نظام متكامل وشامل لبيع وتوصيل الريحات الفاخرة الجزائرية مع نظام تتبع طلبيات متقدم وإشعارات فورية عبر البريد والتيليجرام**

---

## جدول المحتويات

1. [نظرة عامة](#نظرة-عامة)
2. [المميزات الرئيسية](#المميزات-الرئيسية)
3. [المتطلبات النظامية](#المتطلبات-النظامية)
4. [التثبيت والإعداد](#التثبيت-والإعداد)
5. [بنية المشروع](#بنية-المشروع)
6. [API Documentation](#api-documentation)
7. [معمارية النظام](#معمارية-النظام)
8. [الأمان والحماية](#الأمان-والحماية)
9. [استكشاف الأخطاء](#استكشاف-الأخطاء)
10. [النشر والإنتاج](#النشر-والإنتاج)

---

## نظرة عامة

**HuParfum** هو حل متكامل لرجال الأعمال الجزائريين الذين يرغبون في بيع الريحات الفاخرة عبر الإنترنت. 

النظام يوفر:
- موقع ويب احترافي للعملاء
- لوحة تحكم متقدمة للإدارة
- نظام إشعارات ذكي (بريد + تيليجرام)
- نظام أمان عالي (تشفير + JWT)
- تتبع طلبيات فوري
- محتوى 100% بالدارجة الجزائرية

---

## المميزات الرئيسية

### للعملاء
- تصفح المنتوجات بسهولة
- سلة تسوق مرنة
- نظام دفع آمن
- تتبع الطلبيات في الوقت الفعلي
- ربط حساب التيليجرام للإشعارات
- الحصول على تحديثات عبر البريد والبوت

### للإدارة
- لوحة تحكم شاملة
- إدارة الطلبيات والحالات
- إدارة المنتوجات والمخزون
- إحصائيات المبيعات
- إدارة المستخدمين
- تنبيهات فورية للطلبيات الجديدة

### للأمان
- تشفير كامل (bcrypt + JWT + AES-256)
- معدلات حماية من الهجمات
- رؤوس أمان HTTP
- التحقق من الهوية الثنائي
- جلسات آمنة محدودة الوقت

---

## المتطلبات النظامية

### الخادم
- Node.js v18 أو أحدث
- npm أو yarn
- MySQL v5.7 أو أحدث
- OpenSSL (للتشفير)

### البريئة
- Node.js v18+
- npm أو yarn
- متصفح حديث (Chrome, Firefox, Safari, Edge)

### الخدمات الخارجية
- حساب Gmail (للبريد الإلكتروني)
- رمز Telegram Bot API
- (اختياري) بوابة دفع

---

## التثبيت والإعداد

### 1. استنساخ المشروع

```bash
cd c:\Users\imed\Desktop
git clone <repository-url> HuParfum
cd HuParfum
```

### 2. إعداد قاعدة البيانات

```bash
# تسجيل الدخول إلى MySQL
mysql -u root -p

# إنشاء قاعدة البيانات
CREATE DATABASE huparfum_db;
CREATE USER 'huparfum'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON huparfum_db.* TO 'huparfum'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# استيراد الجداول
mysql -u huparfum -p huparfum_db < database/schema.sql
mysql -u huparfum -p huparfum_db < database/seeds.sql
```

### 3. إعداد الخادم (Backend)

```bash
cd backend
npm install
```

أنشئ ملف `.env` من `.env.example`:

```bash
# قاعدة البيانات
DB_HOST=localhost
DB_USER=huparfum
DB_PASSWORD=secure_password
DB_NAME=huparfum_db
DB_PORT=3306

# الخادم
PORT=5000
NODE_ENV=development

# JWT والتشفير
JWT_SECRET=your-super-secret-key-min-32-characters-here
ENCRYPTION_KEY=your-encryption-key-exactly-32-chars

# البريد الإلكتروني
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=HuParfum <no-reply@huparfum.com>

# بوتات التيليجرام
USER_BOT_TOKEN=your-user-bot-token
OPS_BOT_TOKEN=your-ops-bot-token
HOUDA_TELEGRAM_ID=your-telegram-id

# رابط الأمام
FRONTEND_URL=http://localhost:3000
```

ابدأ الخادم:

```bash
npm start
# أو للتطوير مع مراقبة التغييرات:
npm run dev
```

### 4. إعداد الواجهة (Frontend)

```bash
cd frontend
npm install
npm start
```

الواجهة ستفتح على `http://localhost:3000`

---

## بنية المشروع

```
HuParfum/
│
├─ backend/
│  ├─ src/
│  │  ├─ config/
│  │  │  └─ database.js              # اتصال MySQL و Sequelize
│  │  │
│  │  ├─ models/
│  │  │  ├─ User.js                  # نموذج المستخدم
│  │  │  ├─ Product.js               # نموذج المنتج
│  │  │  ├─ Order.js                 # نموذج الطلب
│  │  │  └─ Admin.js                 # نموذج المسؤول
│  │  │
│  │  ├─ controllers/
│  │  │  ├─ authController.js        # التسجيل والدخول
│  │  │  ├─ orderController.js       # إدارة الطلبيات
│  │  │  └─ adminController.js       # إدارة النظام
│  │  │
│  │  ├─ routes/
│  │  │  ├─ auth.js                  # مسارات المصادقة
│  │  │  ├─ orders.js                # مسارات الطلبيات
│  │  │  ├─ admin.js                 # مسارات الإدارة
│  │  │  └─ telegram.js              # مسارات التيليجرام
│  │  │
│  │  ├─ middlewares/
│  │  │  ├─ auth.js                  # التحقق من الرموز
│  │  │  └─ rateLimiter.js           # حماية من الهجمات
│  │  │
│  │  ├─ notifications/
│  │  │  ├─ emailService.js          # خدمة البريد
│  │  │  ├─ telegramUserBot.js       # بوت العملاء
│  │  │  └─ telegramOpsBot.js        # بوت الإدارة
│  │  │
│  │  ├─ utils/
│  │  │  ├─ encryption.js            # التشفير وفك التشفير
│  │  │  └─ jwt.js                   # إنشاء والتحقق من الرموز
│  │  │
│  │  └─ server.js                   # نقطة البداية
│  │
│  ├─ package.json
│  ├─ .env.example
│  └─ .env.production
│
├─ frontend/
│  ├─ src/
│  │  ├─ pages/
│  │  │  ├─ HomePage.js              # الصفحة الرئيسية
│  │  │  ├─ ProductsPage.js          # تصفح المنتجات
│  │  │  ├─ CartPage.js              # سلة التسوق
│  │  │  ├─ LoginPage.js             # تسجيل الدخول
│  │  │  ├─ RegisterPage.js          # إنشاء حساب
│  │  │  ├─ VerifyEmailPage.js       # التحقق من البريد
│  │  │  ├─ MyOrdersPage.js          # الطلبيات الخاصة بي
│  │  │  └─ AdminDashboard.js        # لوحة التحكم
│  │  │
│  │  ├─ App.js                      # المكون الرئيسي
│  │  ├─ App.css                     # الأنماط العامة
│  │  ├─ config.js                   # إعدادات الاتصال
│  │  └─ index.js                    # نقطة الدخول
│  │
│  ├─ package.json
│  └─ public/
│
├─ database/
│  ├─ schema.sql                     # تصميم الجداول
│  └─ seeds.sql                      # بيانات تجريبية
│
└─ README.md                          # هذا الملف

```

---

## API Documentation

### Base URL

```
http://localhost:5000/api
```

### مسارات المصادقة

#### POST /auth/register
إنشاء حساب جديد

**الطلب:**
```json
{
    "name": "أحمد محمد",
    "phone": "+213 555 123 456",
    "email": "ahmed@example.com",
    "password": "password123",
    "passwordConfirm": "password123"
}
```

**الرد:**
```json
{
    "success": true,
    "message": "تمّ التسجيل بنجاح! شوف بريدك باش تأكّد الحساب",
    "user": {
        "id": 1,
        "name": "أحمد محمد",
        "email": "ahmed@example.com",
        "phone": "+213 555 123 456"
    }
}
```

---

#### POST /auth/verify-email
التحقق من البريد الإلكتروني

**الطلب:**
```json
{
    "token": "verification-token-from-email"
}
```

**الرد:**
```json
{
    "success": true,
    "message": "تمّ التأكيد بنجاح! يمكنك الدخول الآن",
    "user": {
        "id": 1,
        "verified": true
    }
}
```

---

#### POST /auth/login
تسجيل الدخول

**الطلب:**
```json
{
    "email": "ahmed@example.com",
    "password": "password123"
}
```

**الرد:**
```json
{
    "success": true,
    "message": "مرحبا بك!",
    "token": "jwt-token-here",
    "user": {
        "id": 1,
        "name": "أحمد محمد",
        "email": "ahmed@example.com"
    }
}
```

---

#### GET /auth/profile
الحصول على بيانات الحساب (محمي)

**رؤوس الطلب:**
```
Authorization: Bearer jwt-token-here
```

**الرد:**
```json
{
    "success": true,
    "user": {
        "id": 1,
        "name": "أحمد محمد",
        "email": "ahmed@example.com",
        "phone": "+213 555 123 456",
        "verified": true,
        "telegram_linked": false,
        "created_at": "2024-01-15T10:30:00Z"
    }
}
```

---

### مسارات الطلبيات

#### POST /orders/create
إنشاء طلب جديد (محمي)

**الطلب:**
```json
{
    "products": [
        {
            "product_id": 1,
            "quantity": 2
        }
    ],
    "total_price": 15000,
    "customer_name": "أحمد",
    "customer_phone": "+213 555 123 456"
}
```

**الرد:**
```json
{
    "success": true,
    "message": "تمّ حفظ الطلب بنجاح! الله يسهّل",
    "order": {
        "id": 5,
        "order_number": "ORD-20240115-001",
        "status": "requested",
        "total_price": 15000,
        "created_at": "2024-01-15T10:30:00Z"
    }
}
```

---

#### GET /orders/my-orders
الحصول على طلبياتي (محمي)

**الرد:**
```json
{
    "success": true,
    "orders": [
        {
            "id": 5,
            "order_number": "ORD-20240115-001",
            "status": "delivering",
            "total_price": 15000,
            "products": [
                {
                    "name": "ريحة الورد الجميل",
                    "quantity": 2,
                    "price": 7500
                }
            ],
            "created_at": "2024-01-15T10:30:00Z"
        }
    ]
}
```

---

#### GET /orders/:id
الحصول على تفاصيل طلب واحد (محمي)

**الرد:**
```json
{
    "success": true,
    "order": {
        "id": 5,
        "order_number": "ORD-20240115-001",
        "status": "delivering",
        "status_text": "الطلب خاريج للتوصيل",
        "total_price": 15000,
        "customer_name": "أحمد",
        "customer_phone": "+213 555 123 456",
        "products": [...],
        "telegram_linked": false,
        "created_at": "2024-01-15T10:30:00Z"
    }
}
```

---

### مسارات الإدارة

#### POST /admin/login
تسجيل دخول المسؤول

**الطلب:**
```json
{
    "email": "admin@huparfum.com",
    "password": "admin-password"
}
```

**الرد:**
```json
{
    "success": true,
    "token": "admin-jwt-token",
    "admin": {
        "id": 1,
        "name": "هدى",
        "email": "admin@huparfum.com",
        "role": "super_admin"
    }
}
```

---

#### GET /admin/stats
الإحصائيات (محمي)

**الرد:**
```json
{
    "success": true,
    "stats": {
        "total_orders": 45,
        "today_orders": 5,
        "pending_orders": 8,
        "completed_orders": 37,
        "total_revenue": 450000,
        "total_users": 23,
        "average_order_value": 10000
    }
}
```

---

#### GET /admin/orders
جميع الطلبيات (محمي)

**الرد:**
```json
{
    "success": true,
    "orders": [
        {
            "id": 5,
            "order_number": "ORD-20240115-001",
            "status": "requested",
            "customer_name": "أحمد",
            "customer_phone": "+213 555 123 456",
            "customer_email": "ahmed@example.com",
            "total_price": 15000,
            "telegram_linked": false,
            "created_at": "2024-01-15T10:30:00Z"
        }
    ]
}
```

---

#### PUT /admin/orders/:id/status
تحديث حالة الطلب (محمي)

**الطلب:**
```json
{
    "status": "delivering"
}
```

**الرد:**
```json
{
    "success": true,
    "message": "تمّ تحديث حالة الطلب بنجاح",
    "order": {
        "id": 5,
        "status": "delivering",
        "status_text": "الطلب خاريج للتوصيل"
    }
}
```

---

### حالات الطلب

الطلب يمر بـ 5 حالات:

| الحالة | النص العربي | الوصف |
|--------|-----------|-------|
| requested | جديد | الطلب جديد ومقبول |
| under_discussion | قيد المناقشة | جاري التحضير والتجهيز |
| payed | الدفع تمّ | تم الدفع بنجاح |
| delivering | خاريج للتوصيل | الطلب في الطريق |
| delivered_successfully | توصّل بالخير | الطلب وصل بسلام |

---

### معدلات الحماية

- عام: 100 طلب / 15 دقيقة
- مصادقة: 5 طلبات / 15 دقيقة
- Webhook: 50 طلب / دقيقة

---

## معمارية النظام

### البنية العامة

```
المستخدم (المتصفح)
        |
        | HTTPS
        |
    [Nginx Reverse Proxy]
        |
        |
[Express.js API Server]
        |
        +-- [Sequelize ORM]
        |        |
        |    [MySQL Database]
        |
        +-- [Nodemailer]
        |        |
        |    [Gmail SMTP]
        |
        +-- [Telegram Bot API]
        |        |
        |    [Telegram]
```

### تدفق العملية

#### عملية التسجيل:
1. المستخدم يملأ نموذج التسجيل
2. الفرونتند يرسل البيانات إلى `/auth/register`
3. الخادم يتحقق من صحة البيانات
4. الخادم ينشئ حساب وينشر بريد التحقق
5. المستخدم يؤكد بريده
6. الحساب يصبح نشطاً

#### عملية الطلب:
1. المستخدم يختار المنتجات ويضيفها للسلة
2. يضغط "شراء"
3. الفرونتند يرسل الطلب إلى `/orders/create`
4. الخادم ينشئ الطلب في قاعدة البيانات
5. البريد يُرسل للعميل تلقائياً
6. التنبيه يُرسل لمسؤول التيليجرام
7. المسؤول يحدّث حالة الطلب
8. العميل يتلقى إشعارات بريدية وتيليجرام

---

## الأمان والحماية

### تشفير كلمات المرور
```javascript
// bcryptjs - salt rounds: 10
const hashedPassword = await bcrypt.hash(password, 10);
```

### الرموز الآمنة (JWT)
```javascript
// توقيع وتشفير
const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
```

### تشفير الربط العميق
```javascript
// AES-256-CBC
const encrypted = crypto.createCipheriv('aes-256-cbc', key, iv);
```

### معدلات الحماية
- فشل محاولات عديدة يؤدي لحظر مؤقت
- محاولات غير مشفرة مرفوضة
- الجلسات محدودة الوقت

---

## استكشاف الأخطاء

### المشكلة: خطأ في قاعدة البيانات

**الحل:**
```bash
# تحقق من خدمة MySQL
mysql -u root -p

# تحقق من البيانات في .env
cat backend/.env

# أعد تشغيل الخادم
npm start
```

---

### المشكلة: لا يتم استقبال البريد

**الحل:**
1. تحقق من بيانات Gmail في `.env`
2. فعّل كلمة مرور التطبيق (ليس كلمة المرور الرئيسية)
3. قلل مستوى الأمان مؤقتاً للاختبار
4. تحقق من سجلات الخادم: `npm run dev`

---

### المشكلة: لا يعمل البوت

**الحل:**
1. تحقق من الرموز في `.env`
2. اختبر البوت على التيليجرام مباشرة
3. تأكد من معرّف التيليجرام الصحيح
4. تحقق من الإنترنت على الخادم

---

### المشكلة: خطأ CORS

**الحل:**
```bash
# تأكد من FRONTEND_URL في backend/.env
# تأكد من API_URL في frontend/src/config.js
```

---

## النشر والإنتاج

### متطلبات الخادم VPS

- OS: Linux (Ubuntu 20.04 أو أحدث)
- RAM: 2GB على الأقل
- CPU: 1 Core على الأقل
- Disk: 20GB على الأقل
- Bandwidth: 1TB على الأقل

### خطوات النشر

#### 1. الإعداد الأولي

```bash
# تحديث النظام
sudo apt-get update
sudo apt-get upgrade

# تثبيت Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# تثبيت MySQL
sudo apt-get install -y mysql-server

# تثبيت Nginx
sudo apt-get install -y nginx

# تثبيت PM2
sudo npm install -g pm2
```

#### 2. إعداد الدومين والـ SSL

```bash
# تثبيت Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# الحصول على شهادة SSL
sudo certbot certonly --nginx -d yourdomain.com

# التجديد التلقائي
sudo systemctl enable certbot.timer
```

#### 3. نشر الكود

```bash
cd /var/www
sudo git clone <repository-url> huparfum
cd huparfum/backend

# تثبيت المكتبات
npm install --production

# إعداد البيئة
sudo nano .env
```

#### 4. تكوين قاعدة البيانات

```bash
# استيراد الجداول
mysql -u root -p huparfum_db < ../database/schema.sql
```

#### 5. بدء التطبيق

```bash
pm2 start src/server.js --name "huparfum-backend" --watch
pm2 save
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup
```

#### 6. تكوين Nginx

```bash
sudo nano /etc/nginx/sites-available/huparfum
```

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /var/www/huparfum/frontend/build;
        try_files $uri $uri/ /index.html;
    }
}

server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

```bash
# فعّل الموقع
sudo ln -s /etc/nginx/sites-available/huparfum /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## المتغيرات البيئية الإنتاجية

```env
# البيئة
NODE_ENV=production

# قاعدة البيانات
DB_HOST=localhost
DB_USER=huparfum
DB_PASSWORD=<strong-password>
DB_NAME=huparfum_db
DB_PORT=3306

# الخادم
PORT=5000
FRONTEND_URL=https://yourdomain.com

# JWT والتشفير
JWT_SECRET=<min-32-char-random-string>
ENCRYPTION_KEY=<exactly-32-char-random-string>

# البريد
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# التيليجرام
USER_BOT_TOKEN=<your-bot-token>
OPS_BOT_TOKEN=<your-bot-token>
HOUDA_TELEGRAM_ID=<your-id>
```

---

## قائمة المراجعة قبل الإطلاق

- [ ] قرأت التوثيق الكامل
- [ ] ثبّت جميع المكتبات
- [ ] أنشأت قاعدة البيانات
- [ ] أضفت متغيرات البيئة الصحيحة
- [ ] اختبرت المصادقة
- [ ] اختبرت إنشاء طلب
- [ ] اختبرت إرسال البريد
- [ ] اختبرت بوت التيليجرام
- [ ] اختبرت لوحة التحكم
- [ ] تحققت من الأخطاء
- [ ] جهزت الخادم الإنتاجي
- [ ] شغّلت HTTPS
- [ ] نسّقت الألوان والشعارات
- [ ] أضفت منتجاتك الحقيقية
- [ ] اختبرت البدء النهائي

---

## الدعم والمساعدة

للحصول على الدعم:

- البريد: info@huparfum.com
- التيليجرام: @houda
- الهاتف: +213 XXX XXX XXX

---

## الترخيص

هذا المشروع خاص ومحفوظ لأغراض HuParfum.

---

**آخر تحديث: نوفمبر 2024**

*صُنعت بعناية ودقة لأفضل أداء*
