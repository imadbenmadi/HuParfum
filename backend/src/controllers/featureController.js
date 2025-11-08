// Feature Management Controller
// Handles admin API endpoints for feature toggles

const featureFlags = require("../utils/featureFlags");
const { validationResult } = require("express-validator");

/**
 * GET /api/admin/features
 * List all features
 */
exports.getAllFeatures = async (req, res) => {
    try {
        const features = await featureFlags.getAllFeatures();

        res.status(200).json({
            success: true,
            count: features.length,
            features,
            message: "Features retrieved successfully",
        });
    } catch (error) {
        console.error("[FEATURE] Error fetching all features:", error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to retrieve features",
        });
    }
};

/**
 * GET /api/admin/features/:name
 * Get specific feature status
 */
exports.getFeature = async (req, res) => {
    try {
        const { name } = req.params;

        if (!name || typeof name !== "string") {
            return res.status(400).json({
                success: false,
                error: "Invalid feature name",
            });
        }

        const feature = await featureFlags.getFeatureStatus(name);

        res.status(200).json({
            success: true,
            feature,
            message: "Feature retrieved successfully",
        });
    } catch (error) {
        console.error("[FEATURE] Error fetching feature:", error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to retrieve feature",
        });
    }
};

/**
 * PUT /api/admin/features/:name
 * Update feature status
 * Body: { status: "required" | "optional" | "disabled" }
 */
exports.updateFeatureStatus = async (req, res) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const { name } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ["required", "optional", "disabled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: `Invalid status. Must be one of: ${validStatuses.join(
                    ", "
                )}`,
            });
        }

        const result = await featureFlags.setFeatureStatus(name, status);

        if (!result.success) {
            return res.status(500).json({
                success: false,
                error: result.error,
            });
        }

        res.status(200).json({
            success: true,
            feature: result.feature,
            created: result.created,
            message: result.message,
        });
    } catch (error) {
        console.error("[FEATURE] Error updating feature status:", error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to update feature status",
        });
    }
};

/**
 * PUT /api/admin/features/:name/config
 * Update feature configuration
 * Body: { config: {...} }
 */
exports.updateFeatureConfig = async (req, res) => {
    try {
        const { name } = req.params;
        const { config } = req.body;

        if (!config || typeof config !== "object") {
            return res.status(400).json({
                success: false,
                error: "Config must be a valid object",
            });
        }

        const result = await featureFlags.updateFeatureConfig(name, config);

        if (!result.success) {
            return res.status(500).json({
                success: false,
                error: result.error,
            });
        }

        res.status(200).json({
            success: true,
            feature: result.feature,
            message: result.message,
        });
    } catch (error) {
        console.error("[FEATURE] Error updating feature config:", error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to update feature config",
        });
    }
};

/**
 * DELETE /api/admin/features/:name
 * Delete feature (reset to default)
 */
exports.deleteFeature = async (req, res) => {
    try {
        const { name } = req.params;

        const result = await featureFlags.deleteFeature(name);

        if (!result.success) {
            return res.status(404).json({
                success: false,
                error: result.message,
            });
        }

        res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        console.error("[FEATURE] Error deleting feature:", error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to delete feature",
        });
    }
};

/**
 * POST /api/admin/features/initialize
 * Initialize default features (admin only)
 */
exports.initializeFeatures = async (req, res) => {
    try {
        await featureFlags.initializeDefaultFeatures();

        res.status(200).json({
            success: true,
            message: "Features initialized successfully",
        });
    } catch (error) {
        console.error("[FEATURE] Error initializing features:", error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to initialize features",
        });
    }
};

/**
 * GET /api/admin/features/check/:name
 * Check if feature is enabled/required
 * Used by frontend to determine behavior
 */
exports.checkFeature = async (req, res) => {
    try {
        const { name } = req.params;

        const status = await featureFlags.getFeatureStatus(name);
        const isRequired = await featureFlags.isFeatureRequired(name);
        const isEnabled = await featureFlags.isFeatureEnabled(name);

        res.status(200).json({
            success: true,
            feature: name,
            status: status.status,
            isRequired,
            isEnabled,
            config: status.config,
        });
    } catch (error) {
        console.error("[FEATURE] Error checking feature:", error);
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to check feature",
        });
    }
};
