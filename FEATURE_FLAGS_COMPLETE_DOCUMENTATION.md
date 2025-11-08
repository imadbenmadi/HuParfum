# Feature Flag System - Complete Documentation

## Overview

A flexible, extensible feature flag management system that allows admins to toggle features on/off without code changes. Currently implements email verification status control with 3 states: `required`, `optional`, and `disabled`.

---

## Architecture

### Database Layer

**File:** `backend/src/models/FeatureFlag.js`

-   Stores feature flag metadata
-   Supports flexible JSON configuration
-   ENUM status for type safety

**Columns:**

-   `feature_name` (STRING, UNIQUE): Feature identifier
-   `status` (ENUM): `required` | `optional` | `disabled`
-   `description` (TEXT): Human-readable description
-   `config` (JSON): Provider-specific settings
-   `created_at`, `updated_at`: Timestamps

### Backend Service Layer

**File:** `backend/src/utils/featureFlags.js`

**Core Functions:**

```javascript
// Get feature status
getFeatureStatus(featureName) → {status, config, exists}

// Check feature state
isFeatureRequired(featureName) → boolean
isFeatureEnabled(featureName) → boolean

// Manage features
getAllFeatures() → [features]
setFeatureStatus(name, status, config) → {success, feature}
updateFeatureConfig(name, config) → {success, feature}
deleteFeature(name) → {success, message}

// Initialize defaults
initializeDefaultFeatures() → void
```

### Backend API Layer

**File:** `backend/src/controllers/featureController.js`

**Endpoints:**

```
GET    /api/admin/features              → List all features
GET    /api/admin/features/:name        → Get specific feature
PUT    /api/admin/features/:name        → Update status
PUT    /api/admin/features/:name/config → Update config
DELETE /api/admin/features/:name        → Delete feature
GET    /api/features/check/:name        → Check feature (public)
```

### Backend Routes

**File:** `backend/src/routes/features.js`

-   Admin-protected routes for management
-   Public endpoint for frontend checks
-   Request validation with express-validator

### Frontend Service Layer

**File:** `frontend/src/utils/featureFlags.js`

**Core Functions:**

```javascript
// Check feature status (cached)
checkFeatureStatus(featureName) → {status, isRequired, isEnabled, config}

// Email verification specific
shouldRequireEmailVerification() → boolean
shouldShowEmailVerificationPopup() → boolean
shouldSkipEmailVerification() → boolean

// Configuration
getEmailProviderConfig() → {provider, serviceName}

// Admin functions
getAllFeatures(authToken) → [features]
updateFeatureStatus(name, status, authToken) → {success, feature}
updateFeatureConfig(name, config, authToken) → {success, feature}
```

**Features:**

-   5-minute caching to minimize API calls
-   Automatic stale cache clearing
-   Safe fallback defaults

### Frontend Admin UI

**File:** `frontend/src/pages/AdminFeaturesPage.js`

**Features:**

-   List all feature flags
-   Toggle status with single-click buttons
-   Edit feature configuration
-   Real-time updates
-   Arabic localization
-   Error handling with user messages
-   Timestamps for audit trail

---

## Email Verification Implementation

### Current Behavior

```
User Registration
    ↓
Send verification email
    ↓
User tries to login
    ↓
Check email_verification feature status:
    - required: Block, show VerifyEmailPage
    - optional: Allow login + show popup
    - disabled: Skip verification, allow login
```

### Status Meanings

**`required` (Default)**

-   Email verification mandatory
-   User cannot proceed without verification
-   Current production behavior
-   Block login flow until verified

**`optional`**

-   Email verification encouraged but not required
-   Show popup on login
-   User can dismiss and continue
-   Use during email provider migration (Google → Resend)

**`disabled`**

-   Skip email verification completely
-   No popup shown
-   Users bypass verification step
-   Use for temporary access or testing

---

## Integration Steps

### 1. Backend Integration ✅

```javascript
// server.js
const FeatureFlag = require("./models/FeatureFlag");
const featuresRoutes = require("./routes/features");

// Import model and routes
app.use("/api/admin/features", featuresRoutes);

// Initialize features on startup
const featureFlags = require("./utils/featureFlags");
await featureFlags.initializeDefaultFeatures();
```

### 2. Frontend Integration ✅

```javascript
// AdminDashboard.js
import AdminFeaturesPage from "./AdminFeaturesPage";

// Add to nav tabs
{ key: "features", label: "إدارة الميزات", icon: FiToggle2 }

// Add to content area
{activeTab === "features" && <AdminFeaturesPage adminToken={adminToken} />}
```

### 3. Auth Flow Modification (TODO)

