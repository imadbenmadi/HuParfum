// Backend Input Validation Utilities for Algeria-specific checks

/**
 * Validate Algerian phone number
 * Accepts formats: +213XXXXXXXXX, 0XXXXXXXXX, 213XXXXXXXXX
 * @param {string} phone - Phone number to validate
 * @returns {object} { valid: boolean, error: string }
 */
const validateAlgerianPhone = (phone) => {
    if (!phone || typeof phone !== "string") {
        return { valid: false, error: "رقم الهاتف مطلوب" };
    }

    // Remove spaces and dashes
    const cleaned = phone.trim().replace(/[\s\-]/g, "");

    // Pattern for Algerian numbers
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
const validateEmail = (email) => {
    if (!email || typeof email !== "string") {
        return { valid: false, error: "البريد الإلكتروني مطلوب" };
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
        return { valid: false, error: "البريد الإلكتروني غير صحيح" };
    }

    if (trimmedEmail.length > 100) {
        return { valid: false, error: "البريد الإلكتروني طويل جداً" };
    }

    return { valid: true, error: "" };
};

/**
 * Validate name
 * @param {string} name - Name to validate
 * @returns {object} { valid: boolean, error: string }
 */
const validateName = (name) => {
    if (!name || typeof name !== "string") {
        return { valid: false, error: "الاسم مطلوب" };
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 3) {
        return { valid: false, error: "الاسم يجب أن يكون 3 أحرف على الأقل" };
    }

    if (trimmedName.length > 50) {
        return { valid: false, error: "الاسم لا يجب أن يتجاوز 50 حرف" };
    }

    // Allow letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Zأ-ي\s\-']+$/;
    if (!nameRegex.test(trimmedName)) {
        return { valid: false, error: "الاسم يحتوي على أحرف غير صالحة" };
    }

    return { valid: true, error: "" };
};

/**
 * Validate password strength
 * Minimum: 8 characters, 1 uppercase, 1 number
 * @param {string} password - Password to validate
 * @returns {object} { valid: boolean, error: string }
 */
const validatePassword = (password) => {
    if (!password || typeof password !== "string") {
        return { valid: false, error: "الكلمة السرية مطلوبة" };
    }

    if (password.length < 8) {
        return {
            valid: false,
            error: "الكلمة السرية يجب أن تكون 8 أحرف على الأقل",
        };
    }

    if (password.length > 100) {
        return { valid: false, error: "الكلمة السرية طويلة جداً" };
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
const validateRegistration = (data) => {
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
 * Validate login fields
 * @param {object} data - Object with email and password
 * @returns {object} { valid: boolean, errors: object }
 */
const validateLogin = (data) => {
    const errors = {};

    // Validate email
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.valid) {
        errors.email = emailValidation.error;
    }

    // Validate password exists
    if (!data.password || typeof data.password !== "string") {
        errors.password = "الكلمة السرية مطلوبة";
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};

/**
 * Format Algerian phone number to +213 format
 * @param {string} phone - Phone number to format
 * @returns {string} Formatted phone number
 */
const formatAlgerianPhone = (phone) => {
    const cleaned = phone.trim().replace(/[\s\-]/g, "");

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

module.exports = {
    validateAlgerianPhone,
    validateEmail,
    validateName,
    validatePassword,
    validateRegistration,
    validateLogin,
    formatAlgerianPhone,
};
