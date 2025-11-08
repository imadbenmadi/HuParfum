// Input Validation Utilities for Algeria-specific checks

/**
 * Validate Algerian phone number
 * Accepts formats: +213XXXXXXXXX, 0XXXXXXXXX, 213XXXXXXXXX
 * @param {string} phone - Phone number to validate
 * @returns {object} { valid: boolean, error: string }
 */
export const validateAlgerianPhone = (phone) => {
    if (!phone) {
        return { valid: false, error: "رقم الهاتف مطلوب" };
    }

    // Remove spaces and dashes
    const cleaned = phone.replace(/[\s\-]/g, "");

    // Pattern for Algerian numbers
    // +213XXXXXXXXX or 0XXXXXXXXX or 213XXXXXXXXX
    const patterns = [
        /^\+213\d{9}$/, // +213XXXXXXXXX
        /^0\d{9}$/, // 0XXXXXXXXX
        /^213\d{9}$/, // 213XXXXXXXXX
    ];

    const isValid = patterns.some((pattern) => pattern.test(cleaned));

    if (!isValid) {
        return {
            valid: false,
            error: "الرقم غير صحيح. استعمل: +213XXXXXXXXX أو 0XXXXXXXXX",
        };
    }

    return { valid: true, error: "" };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {object} { valid: boolean, error: string }
 */
export const validateEmail = (email) => {
    if (!email) {
        return { valid: false, error: "البريد الإلكتروني مطلوب" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return { valid: false, error: "البريد الإلكتروني غير صحيح" };
    }

    return { valid: true, error: "" };
};

/**
 * Validate name
 * @param {string} name - Name to validate
 * @returns {object} { valid: boolean, error: string }
 */
export const validateName = (name) => {
    if (!name) {
        return { valid: false, error: "الاسم مطلوب" };
    }

    if (name.length < 3) {
        return { valid: false, error: "الاسم يجب أن يكون 3 أحرف على الأقل" };
    }

    if (name.length > 50) {
        return { valid: false, error: "الاسم لا يجب أن يتجاوز 50 حرف" };
    }

    return { valid: true, error: "" };
};

/**
 * Validate password strength
 * Minimum: 8 characters, 1 uppercase, 1 number
 * @param {string} password - Password to validate
 * @returns {object} { valid: boolean, error: string }
 */
export const validatePassword = (password) => {
    if (!password) {
        return { valid: false, error: "الكلمة السرية مطلوبة" };
    }

    if (password.length < 8) {
        return {
            valid: false,
            error: "الكلمة السرية يجب أن تكون 8 أحرف على الأقل",
        };
    }

    if (!/[A-Z]/.test(password)) {
        return {
            valid: false,
            error: "الكلمة السرية يجب أن تحتوي على حرف كبير",
        };
    }

    if (!/\d/.test(password)) {
        return { valid: false, error: "الكلمة السرية يجب أن تحتوي على رقم" };
    }

    return { valid: true, error: "" };
};

/**
 * Validate all registration fields
 * @param {object} data - Object with name, phone, email, password, passwordConfirm
 * @returns {object} { valid: boolean, errors: object }
 */
export const validateRegisterForm = (data) => {
    const errors = {};

    // Validate name
    const nameValidation = validateName(data.name);
    if (!nameValidation.valid) {
        errors.name = nameValidation.error;
    }

    // Validate phone
    const phoneValidation = validateAlgerianPhone(data.phone);
    if (!phoneValidation.valid) {
        errors.phone = phoneValidation.error;
    }

    // Validate email
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.valid) {
        errors.email = emailValidation.error;
    }

    // Validate password
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.valid) {
        errors.password = passwordValidation.error;
    }

    // Validate password confirmation
    if (data.password !== data.passwordConfirm) {
        errors.passwordConfirm = "الكلمات السرية ما تتطابقش";
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};

/**
 * Validate login form
 * @param {object} data - Object with email and password
 * @returns {object} { valid: boolean, errors: object }
 */
export const validateLoginForm = (data) => {
    const errors = {};

    // Validate email
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.valid) {
        errors.email = emailValidation.error;
    }

    // Validate password exists
    if (!data.password) {
        errors.password = "الكلمة السرية مطلوبة";
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};

/**
 * Format Algerian phone number
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatAlgerianPhone = (phone) => {
    const cleaned = phone.replace(/[\s\-]/g, "");

    // Convert to +213 format
    let normalized = cleaned;
    if (normalized.startsWith("0")) {
        normalized = "213" + normalized.slice(1);
    }
    if (!normalized.startsWith("+")) {
        normalized = "+" + normalized;
    }

    return normalized;
};

/**
 * Detect if text is Arabic (RTL) or English (LTR)
 * @param {string} text - Text to check
 * @returns {string} 'rtl' for Arabic, 'ltr' for English/numbers
 */
export const detectTextDirection = (text) => {
    if (!text) return "ltr";

    // Arabic Unicode range: U+0600 to U+06FF
    const arabicRegex = /[\u0600-\u06FF]/;

    return arabicRegex.test(text) ? "rtl" : "ltr";
};

/**
 * Remove +213 prefix for display if needed
 * @param {string} phone - Phone number with +213
 * @returns {string} Phone number without prefix
 */
export const removePhonePrefix = (phone) => {
    if (!phone) return "";
    return phone.replace(/^\+213/, "0");
};
