# HuParfum Complete API Testing Guide

## 🚀 Quick Start

### System Status

-   ✅ **Backend Server**: Running on http://localhost:5001
-   ✅ **Frontend Application**: Running on http://localhost:3002
-   ✅ **Database**: MySQL connected and seeded
-   ✅ **Swagger Docs**: http://localhost:5001/api-docs

### Access Testing Tools

1. **Interactive API Tester**: http://localhost:3002/testing → "🚀 Interactive API Tester"
2. **Swagger UI**: http://localhost:5001/api-docs
3. **Testing Hub**: http://localhost:3002/testing

---

## 🔐 Authentication Setup

### Admin Credentials (Pre-seeded)

```
Email: admin@huparfum.com
Password: admin-password
Role: super_admin
```

### Alternative Admin Accounts

```
Manager:
- Email: manager@huparfum.com
- Password: manager-password
- Role: admin

Moderator:
- Email: moderator@huparfum.com
- Password: moderator-password
- Role: moderator
```

### Test User Credentials

```
User 1:
- Email: test@example.com
- Password: Test@12345

User 2:
- Email: john@example.com
- Password: John@12345
```

---

## 📋 API Testing Workflow

### Step 1: Admin Login

1. Open http://localhost:3002/testing
2. Click "🚀 Interactive API Tester"
3. Find "Authentication" section
4. Select "Admin Login" endpoint
5. Request body should be pre-filled:

```json
{
    "email": "admin@huparfum.com",
    "password": "admin-password"
}
```

6. Click "🧪 Test Endpoint"
7. Copy the returned `token` from the response

### Step 2: Configure Authentication

1. Paste the admin token in the "Admin Token" field at the top of the API Tester
2. Save it (it will persist in browser storage)
3. All authenticated endpoints will now work

### Step 3: Test Protected Endpoints

Now you can test any endpoint marked with a "⚠️ This endpoint requires authentication"

---

## 🏪 Core API Endpoints

### Authentication Routes

```
POST   /api/auth/admin-login          - Login as admin
POST   /api/auth/register             - Register new user
POST   /api/auth/login                - Login as regular user
GET    /api/auth/profile              - Get current user profile
```

### Products (Admin Only)

```
GET    /api/admin/products            - Get all products
POST   /api/admin/products            - Create new product
GET    /api/admin/products/:id        - Get product details
PUT    /api/admin/products/:id        - Update product
DELETE /api/admin/products/:id        - Delete product
```

### Settings Management

```
GET    /api/settings/:key             - Get public setting
GET    /api/settings/category/:cat    - Get settings by category (public)
GET    /api/admin/settings            - Get all settings (admin)
PUT    /api/admin/settings/:key       - Update setting (admin)
PATCH  /api/admin/settings/:key       - Update setting fields (admin)
POST   /api/admin/settings/:key/reset - Reset setting (admin)
DELETE /api/admin/settings/:key       - Delete setting (admin)
```

### Orders

```
GET    /api/orders                    - Get my orders (user)
POST   /api/orders                    - Create new order
GET    /api/admin/orders              - Get all orders (admin)
PUT    /api/admin/orders/:id/status   - Update order status (admin)
```

### Admin Dashboard

```
GET    /api/admin/stats               - Get dashboard statistics
GET    /api/admin/features            - Get feature flags
PUT    /api/admin/features/:id        - Update feature flag
```

### Health Check

```
GET    /health                        - Health check endpoint
```

---

## 🧪 Comprehensive Test Scenarios

### Scenario 1: Complete Authentication Flow

**Test 1.1: Register New User**

```
Method: POST
Endpoint: /api/auth/register
Body:
{
  "name": "New User",
  "email": "newuser@example.com",
  "phone": "0123456789",
  "password": "NewUser@12345"
}
Expected Response: 200 OK with user data
```

**Test 1.2: Login as New User**

```
Method: POST
Endpoint: /api/auth/login
Body:
{
  "email": "newuser@example.com",
  "password": "NewUser@12345"
}
Expected Response: 200 OK with token and user data
```

**Test 1.3: Get User Profile**

