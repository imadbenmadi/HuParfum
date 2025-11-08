# Feature Flags Integration - Auth Flow Implementation Guide

## Quick Start

This guide shows how to integrate the feature flag system into your authentication flow.

---

## 1. Backend: Modify Login Controller

**File:** `backend/src/controllers/authController.js`

### Current Code (Example)

```javascript
exports.login = async (req, res) => {
    try {
        // ... existing login logic ...

        if (!user.isEmailVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email",
            });
        }

        // ... generate token and respond ...
    } catch (err) {
        // ... error handling ...
    }
};
```

### Modified Code (With Feature Flags)

```javascript
const featureFlags = require("../utils/featureFlags");

exports.login = async (req, res) => {
    try {
        // ... existing login logic up to email verification check ...

        // Check email verification feature status
        const emailFeature = await featureFlags.getFeatureStatus(
            "email_verification"
        );

        // Handle based on feature status
        if (emailFeature.status === "required" && !user.isEmailVerified) {
            // REQUIRED: Block login
            return res.status(403).json({
                success: false,
                message: "Please verify your email to continue",
                requiresVerification: true,
            });
        } else if (
            emailFeature.status === "optional" &&
            !user.isEmailVerified
        ) {
            // OPTIONAL: Allow login but notify frontend
            // Generate token
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            return res.json({
                success: true,
                message: "Login successful",
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    isEmailVerified: user.isEmailVerified,
                },
                emailNotVerified: true, // Signal frontend to show popup
            });
        }
        // If disabled or email is verified, continue normally

        // ... generate token and respond normally ...
    } catch (err) {
        // ... error handling ...
    }
};
```

### Key Points

-   Check `emailFeature.status` to determine behavior
-   Return `emailNotVerified: true` in optional case
-   Block with 403 in required case
-   Allow normally if disabled or verified

---

## 2. Backend: Modify Register Controller

**File:** `backend/src/controllers/authController.js`

### Add After Registration

```javascript
const featureFlags = require("../utils/featureFlags");

exports.register = async (req, res) => {
    try {
        // ... existing registration logic ...

        // Check email verification feature
        const emailFeature = await featureFlags.getFeatureStatus(
            "email_verification"
        );

        // Send verification email if feature is enabled
        if (emailFeature.status !== "disabled") {
            await sendVerificationEmail(
                user.email,
                verificationCode,
                emailFeature.config.provider // Use configured provider
            );

            res.status(201).json({
                success: true,
                message: "Registration successful. Check your email.",
                user: {
                    id: user.id,
                    email: user.email,
                },
            });
        } else {
            // Feature disabled - skip email verification
            res.status(201).json({
                success: true,
                message: "Registration successful",
                user: {
                    id: user.id,
                    email: user.email,
                },
                skipEmailVerification: true,
            });
        }
    } catch (err) {
        // ... error handling ...
    }
};
```

---

## 3. Frontend: Modify LoginPage

**File:** `frontend/src/pages/LoginPage.js`

### Add Feature Checks

```javascript
import {
    shouldRequireEmailVerification,
    shouldShowEmailVerificationPopup,
} from "../utils/featureFlags";
import EmailVerificationPopup from "../components/EmailVerificationPopup";

const LoginPage = () => {
    const [showEmailPopup, setShowEmailPopup] = useState(false);
    const [verificationEmail, setVerificationEmail] = useState(null);

    const handleLoginSuccess = async (response) => {
        const { user, emailNotVerified } = response.data;

        if (emailNotVerified) {
            // Check if feature is optional
            const shouldShow = await shouldShowEmailVerificationPopup();

            if (shouldShow) {
                setVerificationEmail(user.email);
                setShowEmailPopup(true);
                // Store token for later use
                localStorage.setItem("tempToken", response.data.token);
                return;
            }
        }

        // Normal login flow
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/");
    };

    return (
        <>
            {/* Existing login form */}

            {/* Email Verification Popup */}
            {showEmailPopup && (
                <EmailVerificationPopup
                    email={verificationEmail}
                    onDismiss={() => {
                        setShowEmailPopup(false);
                        // Allow user to continue with temp token
                        navigate("/");
                    }}
                    onVerifyClick={() => {
                        setShowEmailPopup(false);
                        navigate("/verify-email", {
                            state: { email: verificationEmail },
                        });
                    }}
                />
            )}
        </>
    );
};
```

### Example EmailVerificationPopup Component

```javascript
// frontend/src/components/EmailVerificationPopup.js

const EmailVerificationPopup = ({ email, onDismiss, onVerifyClick }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card-bg border border-candle-yellow/50 rounded-lg p-8 max-w-md">
                <h2 className="text-2xl font-bold text-candle-white mb-4">
                    تحقق من بريدك الإلكتروني
                </h2>
                <p className="text-candle-gray mb-6">
                    أرسلنا رسالة تحقق إلى <strong>{email}</strong>
                </p>
                <p className="text-candle-gray/70 text-sm mb-6">
                    يمكنك الاستمرار الآن أو التحقق من بريدك للحصول على وصول
                    كامل.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onVerifyClick}
                        className="flex-1 px-4 py-2 bg-candle-yellow text-darker-bg font-semibold rounded-lg hover:bg-bright-yellow transition"
                    >
                        تحقق الآن
                    </button>
                    <button
                        onClick={onDismiss}
                        className="flex-1 px-4 py-2 bg-dark-navy border border-candle-gray/50 text-candle-white rounded-lg hover:bg-dark-navy/70 transition"
                    >
                        لاحقاً
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailVerificationPopup;
```

---

## 4. Frontend: Modify VerifyEmailPage (Optional)

**File:** `frontend/src/pages/VerifyEmailPage.js`

### Add Feature Check

