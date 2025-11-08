// Frontend Settings Manager
// Handles fetching and caching website settings

import axios from "axios";

const API_BASE = "http://localhost:5001/api";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let settingsCache = {};
let cacheTimestamps = {};

/**
 * Check if cached data is still valid
 */
function isCacheValid(key) {
    if (!cacheTimestamps[key]) return false;
    return Date.now() - cacheTimestamps[key] < CACHE_DURATION;
}

/**
 * Get a setting (cached)
 */
export async function getSetting(key, forceRefresh = false) {
    try {
        if (!forceRefresh && isCacheValid(key) && settingsCache[key]) {
            return settingsCache[key];
        }

        const res = await axios.get(`${API_BASE}/settings/${key}`);
        if (res.data.success) {
            settingsCache[key] = res.data.value;
            cacheTimestamps[key] = Date.now();
            return res.data.value;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching setting ${key}:`, error);
        return settingsCache[key] || null;
    }
}

/**
 * Get settings by category (cached)
 */
export async function getSettingsByCategory(category, forceRefresh = false) {
    try {
        const cacheKey = `category_${category}`;
        if (
            !forceRefresh &&
            isCacheValid(cacheKey) &&
            settingsCache[cacheKey]
        ) {
            return settingsCache[cacheKey];
        }

        const res = await axios.get(
            `${API_BASE}/settings/category/${category}`
        );
        if (res.data.success) {
            settingsCache[cacheKey] = res.data.settings;
            cacheTimestamps[cacheKey] = Date.now();
            return res.data.settings;
        }
        return [];
    } catch (error) {
        console.error(
            `Error fetching settings for category ${category}:`,
            error
        );
        return settingsCache[`category_${category}`] || [];
    }
}

/**
 * Get social media settings
 */
export async function getSocialMediaSettings(forceRefresh = false) {
    return getSetting("social_media", forceRefresh);
}

/**
 * Get contact settings
 */
export async function getContactSettings(forceRefresh = false) {
    return getSetting("contact", forceRefresh);
}

/**
 * Get homepage settings
 */
export async function getHomepageSettings(forceRefresh = false) {
    return getSetting("homepage", forceRefresh);
}

/**
 * Get general settings
 */
export async function getGeneralSettings(forceRefresh = false) {
    return getSetting("general", forceRefresh);
}

/**
 * Get branding settings
 */
export async function getBrandingSettings(forceRefresh = false) {
    return getSetting("branding", forceRefresh);
}

/**
 * Get all settings (admin)
 */
export async function getAllSettings(authToken, forceRefresh = false) {
    try {
        if (
            !forceRefresh &&
            isCacheValid("all_settings") &&
            settingsCache["all_settings"]
        ) {
            return settingsCache["all_settings"];
        }

        const res = await axios.get(`${API_BASE}/admin/settings`, {
            headers: { Authorization: `Bearer ${authToken}` },
        });

        if (res.data.success) {
            settingsCache["all_settings"] = res.data.settings;
            cacheTimestamps["all_settings"] = Date.now();
            return res.data.settings;
        }
        return [];
    } catch (error) {
        console.error("Error fetching all settings:", error);
        return settingsCache["all_settings"] || [];
    }
}

/**
 * Update a setting (admin)
 */
export async function updateSetting(key, value, authToken) {
    try {
        const res = await axios.put(
            `${API_BASE}/admin/settings/${key}`,
            { value },
            {
                headers: { Authorization: `Bearer ${authToken}` },
            }
        );

        if (res.data.success) {
            // Invalidate cache
            delete settingsCache[key];
            delete cacheTimestamps[key];
            delete settingsCache["all_settings"];
            delete cacheTimestamps["all_settings"];

            return res.data;
        }
        return res.data;
    } catch (error) {
        console.error(`Error updating setting ${key}:`, error);
        return {
            success: false,
            message:
                error.response?.data?.message || "Failed to update setting",
        };
    }
}

/**
 * Update specific fields in a setting (admin)
 */
export async function updateSettingFields(key, updates, authToken) {
    try {
        const res = await axios.patch(
            `${API_BASE}/admin/settings/${key}`,
            updates,
            {
                headers: { Authorization: `Bearer ${authToken}` },
            }
        );

        if (res.data.success) {
            // Invalidate cache
            delete settingsCache[key];
            delete cacheTimestamps[key];
            delete settingsCache["all_settings"];
            delete cacheTimestamps["all_settings"];

            return res.data;
        }
        return res.data;
    } catch (error) {
        console.error(`Error updating setting fields for ${key}:`, error);
        return {
            success: false,
            message:
                error.response?.data?.message || "Failed to update setting",
        };
    }
}

/**
 * Reset a setting to defaults (admin)
 */
export async function resetSetting(key, authToken) {
    try {
        const res = await axios.post(
            `${API_BASE}/admin/settings/${key}/reset`,
            {},
            {
                headers: { Authorization: `Bearer ${authToken}` },
            }
        );

        if (res.data.success) {
            // Invalidate cache
            delete settingsCache[key];
            delete cacheTimestamps[key];
            delete settingsCache["all_settings"];
            delete cacheTimestamps["all_settings"];

            return res.data;
        }
        return res.data;
    } catch (error) {
        console.error(`Error resetting setting ${key}:`, error);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to reset setting",
        };
    }
}

/**
 * Clear all cache
 */
export function clearCache() {
    settingsCache = {};
    cacheTimestamps = {};
}

/**
 * Clear specific cache
 */
export function clearCacheKey(key) {
    delete settingsCache[key];
    delete cacheTimestamps[key];
}
