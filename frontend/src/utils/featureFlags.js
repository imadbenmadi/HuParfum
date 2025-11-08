// Frontend Feature Flags Utilities
// Client-side feature status checking

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/**
 * Cache for feature flags to minimize API calls
 */
let featureCache = {};
let cacheTTL = 5 * 60 * 1000; // 5 minutes
let lastFetchTime = {};

/**
 * Clear feature cache after TTL expires
 * @param {string} featureName - Feature to clear (optional)
 */
const clearStaleCache = (featureName) => {
    const now = Date.now();

    if (featureName) {
        if (
            lastFetchTime[featureName] &&
            now - lastFetchTime[featureName] > cacheTTL
        ) {
            delete featureCache[featureName];
            delete lastFetchTime[featureName];
        }
    } else {
        // Clear all stale entries
        for (const name in lastFetchTime) {
            if (now - lastFetchTime[name] > cacheTTL) {
                delete featureCache[name];
                delete lastFetchTime[name];
            }
        }
    }
};

/**
 * Get feature status from API
 * @param {string} featureName - Feature identifier
 * @returns {object} Feature status {status, isRequired, isEnabled, config}
 */
export const checkFeatureStatus = async (featureName) => {
    try {
        clearStaleCache(featureName);

        // Return cached value if available
        if (featureCache[featureName]) {
            return featureCache[featureName];
        }

        const response = await fetch(
            `${API_BASE}/features/check/${featureName}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            console.error(
                `[FEATURE] Failed to check ${featureName}:`,
                response.status
            );
            // Return safe default
            return {
                status: "optional",
                isRequired: false,
                isEnabled: true,
                config: {},
            };
        }

        const data = await response.json();

        // Cache the result
        if (data.success) {
            featureCache[featureName] = {
                status: data.status,
                isRequired: data.isRequired,
                isEnabled: data.isEnabled,
                config: data.config,
            };
            lastFetchTime[featureName] = Date.now();

            return featureCache[featureName];
        }

        return {
            status: "optional",
            isRequired: false,
            isEnabled: true,
            config: {},
        };
    } catch (error) {
        console.error(`[FEATURE] Error checking feature status:`, error);
        // Safe default fallback
        return {
            status: "optional",
            isRequired: false,
            isEnabled: true,
            config: {},
        };
    }
};

/**
 * Check if email verification is required
 * @returns {boolean} True if email verification is required
 */
export const shouldRequireEmailVerification = async () => {
    const feature = await checkFeatureStatus("email_verification");
    return feature.isRequired;
};

/**
 * Check if email verification should show popup (optional)
 * @returns {boolean} True if email verification is optional
 */
export const shouldShowEmailVerificationPopup = async () => {
    const feature = await checkFeatureStatus("email_verification");
    return feature.status === "optional";
};

/**
 * Check if email verification is disabled
 * @returns {boolean} True if email verification is disabled
 */
export const shouldSkipEmailVerification = async () => {
    const feature = await checkFeatureStatus("email_verification");
    return feature.status === "disabled";
};

/**
 * Get email service provider configuration
 * @returns {object} Provider config {provider, serviceName}
 */
export const getEmailProviderConfig = async () => {
    const feature = await checkFeatureStatus("email_verification");
    return feature.config || { provider: "google", serviceName: "Gmail" };
};

/**
 * Get all features (admin only)
 * @param {string} authToken - Admin authentication token
 * @returns {array} List of all features
 */
export const getAllFeatures = async (authToken) => {
    try {
        const response = await fetch(`${API_BASE}/admin/features`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (!response.ok) {
            console.error(
                "[FEATURE] Failed to fetch all features:",
                response.status
            );
            return [];
        }

        const data = await response.json();
        return data.success ? data.features : [];
    } catch (error) {
        console.error("[FEATURE] Error fetching all features:", error);
        return [];
    }
};

/**
 * Update feature status (admin only)
 * @param {string} featureName - Feature identifier
 * @param {string} status - New status (required/optional/disabled)
 * @param {string} authToken - Admin authentication token
 * @returns {object} Result {success, feature}
 */
export const updateFeatureStatus = async (featureName, status, authToken) => {
    try {
        const response = await fetch(
            `${API_BASE}/admin/features/${featureName}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({ status }),
            }
        );

        const data = await response.json();

        // Clear cache to force refresh
        delete featureCache[featureName];
        delete lastFetchTime[featureName];

        return data;
    } catch (error) {
        console.error("[FEATURE] Error updating feature status:", error);
        return {
            success: false,
            error: error.message,
        };
    }
};

/**
 * Update feature configuration (admin only)
 * @param {string} featureName - Feature identifier
 * @param {object} config - New configuration
 * @param {string} authToken - Admin authentication token
 * @returns {object} Result {success, feature}
 */
export const updateFeatureConfig = async (featureName, config, authToken) => {
    try {
        const response = await fetch(
            `${API_BASE}/admin/features/${featureName}/config`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({ config }),
            }
        );

        const data = await response.json();

        // Clear cache to force refresh
        delete featureCache[featureName];
        delete lastFetchTime[featureName];

        return data;
    } catch (error) {
        console.error("[FEATURE] Error updating feature config:", error);
        return {
            success: false,
            error: error.message,
        };
    }
};

/**
 * Clear all cached feature flags
 */
export const clearFeatureCache = () => {
    featureCache = {};
    lastFetchTime = {};
};

/**
 * Get cache stats (for debugging)
 * @returns {object} Cache statistics
 */
export const getCacheStats = () => {
    return {
        cachedFeatures: Object.keys(featureCache),
        cacheSize: Object.keys(featureCache).length,
        cacheTTL,
    };
};