```
Method: GET
Endpoint: /api/auth/profile
Header: Authorization: Bearer {user_token}
Expected Response: 200 OK with user profile
```

---

### Scenario 2: Product Management (Admin)

**Test 2.1: Get All Products**

```
Method: GET
Endpoint: /api/admin/products
Header: Authorization: Bearer {admin_token}
Expected Response: 200 OK with array of products
```

**Test 2.2: Create New Product**

```
Method: POST
Endpoint: /api/admin/products
Header: Authorization: Bearer {admin_token}
Body:
{
  "name": "عطر جديد",
  "description": "عطر فاخر جديد من HuParfum",
  "price": 5500,
  "image_url": "https://via.placeholder.com/300x300?text=NewPerfume"
}
Expected Response: 201 Created with product data
```

**Test 2.3: Update Product**

```
Method: PUT
Endpoint: /api/admin/products/{product_id}
Header: Authorization: Bearer {admin_token}
Body:
{
  "price": 6000
}
Expected Response: 200 OK with updated product
```

---

### Scenario 3: Website Settings (Admin)

**Test 3.1: Get Public Settings (No Auth)**

```
Method: GET
Endpoint: /api/settings/social_media
Expected Response: 200 OK with social media settings
```

**Test 3.2: Get All Admin Settings**

```
Method: GET
Endpoint: /api/admin/settings
Header: Authorization: Bearer {admin_token}
Expected Response: 200 OK with all settings
```

**Test 3.3: Update Settings**

```
Method: PUT
Endpoint: /api/admin/settings/social_media
Header: Authorization: Bearer {admin_token}
Body:
{
  "value": {
    "telegram": "https://t.me/huparfum_new",
    "instagram": "@huparfum_new",
    "whatsapp": "+213987654321"
  }
}
Expected Response: 200 OK with updated setting
```

**Test 3.4: Get Settings by Category**

```
Method: GET
Endpoint: /api/settings/category/contact
Expected Response: 200 OK with contact settings
```

---

### Scenario 4: Order Management

**Test 4.1: Create Order (User)**

```
Method: POST
Endpoint: /api/orders
Header: Authorization: Bearer {user_token}
Body:
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    }
  ],
  "total_price": 10000
}
Expected Response: 201 Created with order details
```

**Test 4.2: Get User Orders**

```
Method: GET
Endpoint: /api/orders
Header: Authorization: Bearer {user_token}
Expected Response: 200 OK with user's orders
```

**Test 4.3: Get All Orders (Admin)**

```
Method: GET
Endpoint: /api/admin/orders
Header: Authorization: Bearer {admin_token}
Expected Response: 200 OK with all orders
```

---

## 🧬 Database Seeded Data

### Pre-seeded Products (8 items)

1. عطر الورد الفاخر - 5000 DA
2. عطر الياسمين الأصلي - 4500 DA
3. عطر المسك الذهبي - 6000 DA
4. شمعة الفانيلا والعود - 2000 DA
5. شمعة البخور الطبيعية - 2500 DA
6. عطر البرتقال والزنجبيل - 4000 DA
7. شمعة الورد والياسمين - 2800 DA
8. عطر القصب والسنديان - 5500 DA

### Pre-seeded Settings Categories

-   **social_media**: Telegram, Instagram, Facebook, WhatsApp links
-   **contact**: Phone, email, address
-   **homepage**: Hero title, subtitle, CTA text
-   **general**: Site name, description, language
-   **branding**: Logo, colors, theme settings

---

## 🔗 Frontend Testing Checklist

### HomePage (/localhost:3002)

-   [ ] Hero section displays correctly
-   [ ] Products display from API
-   [ ] Social media links work
-   [ ] Navigation bar is visible
-   [ ] "🧪 اختبار" (Testing) button appears in navbar
-   [ ] Clicking "🧪 اختبار" navigates to Testing Hub

### Testing Hub (/localhost:3002/testing)

-   [ ] Page loads successfully
-   [ ] Two testing tools visible (API Tester + Swagger)
-   [ ] Links to both tools work
-   [ ] Database info is displayed
-   [ ] Test scenarios are listed

