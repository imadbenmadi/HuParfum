# HuParfum - Perfume E-Commerce Platform

A complete full-stack e-commerce system for selling Algerian perfumes online with order tracking, email notifications, and Telegram bot integration.

---

## Quick Start

### Prerequisites
- Node.js v18+
- MySQL v5.7+
- npm or yarn

### Installation

```bash
# 1. Clone and setup
git clone <repo-url>
cd HuParfum

# 2. Setup Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm start

# 3. In a new terminal, setup Frontend
cd frontend
npm install
npm start
```

### Database Setup

```bash
mysql -u root -p
CREATE DATABASE huparfum_db;
CREATE USER 'huparfum'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON huparfum_db.* TO 'huparfum'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import schema
mysql -u huparfum -p huparfum_db < ../database/schema.sql
```

---

## Project Structure

```
HuParfum/
├── backend/
│   ├── src/
│   │   ├── config/database.js
│   │   ├── models/        (User, Product, Order, Admin)
│   │   ├── controllers/   (auth, orders, admin)
│   │   ├── routes/        (auth, orders, admin, telegram)
│   │   ├── middlewares/   (auth, rateLimiter)
│   │   ├── notifications/ (emailService, telegramUserBot, telegramOpsBot)
│   │   ├── utils/         (encryption, jwt)
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── pages/    (Home, Products, Cart, Login, Register, MyOrders, AdminDashboard)
│   │   ├── App.js
│   │   ├── App.css
│   │   └── config.js
│   └── package.json
│
└── database/
    ├── schema.sql
    └── seeds.sql
```

---

## API Endpoints

### Base URL: `http://localhost:5000/api`

### Auth
- `POST /auth/register` - Create account
- `POST /auth/verify-email` - Verify email with token
- `POST /auth/login` - Login
- `GET /auth/profile` - Get user profile (protected)

### Orders
- `POST /orders/create` - Create new order (protected)
- `GET /orders/my-orders` - Get user's orders (protected)
- `GET /orders/:id` - Get order details (protected)

### Admin
- `POST /admin/login` - Admin login
- `GET /admin/stats` - Get dashboard stats (protected)
- `GET /admin/orders` - Get all orders (protected)
- `PUT /admin/orders/:id/status` - Update order status (protected)

### Order Statuses
| Code | Status |
|------|--------|
| requested | New order |
| under_discussion | In preparation |
| payed | Payment received |
| delivering | In transit |
| delivered_successfully | Delivered |

---

## Environment Variables

### Backend `.env`

```env
# Database
DB_HOST=localhost
DB_USER=huparfum
DB_PASSWORD=password
DB_NAME=huparfum_db
DB_PORT=3306

# Server
PORT=5000
NODE_ENV=development

# Security
JWT_SECRET=your-secret-key-min-32-characters
ENCRYPTION_KEY=exactly-32-character-key-here

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=app-password
EMAIL_FROM=HuParfum <noreply@huparfum.com>

# Telegram
USER_BOT_TOKEN=your-bot-token
OPS_BOT_TOKEN=your-bot-token
HOUDA_TELEGRAM_ID=your-telegram-id

# Frontend
FRONTEND_URL=http://localhost:3000
```

---

## Tech Stack

**Backend:**
- Node.js + Express.js
- MySQL + Sequelize ORM
- JWT Authentication
- bcryptjs for password hashing
- Nodemailer for emails
- Telegram Bot API

**Frontend:**
- React v18
- React Router v6
- CSS Grid/Flexbox (RTL)
- localStorage for client-side storage

**Database:**
- MySQL with 4 main tables (users, products, orders, admins)
- 6 foreign key relationships
- 7 performance indexes

---

## Security Features

- Password hashing with bcryptjs (salt rounds: 10)
- JWT tokens (7-day expiry)
- AES-256-CBC encryption for Telegram links
- Rate limiting on auth endpoints (5 req/15min)
- General rate limiting (100 req/15min)
- CORS enabled
- HTTP security headers (Helmet)

---

## Notifications