```javascript
import { shouldRequireEmailVerification } from "../utils/featureFlags";

const VerifyEmailPage = () => {
    useEffect(() => {
        checkFeatureStatus();
    }, []);

    const checkFeatureStatus = async () => {
        const isRequired = await shouldRequireEmailVerification();

        if (!isRequired) {
            // Feature is optional or disabled
            // Show warning message
            setWarningMessage(
                "تحقق البريد الإلكتروني اختياري حالياً. يمكنك العودة مباشرة."
            );
        }
    };

    return (
        <>
            {warningMessage && (
                <div className="bg-yellow-500/10 border border-yellow-500/50 p-4 rounded-lg mb-4">
                    {warningMessage}
                    <button
                        onClick={() => navigate("/")}
                        className="ml-4 text-yellow-300 underline"
                    >
                        العودة
                    </button>
                </div>
            )}
            {/* Rest of verification page */}
        </>
    );
};
```

---

## 5. Testing the Integration

### Test Case 1: Required Status

```
1. Set feature status to "required"
2. Register with unverified email
3. Try to login
4. Expected: Login blocked, error message shown
5. Verify email
6. Try to login again
7. Expected: Login successful
```

### Test Case 2: Optional Status

```
1. Set feature status to "optional"
2. Register with unverified email
3. Try to login
4. Expected: Login allowed, popup shown
5. Click "لاحقاً" (Later)
6. Expected: User logged in, redirected home
7. Click "تحقق الآن" (Verify Now)
8. Expected: Redirected to verify page
```

### Test Case 3: Disabled Status

```
1. Set feature status to "disabled"
2. Register with unverified email
3. Try to login
4. Expected: Login allowed, no popup shown
5. No verification needed
```

### Test Case 4: Provider Switching

```
1. Set feature status to "optional"
2. Update config: provider = "google"
3. Register user (email sent via Gmail)
4. Update feature config: provider = "resend"
5. Register another user (email sent via Resend)
6. Verify both work as expected
```

---

## 6. API Response Examples

### Login - Email Required

```json
{
    "success": false,
    "message": "Please verify your email to continue",
    "requiresVerification": true
}
```

### Login - Email Optional

```json
{
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGc...",
    "user": {
        "id": 1,
        "email": "user@example.com",
        "isEmailVerified": false
    },
    "emailNotVerified": true
}
```

### Login - Email Disabled

```json
{
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGc...",
    "user": {
        "id": 1,
        "email": "user@example.com",
        "isEmailVerified": false
    }
}
```

---

## 7. Error Handling

### Frontend Error Handling

```javascript
try {
    const response = await handleLogin();

    if (!response.data.success) {
        if (response.data.requiresVerification) {
            // Show blocked message
        }
        return;
    }

    if (response.data.emailNotVerified) {
        // Show optional popup
        return;
    }

    // Normal flow
    localStorage.setItem("authToken", response.data.token);
    navigate("/");
} catch (error) {
    console.error("Login error:", error);
    showErrorMessage(error.message);
}
```

### Backend Error Handling

```javascript
try {
    // Feature flag checks
    const emailFeature = await featureFlags.getFeatureStatus(
        "email_verification"
    );

    // Handle different statuses
} catch (error) {
    console.error("[AUTH] Feature flag error:", error);
    // Safe default: treat as optional
    // Log but don't break authentication
    res.status(500).json({
        success: false,
        message: "Authentication service error",
    });
}
```

---

## 8. Common Issues & Solutions

### Issue: "Feature not found" error

**Solution:** Check that initialization ran on startup

```javascript
// In server.js
await featureFlags.initializeDefaultFeatures();
console.log("[OK] Feature flags initialized");
```

### Issue: Popup appears but clicking doesn't work

**Solution:** Ensure token is stored and available

```javascript
// In LoginPage
localStorage.setItem("tempToken", response.data.token);
```

### Issue: Email still required even with optional status

**Solution:** Verify auth controller is using feature check

```javascript
// In authController.js
const emailFeature = await featureFlags.getFeatureStatus("email_verification");
if (emailFeature.status === "optional") {
    // Must return with emailNotVerified flag
}
```

### Issue: Provider config not being used

**Solution:** Pass provider to email sending function

```javascript
const emailFeature = await featureFlags.getFeatureStatus("email_verification");
// Use emailFeature.config.provider when sending email
sendVerificationEmail(email, code, emailFeature.config.provider);
```

---

## 9. Implementation Checklist

-   [ ] Import featureFlags utility in authController
-   [ ] Modify login() to check email_verification status
-   [ ] Modify register() to check email_verification status
-   [ ] Update LoginPage to show optional popup
-   [ ] Create EmailVerificationPopup component
-   [ ] Test: Required status blocks login
-   [ ] Test: Optional status shows popup
-   [ ] Test: Disabled status allows login
-   [ ] Test: Provider config can be switched
-   [ ] Test: All three flows work correctly
-   [ ] Check error logs for feature flag errors
-   [ ] Document any custom implementations
-   [ ] Deploy to production

---

## 10. Next Steps

1. **Implement these changes**
2. **Test thoroughly** in development
3. **Deploy to staging** for QA
4. **Switch email_verification to "optional"** for migration
5. **Monitor** user feedback and verification rates
6. **Switch provider** in config when ready
7. **Switch status to "required"** when stable
8. **Monitor** for any issues

---

## Questions?

Refer to:

-   `FEATURE_FLAGS_COMPLETE_DOCUMENTATION.md` - Full documentation
-   Backend code comments in `featureFlags.js` and `featureController.js`
-   Frontend code comments in `featureFlags.js` and `AdminFeaturesPage.js`
-   This guide for integration examples

Good luck! 🚀