### Interactive API Tester (/localhost:3002/api-tester)

-   [ ] All endpoint categories expand/collapse
-   [ ] Selecting an endpoint shows details
-   [ ] Request body can be edited
-   [ ] Admin Token field persists data
-   [ ] "🧪 Test Endpoint" button works
-   [ ] Response displays with correct status codes
-   [ ] Copy to clipboard button works
-   [ ] Token is auto-filled from login

### Admin Dashboard (/localhost:3002/admin/dashboard)

-   [ ] Login with admin@huparfum.com works
-   [ ] Token is stored and can be used for API requests
-   [ ] Dashboard tabs visible (Dashboard, Orders, Products, Features, Settings)
-   [ ] Can update website settings
-   [ ] Settings changes reflect in homepage

---

## 📊 Expected API Responses

### Successful Login Response (Status 200)

```json
{
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
        "id": 1,
        "name": "Admin",
        "email": "admin@huparfum.com",
        "role": "super_admin"
    }
}
```

### Successful Product List Response (Status 200)

```json
{
    "success": true,
    "message": "Products retrieved successfully",
    "products": [
        {
            "id": 1,
            "name": "عطر الورد الفاخر",
            "description": "عطر فاخر جزائري من أجود الورود",
            "price": 5000,
            "image_url": "...",
            "created_at": "2025-11-08T..."
        }
    ]
}
```

### Successful Settings Response (Status 200)

```json
{
  "success": true,
  "message": "Settings retrieved successfully",
  "data": {
    "key": "social_media",
    "value": {
      "telegram": "https://t.me/...",
      "instagram": "@huparfum",
      ...
    },
    "category": "social_media"
  }
}
```

---

## ⚠️ Troubleshooting

### Issue: "Cannot connect to backend"

-   Verify backend is running: `http://localhost:5001/health`
-   Check port 5001 is not blocked
-   Verify database connection in backend logs

### Issue: "Admin login fails"

-   Check admin credentials: admin@huparfum.com / admin-password
-   Verify database has admin user (check seeding logs at startup)
-   Check backend logs for auth errors

### Issue: "Settings not updating"

-   Ensure you're logged in as admin
-   Verify token is passed in Authorization header
-   Check that setting key exists

### Issue: "CORS errors"

-   Backend has CORS enabled
-   If issues persist, check browser console
-   Verify frontend is on port 3002, backend on 5001

### Issue: "API Tester not working"

-   Clear browser cache and localStorage
-   Refresh the page
-   Check browser console for errors
-   Verify backend is running

---

## 📝 Testing Checklist

### API Testing

-   [ ] Health check endpoint works
-   [ ] Admin login returns valid token
-   [ ] All product endpoints work (GET, POST, PUT, DELETE)
-   [ ] All settings endpoints work
-   [ ] All order endpoints work (create, get, list)
-   [ ] Protected endpoints require valid token
-   [ ] Invalid token returns 401 Unauthorized
-   [ ] Non-existent endpoints return 404

### Frontend Testing

-   [ ] HomePage loads with dynamic settings
-   [ ] Testing link appears in navbar
-   [ ] API Tester page loads correctly
-   [ ] Testing Hub displays all info
-   [ ] Admin dashboard works
-   [ ] Settings persist after update
-   [ ] Products display correctly

### Database Testing

-   [ ] 8 products seeded correctly
-   [ ] 3 admin accounts created
-   [ ] 2 test users created
-   [ ] Settings initialized
-   [ ] Feature flags created
-   [ ] No duplicate records on restart

---

## 🎯 Next Steps

1. ✅ Test all endpoints using Interactive API Tester
2. ✅ Verify frontend displays dynamic settings
3. ✅ Test admin dashboard functionality
4. ✅ Create sample orders and verify
5. ✅ Update website settings and verify changes
6. ✅ Test with multiple users
7. ✅ Load test the application
8. ✅ Deploy to production

---

## 📞 Support

For issues or questions:

1. Check browser console for errors
2. Check backend logs in terminal
3. Review this guide for common issues
4. Check API responses for error messages

Good luck testing! 🚀