### Email Service
- Email verification
- Order confirmation
- Payment confirmation
- Delivery notifications
- Delivery complete

### Telegram Bots
- User bot: `/start` (link account), `/status` (check orders)
- Admin bot: alerts for new orders, linking events, status changes

---

## Development Commands

### Backend
```bash
npm start          # Start production server
npm run dev        # Start with nodemon (watches for changes)
```

### Frontend
```bash
npm start          # Start dev server (http://localhost:3000)
npm run build      # Build for production
```

### Database
```bash
mysql -u huparfum -p huparfum_db < schema.sql
mysql -u huparfum -p huparfum_db < seeds.sql
```

---

## Testing

### User Registration & Login
```bash
POST /auth/register
{
  "name": "John Doe",
  "phone": "+213 555 123 456",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

### Create Order
```bash
POST /orders/create
Authorization: Bearer <token>
{
  "products": [{"product_id": 1, "quantity": 2}],
  "total_price": 15000,
  "customer_name": "John",
  "customer_phone": "+213 555 123 456"
}
```

### Admin Login
```bash
POST /admin/login
{
  "email": "admin@huparfum.com",
  "password": "admin-password"
}
```

---

## Common Issues

### Database Connection Error
```bash
# Check MySQL is running
mysql -u root -p
# Verify .env credentials
cat backend/.env
```

### Email Not Sending
- Use Gmail app password (not main password)
- Enable "Less secure app access" temporarily
- Check console logs: `npm run dev`

### Telegram Bot Not Working
- Verify token in `.env`
- Test bot directly on Telegram
- Check internet connection

### CORS Error
- Ensure FRONTEND_URL in backend/.env matches your frontend URL
- Verify API_URL in frontend/src/config.js

---

## Production Deployment

### Prerequisites
- Ubuntu 20.04+ VPS
- 2GB RAM minimum
- Node.js v18+
- MySQL v5.7+
- Nginx
- SSL certificate

### Steps

```bash
# 1. Update system
sudo apt-get update && sudo apt-get upgrade -y

# 2. Install dependencies
sudo apt-get install -y nodejs mysql-server nginx

# 3. Install PM2
sudo npm install -g pm2

# 4. Clone repo
cd /var/www
sudo git clone <repo-url> huparfum

# 5. Setup backend
cd huparfum/backend
npm install --production
sudo nano .env  # Configure for production

# 6. Setup database
mysql -u root -p huparfum_db < ../database/schema.sql

# 7. Start with PM2
pm2 start src/server.js --name "huparfum"
pm2 save

# 8. Configure Nginx as reverse proxy
sudo nano /etc/nginx/sites-available/huparfum
# Add proxy config pointing to localhost:5000
sudo systemctl restart nginx

# 9. Setup SSL with Let's Encrypt
sudo certbot certonly --nginx -d yourdomain.com
```

### Nginx Config

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
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

---

## Database Schema

**Users Table**
- id, name, email, phone, password, verified, telegram_linked, telegram_username, created_at

**Products Table**
- id, name, description, price, image_url

**Orders Table**
- id, order_number, user_id, status (enum), total_price, telegram_linked, created_at

**Admins Table**
- id, name, email, password, role (super_admin, admin, moderator)

---

## File Sizes

- Total files: 50+
- Backend code: ~3000 lines
- Frontend code: ~1500 lines
- Documentation: complete
- Database schema: included with sample data

---

## Next Steps

- [ ] Configure .env with your credentials
- [ ] Setup database
- [ ] Test backend endpoints with Postman
- [ ] Test frontend UI
- [ ] Configure Telegram bots
- [ ] Setup email service
- [ ] Deploy to production

---

## Notes

- Frontend is RTL (Right-to-Left) for Arabic text
- All user-facing text is in Arabic Darja
- System uses localStorage for cart persistence
- JWT tokens expire after 7 days
- Rate limiting prevents brute force attacks
- All passwords are bcrypt hashed
- All sensitive data is encrypted

---

**Created:** November 2024  
**Status:** Production Ready
