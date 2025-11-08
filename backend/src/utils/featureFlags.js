// Feature Management Utilities
// Handles feature flag logic and status checks

const FeatureFlag = require("../models/FeatureFlag");

/**
 * Get feature status by name
 * @param {string} featureName - Feature identifier
 * @returns {object} Feature status and config
 */
exports.getFeatureStatus = async (featureName) => {
    try {
        const feature = await FeatureFlag.findOne({
            where: { feature_name: featureName },
        });

        if (!feature) {
            console.warn(`Feature "${featureName}" not found, using default`);
            return {
                status: "optional",
                config: {},
                exists: false,
            };
        }

        return {
            status: feature.status,
            config: feature.config || {},
            exists: true,
        };
    } catch (err) {
        console.error(`Error getting feature status: ${err.message}`);
        return {
            status: "optional",
            config: {},
            error: err.message,
        };
    }
};

/**
 * Check if feature is required
 * @param {string} featureName - Feature identifier
 * @returns {boolean} True if feature status is "required"
 */
exports.isFeatureRequired = async (featureName) => {
    const feature = await exports.getFeatureStatus(featureName);
    return feature.status === "required";
};

/**
 * Check if feature is enabled (required or optional)
 * @param {string} featureName - Feature identifier
 * @returns {boolean} True if feature is not disabled
 */
exports.isFeatureEnabled = async (featureName) => {
    const feature = await exports.getFeatureStatus(featureName);
    return feature.status !== "disabled";
};

/**
 * Get all features
 * @returns {array} All feature flags
 */
exports.getAllFeatures = async () => {
    try {
        return await FeatureFlag.findAll({
            order: [["created_at", "DESC"]],
        });
    } catch (err) {
        console.error(`Error fetching all features: ${err.message}`);
        return [];
    }
};

/**
 * Create or update feature
 * @param {string} featureName - Feature identifier
 * @param {string} status - Status: required, optional, or disabled
 * @param {object} config - Feature configuration
 * @returns {object} Created/updated feature
 */
exports.setFeatureStatus = async (featureName, status, config = {}) => {
    try {
        const [feature, created] = await FeatureFlag.findOrCreate({
            where: { feature_name: featureName },
            defaults: {
                status,
                config,
            },
        });

        if (!created) {
            await feature.update({ status, config });
        }

        return {
            success: true,
            feature,
            created,
            message: created ? "Feature created" : "Feature updated",
        };
    } catch (err) {
        console.error(`Error setting feature status: ${err.message}`);
        return {
            success: false,
            error: err.message,
        };
    }
};

/**
 * Delete feature (reset to default)
 * @param {string} featureName - Feature identifier
 * @returns {object} Result
 */
exports.deleteFeature = async (featureName) => {
    try {
        const deleted = await FeatureFlag.destroy({
            where: { feature_name: featureName },
        });

        return {
            success: deleted > 0,
            message: deleted > 0 ? "Feature deleted" : "Feature not found",
        };
    } catch (err) {
        console.error(`Error deleting feature: ${err.message}`);
        return {
            success: false,
            error: err.message,
        };
    }
};

/**
 * Initialize default features
 * Call this on app startup
 */
exports.initializeDefaultFeatures = async () => {
    const defaultFeatures = [
        {
            feature_name: "email_verification",
            status: "optional",
            description: "Email verification for user registration",
            config: {
                provider: "google",
                serviceName: "Gmail",
            },
        },
    ];

    for (const feature of defaultFeatures) {
        const existing = await FeatureFlag.findOne({
            where: { feature_name: feature.feature_name },
        });

        if (!existing) {
            await FeatureFlag.create(feature);
            console.log(`[FEATURE] Initialized: ${feature.feature_name}`);
        }
    }
};

/**
 * Get feature configuration
 * @param {string} featureName - Feature identifier
 * @returns {object} Feature configuration
 */
exports.getFeatureConfig = async (featureName) => {
    const feature = await exports.getFeatureStatus(featureName);
    return feature.config;
};

/**
 * Update feature configuration only
 * @param {string} featureName - Feature identifier
 * @param {object} config - New configuration
 * @returns {object} Updated feature
 */
exports.updateFeatureConfig = async (featureName, config) => {
    try {
        const feature = await FeatureFlag.findOne({
            where: { feature_name: featureName },
        });

        if (!feature) {
            return {
                success: false,
                error: "Feature not found",
            };
        }

        await feature.update({
            config: { ...feature.config, ...config },
        });

        return {
            success: true,
            feature,
            message: "Config updated",
        };
    } catch (err) {
        console.error(`Error updating feature config: ${err.message}`);
        return {
            success: false,
            error: err.message,
        };
    }
};