```javascript
// authController.js - login() function
const emailVerificationFeature = await featureFlags.getFeatureStatus(
    "email_verification"
);

if (emailVerificationFeature.status === "required" && !user.isEmailVerified) {
    // Block login
    return res.status(403).json({ error: "Email not verified" });
} else if (
    emailVerificationFeature.status === "optional" &&
    !user.isEmailVerified
) {
    // Allow login, frontend shows popup
    return res.json({ user, emailNotVerified: true });
} else if (emailVerificationFeature.status === "disabled") {
    // Skip verification entirely
    return res.json({ user });
}
```

### 4. Frontend Login Flow Modification (TODO)

```javascript
// LoginPage.js
const emailFeature = await shouldRequireEmailVerification();
const shouldShowPopup = await shouldShowEmailVerificationPopup();

if (emailFeature) {
    // Redirect to VerifyEmailPage (current behavior)
} else if (shouldShowPopup) {
    // Show popup but allow continue
    // Modal: "Please verify email for full access"
} else {
    // Skip verification completely
    // Direct to homepage
}
```

---

## Usage Examples

### Admin: Toggle Email Verification to Optional

```javascript
// Via API
PUT http://localhost:5000/api/admin/features/email_verification
Authorization: Bearer <admin_token>
Body: { status: "optional" }

// Via Frontend UI
1. Go to Admin Dashboard
2. Click "إدارة الميزات"
3. Find "email verification"
4. Click "optional" button
5. Feature updates immediately
```

### Admin: Switch Email Provider to Resend

```javascript
// Via API
PUT http://localhost:5000/api/admin/features/email_verification/config
Authorization: Bearer <admin_token>
Body: {
    config: {
        provider: "resend",
        serviceName: "Resend",
        apiKey: "re_xxxxx"
    }
}

// Via Frontend UI
1. Go to Admin Dashboard → Manage Features
2. Find "email verification"
3. Click "تعديل" (Edit) under Settings
4. Update provider field to "resend"
5. Click "حفظ" (Save)
```

### Frontend: Check if Email Verification is Required

```javascript
import { shouldRequireEmailVerification } from "../utils/featureFlags";

// In LoginPage or any auth component
const isRequired = await shouldRequireEmailVerification();

if (isRequired && !user.isEmailVerified) {
    navigate("/verify-email");
} else {
    navigate("/home");
}
```

### Frontend: Show Optional Email Verification Popup

```javascript
import { shouldShowEmailVerificationPopup } from "../utils/featureFlags";

const LoginPage = () => {
    const [showEmailPopup, setShowEmailPopup] = useState(false);

    const handleLogin = async () => {
        // ... login logic
        const shouldShow = await shouldShowEmailVerificationPopup();
        if (shouldShow && !user.isEmailVerified) {
            setShowEmailPopup(true);
        }
    };

    return (
        <>
            {/* Login form */}
            {showEmailPopup && (
                <EmailVerificationPopup
                    onDismiss={() => setShowEmailPopup(false)}
                    onVerify={() => navigate("/verify-email")}
                />
            )}
        </>
    );
};
```

---

## Database Schema

```sql
-- Created by Sequelize (auto-generated)
CREATE TABLE feature_flags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    feature_name VARCHAR(255) UNIQUE NOT NULL,
    status ENUM('required', 'optional', 'disabled') NOT NULL,
    description TEXT,
    config JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Initial data (auto-inserted)
INSERT INTO feature_flags
(feature_name, status, description, config)
VALUES (
    'email_verification',
    'optional',
    'Email verification for user registration',
    '{"provider":"google","serviceName":"Gmail"}'
);
```

---

## Default Features

Automatically initialized on server startup:

### email_verification

-   **Status:** optional
-   **Config:** `{provider: "google", serviceName: "Gmail"}`
-   **Purpose:** Control email verification requirement

---

## Migration Workflow: Google → Resend

### Phase 1: Parallel Running (Week 1)

```
Status: optional
- Gmail still active
- Show popup to users
- Users can dismiss and continue
- No forced verification
```

### Phase 2: Monitor & Adjust (Week 2)

```
Status: optional
- Monitor verification rates
- Resend service integrated in background
- Email service can be switched in config
```

### Phase 3: Resend Primary (Week 3)

```
Status: optional
Config: {provider: "resend", ...}
- Resend sends all new emails
- Users still see optional popup
- Backward compatible
```

### Phase 4: Production Ready (Week 4)

```
Status: required
- All users required to verify
- Resend fully operational
- Gmail can be removed
```

---

## File Structure

