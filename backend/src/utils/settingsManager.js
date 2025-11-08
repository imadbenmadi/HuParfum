// Settings Manager - Service Layer
// Manages website configuration settings

const WebsiteSettings = require("../models/WebsiteSettings");

// Default settings structure
const DEFAULT_SETTINGS = {
    social_media: {
        telegram: {
            personal_link: "https://t.me/imedbenmadi",
            customer_bot: "HuParfumBot",
            admin_bot: "HuParfumAdminBot",
        },
        instagram: {
            handle: "@huparfum",
            link: "https://instagram.com/huparfum",
        },
        facebook: {
            page: "HuParfum",
            link: "https://facebook.com/huparfum",
        },
        whatsapp: {
            number: "+213123456789",
            link: "https://wa.me/213123456789",
        },
    },
    contact: {
        email: "info@huparfum.com",
        phone: "+213123456789",
        address: "Algiers, Algeria",
        business_hours: "10:00 AM - 10:00 PM",
    },
    homepage: {
        hero_title: "أطيب الريحات والشموع الفاخرة الجزائرية",
        hero_subtitle:
            "اكتشف مجموعة عطورنا وشموعنا المختارة بعناية من أجود الروائح الجزائرية الأصلية",
        featured_products_title: "منتجاتنا المختارة",
        featured_products_count: 3,
        show_testimonials: true,
        tagline: "عطور وشموع فاخرة جزائرية 🕯️✨",
    },
    general: {
        site_name: "HuParfum",
        site_description: "Algerian Perfume E-Commerce Platform",
        currency: "DZD",
        language: "ar",
        timezone: "Africa/Algiers",
    },
    branding: {
        logo_text: "HuParfum",
        logo_emoji: "🕯️",
        primary_color: "#FFD700",
        secondary_color: "#1a1a1a",
    },
};

/**
 * Initialize default settings
 */
async function initializeDefaultSettings() {
    try {
        for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
            const [setting, created] = await WebsiteSettings.findOrCreate({
                where: { key },
                defaults: {
                    value,
                    category: key,
                    description: `${key} settings`,
                },
            });

            if (created) {
                console.log(`[OK] Created default setting: ${key}`);
            }
        }
    } catch (error) {
        console.error("[ERROR] Failed to initialize settings:", error);
    }
}

/**
 * Get a setting by key
 * @param {string} key - Setting key
 * @returns {Promise<{value, category, exists}>}
 */
async function getSetting(key) {
    try {
        const setting = await WebsiteSettings.findOne({
            where: { key },
            raw: true,
        });

        if (!setting) {
            return {
                value: DEFAULT_SETTINGS[key] || {},
                exists: false,
                key,
            };
        }

        return {
            value: setting.value,
            exists: true,
            key,
            category: setting.category,
            updatedAt: setting.updated_at,
        };
    } catch (error) {
        console.error(`[ERROR] Failed to get setting ${key}:`, error);
        return {
            value: DEFAULT_SETTINGS[key] || {},
            exists: false,
            error: error.message,
        };
    }
}

/**
 * Get all settings
 * @returns {Promise<Array>}
 */
async function getAllSettings() {
    try {
        const settings = await WebsiteSettings.findAll({
            raw: true,
            order: [["category", "ASC"]],
        });

        return settings.map((s) => ({
            key: s.key,
            value: s.value,
            category: s.category,
            description: s.description,
            updatedAt: s.updated_at,
        }));
    } catch (error) {
        console.error("[ERROR] Failed to get all settings:", error);
        return [];
    }
}

/**
 * Update a setting
 * @param {string} key - Setting key
 * @param {object} value - New value
 * @returns {Promise<{success, setting}>}
 */
async function updateSetting(key, value) {
    try {
        if (!key || !value || typeof value !== "object") {
            return {
                success: false,
                message: "Invalid key or value",
            };
        }

        const [setting, created] = await WebsiteSettings.findOrCreate({
            where: { key },
            defaults: {
                value,
                category: key,
                description: `${key} settings`,
            },
        });

        if (!created) {
            setting.value = value;
            setting.updated_at = new Date();
            await setting.save();
        }

        return {
            success: true,
            message: "Setting updated successfully",
            setting: {
                key: setting.key,
                value: setting.value,
                category: setting.category,
                updatedAt: setting.updated_at,
            },
        };
    } catch (error) {
        console.error(`[ERROR] Failed to update setting ${key}:`, error);
        return {
            success: false,
            message: "Failed to update setting",
            error: error.message,
        };
    }
}

/**
 * Update specific fields in a setting
 * @param {string} key - Setting key
 * @param {object} updates - Object with fields to update
 * @returns {Promise<{success, setting}>}
 */
async function updateSettingFields(key, updates) {
    try {
        if (!key || !updates || typeof updates !== "object") {
            return {
                success: false,
                message: "Invalid key or updates",
            };
        }

        const setting = await WebsiteSettings.findOne({
            where: { key },
        });

        if (!setting) {
            return {
                success: false,
                message: "Setting not found",
            };
        }

        // Merge updates with existing value
        setting.value = {
            ...setting.value,
            ...updates,
        };
        setting.updated_at = new Date();
        await setting.save();

        return {
            success: true,
            message: "Setting updated successfully",
            setting: {
                key: setting.key,
                value: setting.value,
                category: setting.category,
                updatedAt: setting.updated_at,
            },
        };
    } catch (error) {
        console.error(`[ERROR] Failed to update setting fields ${key}:`, error);
        return {
            success: false,
            message: "Failed to update setting",
            error: error.message,
        };
    }
}

/**
 * Get settings by category
 * @param {string} category - Category name
 * @returns {Promise<Array>}
 */
async function getSettingsByCategory(category) {
    try {
        const settings = await WebsiteSettings.findAll({
            where: { category },
            raw: true,
        });

        return settings.map((s) => ({
            key: s.key,
            value: s.value,
            category: s.category,
            description: s.description,
            updatedAt: s.updated_at,
        }));
    } catch (error) {
        console.error(
            `[ERROR] Failed to get settings by category ${category}:`,
            error
        );
        return [];
    }
}

/**
 * Reset a setting to defaults
 * @param {string} key - Setting key
 * @returns {Promise<{success, setting}>}
 */
async function resetSetting(key) {
    try {
        if (!DEFAULT_SETTINGS[key]) {
            return {
                success: false,
                message: "No default setting found for this key",
            };
        }

        const result = await updateSetting(key, DEFAULT_SETTINGS[key]);
        if (result.success) {
            result.message = "Setting reset to defaults";
        }
        return result;
    } catch (error) {
        console.error(`[ERROR] Failed to reset setting ${key}:`, error);
        return {
            success: false,
            message: "Failed to reset setting",
            error: error.message,
        };
    }
}

/**
 * Delete a setting
 * @param {string} key - Setting key
 * @returns {Promise<{success, message}>}
 */
async function deleteSetting(key) {
    try {
        await WebsiteSettings.destroy({
            where: { key },
        });

        return {
            success: true,
            message: "Setting deleted successfully",
        };
    } catch (error) {
        console.error(`[ERROR] Failed to delete setting ${key}:`, error);
        return {
            success: false,
            message: "Failed to delete setting",
            error: error.message,
        };
    }
}

module.exports = {
    initializeDefaultSettings,
    getSetting,
    getAllSettings,
    updateSetting,
    updateSettingFields,
    getSettingsByCategory,
    resetSetting,
    deleteSetting,
};
