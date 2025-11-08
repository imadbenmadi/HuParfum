// Admin Product Validation Utilities

/**
 * Validate product name
 * @param {string} name - Product name
 * @returns {object} { valid: boolean, error: string }
 */
export const validateProductName = (name) => {
    if (!name || typeof name !== "string") {
        return { valid: false, error: "اسم المنتج مطلوب" };
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 3) {
        return {
            valid: false,
            error: "اسم المنتج يجب أن يكون 3 أحرف على الأقل",
        };
    }

    if (trimmedName.length > 100) {
        return { valid: false, error: "اسم المنتج لا يجب أن يتجاوز 100 حرف" };
    }

    return { valid: true, error: "" };
};

/**
 * Validate product description
 * @param {string} description - Product description
 * @returns {object} { valid: boolean, error: string }
 */
export const validateProductDescription = (description) => {
    if (!description || typeof description !== "string") {
        return { valid: false, error: "وصف المنتج مطلوب" };
    }

    const trimmedDesc = description.trim();

    if (trimmedDesc.length < 10) {
        return { valid: false, error: "الوصف يجب أن يكون 10 أحرف على الأقل" };
    }

    if (trimmedDesc.length > 1000) {
        return { valid: false, error: "الوصف لا يجب أن يتجاوز 1000 حرف" };
    }

    return { valid: true, error: "" };
};

/**
 * Validate product price
 * @param {number|string} price - Product price
 * @returns {object} { valid: boolean, error: string }
 */
export const validateProductPrice = (price) => {
    if (price === "" || price === null || price === undefined) {
        return { valid: false, error: "السعر مطلوب" };
    }

    const numPrice = parseFloat(price);

    if (isNaN(numPrice)) {
        return { valid: false, error: "السعر يجب أن يكون رقم صحيح" };
    }

    if (numPrice <= 0) {
        return { valid: false, error: "السعر يجب أن يكون أكبر من 0" };
    }

    if (numPrice > 1000000) {
        return { valid: false, error: "السعر أعلى من الحد الأقصى (1,000,000)" };
    }

    // Check decimal places (max 2)
    if (!/^\d+(\.\d{1,2})?$/.test(numPrice.toString())) {
        return {
            valid: false,
            error: "السعر يجب أن يكون برقمين عشريين على الأكثر",
        };
    }

    return { valid: true, error: "" };
};

/**
 * Validate reduction price (discount)
 * @param {number|string} originalPrice - Original price
 * @param {number|string} reductionPrice - Discount price
 * @returns {object} { valid: boolean, error: string }
 */
export const validateReductionPrice = (originalPrice, reductionPrice) => {
    // If no reduction price, it's optional
    if (
        reductionPrice === "" ||
        reductionPrice === null ||
        reductionPrice === undefined
    ) {
        return { valid: true, error: "" };
    }

    const numPrice = parseFloat(originalPrice);
    const numReduction = parseFloat(reductionPrice);

    if (isNaN(numReduction)) {
        return { valid: false, error: "سعر الخصم يجب أن يكون رقم صحيح" };
    }

    if (numReduction <= 0) {
        return { valid: false, error: "سعر الخصم يجب أن يكون أكبر من 0" };
    }

    if (numReduction >= numPrice) {
        return {
            valid: false,
            error: "سعر الخصم يجب أن يكون أقل من السعر الأصلي",
        };
    }

    if (numReduction > 1000000) {
        return { valid: false, error: "سعر الخصم أعلى من الحد الأقصى" };
    }

    return { valid: true, error: "" };
};

/**
 * Calculate discount percentage
 * @param {number} originalPrice - Original price
 * @param {number} reductionPrice - Discount price
 * @returns {number} Discount percentage
 */
export const calculateDiscountPercentage = (originalPrice, reductionPrice) => {
    if (!originalPrice || !reductionPrice) return 0;
    return Math.round(((originalPrice - reductionPrice) / originalPrice) * 100);
};

/**
 * Validate product category
 * @param {string} category - Product category
 * @returns {object} { valid: boolean, error: string }
 */
export const validateProductCategory = (category) => {
    if (!category) {
        return { valid: false, error: "الفئة مطلوبة" };
    }

    return { valid: true, error: "" };
};

/**
 * Validate product stock
 * @param {number|string} stock - Product stock quantity
 * @returns {object} { valid: boolean, error: string }
 */
export const validateProductStock = (stock) => {
    if (stock === "" || stock === null || stock === undefined) {
        return { valid: false, error: "المخزون مطلوب" };
    }

    const numStock = parseInt(stock);

    if (isNaN(numStock)) {
        return { valid: false, error: "المخزون يجب أن يكون رقم صحيح" };
    }

    if (numStock < 0) {
        return { valid: false, error: "المخزون لا يمكن أن يكون سالب" };
    }

    if (numStock > 1000000) {
        return { valid: false, error: "المخزون أعلى من الحد الأقصى" };
    }

    return { valid: true, error: "" };
};

/**
 * Validate complete product form
 * @param {object} data - Product data
 * @returns {object} { valid: boolean, errors: object }
 */
export const validateProductForm = (data) => {
    const errors = {};

    // Validate name
    const nameValidation = validateProductName(data.name);
    if (!nameValidation.valid) {
        errors.name = nameValidation.error;
    }

    // Validate description
    const descValidation = validateProductDescription(data.description);
    if (!descValidation.valid) {
        errors.description = descValidation.error;
    }

    // Validate price
    const priceValidation = validateProductPrice(data.price);
    if (!priceValidation.valid) {
        errors.price = priceValidation.error;
    }

    // Validate reduction price (optional but if provided must be valid)
    if (data.reduction_price !== "" && data.reduction_price !== null) {
        const reductionValidation = validateReductionPrice(
            data.price,
            data.reduction_price
        );
        if (!reductionValidation.valid) {
            errors.reduction_price = reductionValidation.error;
        }
    }

    // Validate category
    const categoryValidation = validateProductCategory(data.category);
    if (!categoryValidation.valid) {
        errors.category = categoryValidation.error;
    }

    // Validate stock
    const stockValidation = validateProductStock(data.stock);
    if (!stockValidation.valid) {
        errors.stock = stockValidation.error;
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};
