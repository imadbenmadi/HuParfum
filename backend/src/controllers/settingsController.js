// Settings Controller
// API endpoints for managing website settings

const settingsManager = require("../utils/settingsManager");

/**
 * Get all settings
 * GET /api/admin/settings
 */
exports.getAllSettings = async (req, res) => {
    try {
        const settings = await settingsManager.getAllSettings();

        res.json({
            success: true,
            message: "Settings retrieved successfully",
            settings,
        });
    } catch (error) {
        console.error("[ERROR] getAllSettings:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve settings",
            error: error.message,
        });
    }
};

/**
 * Get a specific setting
 * GET /api/admin/settings/:key
 */
exports.getSetting = async (req, res) => {
    try {
        const { key } = req.params;

        if (!key) {
            return res.status(400).json({
                success: false,
                message: "Setting key is required",
            });
        }

        const setting = await settingsManager.getSetting(key);

        res.json({
            success: true,
            message: "Setting retrieved successfully",
            ...setting,
        });
    } catch (error) {
        console.error("[ERROR] getSetting:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve setting",
            error: error.message,
        });
    }
};

/**
 * Get settings by category
 * GET /api/admin/settings/category/:category
 */
exports.getSettingsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Category is required",
            });
        }

        const settings = await settingsManager.getSettingsByCategory(category);

        res.json({
            success: true,
            message: "Settings retrieved successfully",
            settings,
        });
    } catch (error) {
        console.error("[ERROR] getSettingsByCategory:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve settings",
            error: error.message,
        });
    }
};

/**
 * Update a setting
 * PUT /api/admin/settings/:key
 */
exports.updateSetting = async (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;

        if (!key || !value) {
            return res.status(400).json({
                success: false,
                message: "Setting key and value are required",
            });
        }

        const result = await settingsManager.updateSetting(key, value);

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json(result);
    } catch (error) {
        console.error("[ERROR] updateSetting:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update setting",
            error: error.message,
        });
    }
};

/**
 * Update specific fields in a setting
 * PATCH /api/admin/settings/:key
 */
exports.updateSettingFields = async (req, res) => {
    try {
        const { key } = req.params;
        const updates = req.body;

        if (!key || !updates || Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Setting key and updates are required",
            });
        }

        const result = await settingsManager.updateSettingFields(key, updates);

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json(result);
    } catch (error) {
        console.error("[ERROR] updateSettingFields:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update setting fields",
            error: error.message,
        });
    }
};

/**
 * Reset a setting to defaults
 * POST /api/admin/settings/:key/reset
 */
exports.resetSetting = async (req, res) => {
    try {
        const { key } = req.params;

        if (!key) {
            return res.status(400).json({
                success: false,
                message: "Setting key is required",
            });
        }

        const result = await settingsManager.resetSetting(key);

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json(result);
    } catch (error) {
        console.error("[ERROR] resetSetting:", error);
        res.status(500).json({
            success: false,
            message: "Failed to reset setting",
            error: error.message,
        });
    }
};

/**
 * Delete a setting
 * DELETE /api/admin/settings/:key
 */
exports.deleteSetting = async (req, res) => {
    try {
        const { key } = req.params;

        if (!key) {
            return res.status(400).json({
                success: false,
                message: "Setting key is required",
            });
        }

        const result = await settingsManager.deleteSetting(key);

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json(result);
    } catch (error) {
        console.error("[ERROR] deleteSetting:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete setting",
            error: error.message,
        });
    }
};

/**
 * Get public setting (no auth required)
 * GET /api/settings/:key
 */
exports.getPublicSetting = async (req, res) => {
    try {
        const { key } = req.params;

        if (!key) {
            return res.status(400).json({
                success: false,
                message: "Setting key is required",
            });
        }

        const setting = await settingsManager.getSetting(key);

        res.json({
            success: true,
            message: "Setting retrieved successfully",
            value: setting.value,
            key: setting.key,
        });
    } catch (error) {
        console.error("[ERROR] getPublicSetting:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve setting",
            error: error.message,
        });
    }
};

/**
 * Get public settings by category (no auth required)
 * GET /api/settings/category/:category
 */
exports.getPublicSettingsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        if (!category) {
            return res.status(400).json({
                success: false,
                message: "Category is required",
            });
        }

        const settings = await settingsManager.getSettingsByCategory(category);

        res.json({
            success: true,
            message: "Settings retrieved successfully",
            settings,
        });
    } catch (error) {
        console.error("[ERROR] getPublicSettingsByCategory:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve settings",
            error: error.message,
        });
    }
};