```
backend/
├── src/
│   ├── models/
│   │   └── FeatureFlag.js          ✅ Database model
│   ├── controllers/
│   │   └── featureController.js    ✅ API endpoints
│   ├── routes/
│   │   └── features.js             ✅ Route definitions
│   ├── utils/
│   │   └── featureFlags.js         ✅ Service layer
│   └── server.js                   ✅ Modified (routes + init)

frontend/
├── src/
│   ├── pages/
│   │   ├── AdminDashboard.js       ✅ Modified (added features tab)
│   │   └── AdminFeaturesPage.js    ✅ Admin UI
│   └── utils/
│       └── featureFlags.js         ✅ Frontend utilities
```

---

## Testing Checklist

-   [ ] Backend: Feature initialization on startup
-   [ ] Backend: GET /api/admin/features returns all
-   [ ] Backend: PUT /api/admin/features/:name updates status
-   [ ] Backend: PUT /api/admin/features/:name/config updates config
-   [ ] Backend: GET /api/features/check/:name (public endpoint works)
-   [ ] Frontend: AdminFeaturesPage loads features
-   [ ] Frontend: Status buttons toggle feature
-   [ ] Frontend: Config edit/save works
-   [ ] Frontend: Feature checking functions return correct status
-   [ ] Auth Flow: Login respects email_verification status
-   [ ] Email Popup: Shows only when status=optional
-   [ ] Email Block: Shows only when status=required

---

## Performance Considerations

### Caching

-   Frontend caches features for 5 minutes
-   Reduces API calls during user session
-   Automatic stale cache clearing
-   Manual cache clear on admin updates

### Database

-   Minimal queries (indexed unique feature_name)
-   JSON storage for flexible configuration
-   Efficient ENUM for status field

### API

-   Public endpoint `/api/features/check/:name` for frontend
-   Admin endpoints protected with auth middleware
-   Request validation on all endpoints

---

## Future Extensions

### Additional Features to Add

1. **Two-Factor Authentication**

    - Status: required/optional/disabled
    - Config: {method: "sms"|"totp", ...}

2. **Social Login**

    - Status: enabled/disabled
    - Config: {providers: ["google", "facebook"], ...}

3. **Rate Limiting**

    - Status: enabled/disabled
    - Config: {requests_per_minute: 60, ...}

4. **Notification Preferences**
    - Status: enabled/disabled
    - Config: {channels: ["email", "sms", "push"], ...}

### Architecture for New Features

1. Add feature to default initialization
2. Add status checks in relevant controllers
3. Create feature-specific service functions
4. Update frontend pages as needed
5. No database changes needed (JSON config handles it)

---

## Security Notes

### Admin Access

-   All admin endpoints require `requireAdmin` middleware
-   Verify with actual user role checking
-   Currently placeholder (TODO: implement proper auth)

### Rate Limiting

-   Apply to feature check endpoint if public
-   Rate limit admin updates to prevent abuse

### Audit Trail

-   Timestamps auto-tracked (created_at, updated_at)
-   Consider adding change logs table for full audit

---

## Troubleshooting

### Features not initializing

```
Check: featureFlags.initializeDefaultFeatures() called in server.js
Check: FeatureFlag model properly imported
Check: Database synchronization succeeded
```

### Admin can't update features

```
Check: Authorization token is valid admin token
Check: User.isAdmin = true
Check: Body includes valid status (required/optional/disabled)
```

### Frontend feature checks return defaults

```
Check: API_BASE correct in featureFlags.js
Check: /api/features/check/:name endpoint accessible
Check: Browser console for network errors
Check: Cache TTL settings appropriate
```

### Email verification flow not working

```
Check: Feature status actually updated in database
Check: Auth controller checking feature status
Check: Frontend importing correct feature functions
Check: User.isEmailVerified field exists
```

---

## Deployment Checklist

-   [ ] Database migrations run successfully
-   [ ] FeatureFlag table created
-   [ ] Default features initialized
-   [ ] Backend features routes mounted
-   [ ] Frontend AdminFeaturesPage added to dashboard
-   [ ] Auth flow updated to check feature status
-   [ ] Frontend feature checking functions imported
-   [ ] Environment variables configured (API_BASE)
-   [ ] Admin access verified
-   [ ] Testing complete
-   [ ] Documentation updated

---

## Support & Maintenance

### Regular Tasks

1. Monitor feature flag status in production
2. Verify cache is working (check browser network tab)
3. Review audit timestamps for changes
4. Test feature toggles quarterly

### When Adding Features

1. Add default feature in initialization
2. Create feature-specific service functions
3. Update relevant controllers/routes
4. Add frontend checks/UI
5. Document feature behavior

---

## Contact & Questions

For implementation questions or issues:

1. Check troubleshooting section above
2. Review code comments in each file
3. Test with different status values
4. Check browser console and server logs
