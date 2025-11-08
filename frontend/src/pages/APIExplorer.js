// API Explorer - Interactive API Testing Interface
// Provides Swagger-like UI for testing all backend endpoints

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    FiPlay,
    FiRefreshCw,
    FiChevronDown,
    FiChevronUp,
    FiCopy,
    FiCheck,
    FiX,
    FiCode,
} from "react-icons/fi";

const API_BASE = "http://localhost:5001/api";

const APIExplorer = () => {
    const [endpoints, setEndpoints] = useState([]);
    const [expandedEndpoint, setExpandedEndpoint] = useState(null);
    const [adminToken, setAdminToken] = useState(
        localStorage.getItem("adminToken") || ""
    );
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState({});
    const [copied, setCopied] = useState({});

    // Define all API endpoints
    const allEndpoints = [
        // Health Check
        {
            category: "Health",
            name: "Health Check",
            method: "GET",
            endpoint: "/health",
            fullUrl: "http://localhost:5001/health",
            requiresAuth: false,
            params: {},
            description: "Check if backend is running",
        },

        // Public Settings Endpoints
        {
            category: "Settings - Public",
            name: "Get Social Media Settings",
            method: "GET",
            endpoint: "/api/settings/social_media",
            fullUrl: `${API_BASE}/settings/social_media`,
            requiresAuth: false,
            params: {},
            description: "Get all social media links",
        },
        {
            category: "Settings - Public",
            name: "Get Contact Settings",
            method: "GET",
            endpoint: "/api/settings/contact",
            fullUrl: `${API_BASE}/settings/contact`,
            requiresAuth: false,
            params: {},
            description: "Get contact information",
        },
        {
            category: "Settings - Public",
            name: "Get Homepage Settings",
            method: "GET",
            endpoint: "/api/settings/homepage",
            fullUrl: `${API_BASE}/settings/homepage`,
            requiresAuth: false,
            params: {},
            description: "Get homepage content",
        },
        {
            category: "Settings - Public",
            name: "Get Settings by Category",
            method: "GET",
            endpoint: "/api/settings/category/social_media",
            fullUrl: `${API_BASE}/settings/category/social_media`,
            requiresAuth: false,
            params: { category: "social_media" },
            description: "Get settings filtered by category",
        },

        // Admin Settings Endpoints
        {
            category: "Settings - Admin",
            name: "Get All Settings",
            method: "GET",
            endpoint: "/api/admin/settings",
            fullUrl: `${API_BASE}/admin/settings`,
            requiresAuth: true,
            params: {},
            description: "List all website settings (admin only)",
        },
        {
            category: "Settings - Admin",
            name: "Get Single Setting",
            method: "GET",
            endpoint: "/api/admin/settings/social_media",
            fullUrl: `${API_BASE}/admin/settings/social_media`,
            requiresAuth: true,
            params: { key: "social_media" },
            description: "Get a specific setting by key",
        },
        {
            category: "Settings - Admin",
            name: "Update Setting",
            method: "PUT",
            endpoint: "/api/admin/settings/social_media",
            fullUrl: `${API_BASE}/admin/settings/social_media`,
            requiresAuth: true,
            body: {
                telegram: {
                    personal_link: "https://t.me/yourusername",
                    customer_bot: "YourBotName",
                    admin_bot: "YourAdminBot",
                },
                instagram: {
                    handle: "@yourhandle",
                    link: "https://instagram.com/yourhandle",
                },
            },
            description: "Update a setting with new values",
        },
        {
            category: "Settings - Admin",
            name: "Update Setting Fields",
            method: "PATCH",
            endpoint: "/api/admin/settings/social_media",
            fullUrl: `${API_BASE}/admin/settings/social_media`,
            requiresAuth: true,
            body: {
                "telegram.personal_link": "https://t.me/newusername",
            },
            description: "Update specific fields in a setting",
        },
        {
            category: "Settings - Admin",
            name: "Reset Setting to Defaults",
            method: "POST",
            endpoint: "/api/admin/settings/social_media/reset",
            fullUrl: `${API_BASE}/admin/settings/social_media/reset`,
            requiresAuth: true,
            params: { key: "social_media" },
            description: "Reset a setting to its default values",
        },
        {
            category: "Settings - Admin",
            name: "Delete Setting",
            method: "DELETE",
            endpoint: "/api/admin/settings/social_media",
            fullUrl: `${API_BASE}/admin/settings/social_media`,
            requiresAuth: true,
            params: { key: "social_media" },
            description: "Delete a setting",
        },

        // Feature Flags Endpoints
        {
            category: "Feature Flags",
            name: "Get All Features",
            method: "GET",
            endpoint: "/api/admin/features",
            fullUrl: `${API_BASE}/admin/features`,
            requiresAuth: true,
            params: {},
            description: "List all feature flags",
        },
        {
            category: "Feature Flags",
            name: "Check Feature Status",
            method: "GET",
            endpoint: "/api/features/check/email_verification",
            fullUrl: `${API_BASE}/features/check/email_verification`,
            requiresAuth: false,
            params: {},
            description: "Check if a feature is enabled (public)",
        },

        // Auth Endpoints
        {
            category: "Authentication",
            name: "Register User",
            method: "POST",
            endpoint: "/api/auth/register",
            fullUrl: `${API_BASE}/auth/register`,
            requiresAuth: false,
            body: {
                name: "Test User",
                email: `testuser${Date.now()}@test.com`,
                phone: "0123456789",
                password: "Test@12345",
                passwordConfirm: "Test@12345",
            },
            description: "Register a new user account",
        },
        {
            category: "Authentication",
            name: "Admin Login",
            method: "POST",
            endpoint: "/api/admin/login",
            fullUrl: `${API_BASE}/admin/login`,
            requiresAuth: false,
            body: {
                email: "admin@huparfum.com",
                password: "admin123",
            },
            description: "Login as admin (get token)",
        },

        // Products Endpoints
        {
            category: "Products",
            name: "Get All Products",
            method: "GET",
            endpoint: "/api/products",
            fullUrl: `${API_BASE}/products`,
            requiresAuth: false,
            params: {},
            description: "Get all available products",
        },
    ];

    const testEndpoint = async (endpoint) => {
        try {
            setLoading((prev) => ({ ...prev, [endpoint.name]: true }));

            let config = {};
            if (endpoint.requiresAuth && adminToken) {
                config.headers = {
                    Authorization: `Bearer ${adminToken}`,
                };
            }

            let response;
            if (endpoint.method === "GET") {
                response = await axios.get(endpoint.fullUrl, config);
            } else if (endpoint.method === "POST") {
                response = await axios.post(
                    endpoint.fullUrl,
                    endpoint.body,
                    config
                );
            } else if (endpoint.method === "PUT") {
                response = await axios.put(
                    endpoint.fullUrl,
                    endpoint.body,
                    config
                );
            } else if (endpoint.method === "PATCH") {
                response = await axios.patch(
                    endpoint.fullUrl,
                    endpoint.body,
                    config
                );
            } else if (endpoint.method === "DELETE") {
                response = await axios.delete(endpoint.fullUrl, config);
            }

            setResults((prev) => ({
                ...prev,
                [endpoint.name]: {
                    status: response.status,
                    success: true,
                    data: response.data,
                    timestamp: new Date().toLocaleTimeString(),
                },
            }));

            // If admin login, store token
            if (endpoint.name === "Admin Login" && response.data.token) {
                setAdminToken(response.data.token);
                localStorage.setItem("adminToken", response.data.token);
            }
        } catch (error) {
            setResults((prev) => ({
                ...prev,
                [endpoint.name]: {
                    status: error.response?.status || "Error",
                    success: false,
                    error: error.response?.data || error.message,
                    timestamp: new Date().toLocaleTimeString(),
                },
            }));
        } finally {
            setLoading((prev) => ({ ...prev, [endpoint.name]: false }));
        }
    };

    const copyToClipboard = (text, key) => {
        navigator.clipboard.writeText(text);
        setCopied((prev) => ({ ...prev, [key]: true }));
        setTimeout(
            () => setCopied((prev) => ({ ...prev, [key]: false })),
            2000
        );
    };

    const groupedEndpoints = allEndpoints.reduce((acc, endpoint) => {
        if (!acc[endpoint.category]) {
            acc[endpoint.category] = [];
        }
        acc[endpoint.category].push(endpoint);
        return acc;
    }, {});

    const getMethodColor = (method) => {
        switch (method) {
            case "GET":
                return "bg-blue-500/20 text-blue-300 border-blue-500/30";
            case "POST":
                return "bg-green-500/20 text-green-300 border-green-500/30";
            case "PUT":
                return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
            case "PATCH":
                return "bg-purple-500/20 text-purple-300 border-purple-500/30";
            case "DELETE":
                return "bg-red-500/20 text-red-300 border-red-500/30";
            default:
                return "bg-gray-500/20 text-gray-300 border-gray-500/30";
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg text-text-primary p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gradient mb-2">
                        🔗 API Explorer
                    </h1>
                    <p className="text-text-secondary">
                        Interactive API testing interface - Like Swagger for
                        HuParfum
                    </p>
                </div>

                {/* Admin Token Input */}
                <div className="bg-card-bg border border-border-color rounded-lg p-6 mb-8">
                    <h2 className="text-xl font-bold text-candle-yellow mb-4">
                        ⚙️ Configuration
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-text-secondary mb-2">
                                Admin Token (for protected endpoints)
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="password"
                                    value={adminToken}
                                    onChange={(e) => {
                                        setAdminToken(e.target.value);
                                        localStorage.setItem(
                                            "adminToken",
                                            e.target.value
                                        );
                                    }}
                                    placeholder="Paste admin token here or login to get one"
                                    className="flex-1 bg-dark-bg border border-border-color rounded px-4 py-2 text-candle-white focus:outline-none focus:border-candle-yellow"
                                />
                                <button
                                    onClick={() =>
                                        testEndpoint(
                                            allEndpoints.find(
                                                (e) => e.name === "Admin Login"
                                            )
                                        )
                                    }
                                    className="btn-primary"
                                >
                                    {loading["Admin Login"]
                                        ? "Logging in..."
                                        : "Get Token"}
                                </button>
                            </div>
                            {adminToken && (
                                <p className="text-xs text-green-400 mt-2">
                                    ✓ Token is set (
                                    {adminToken.substring(0, 20)}...)
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Endpoints */}
                <div className="space-y-6">
                    {Object.entries(groupedEndpoints).map(
                        ([category, endpoints]) => (
                            <div key={category}>
                                <h2 className="text-2xl font-bold text-candle-yellow mb-4 uppercase">
                                    {category}
                                </h2>
                                <div className="space-y-3">
                                    {endpoints.map((endpoint, idx) => (
                                        <EndpointCard
                                            key={idx}
                                            endpoint={endpoint}
                                            isExpanded={
                                                expandedEndpoint ===
                                                `${category}-${idx}`
                                            }
                                            onToggle={() =>
                                                setExpandedEndpoint(
                                                    expandedEndpoint ===
                                                        `${category}-${idx}`
                                                        ? null
                                                        : `${category}-${idx}`
                                                )
                                            }
                                            onTest={() =>
                                                testEndpoint(endpoint)
                                            }
                                            isLoading={loading[endpoint.name]}
                                            result={results[endpoint.name]}
                                            getMethodColor={getMethodColor}
                                            copyToClipboard={copyToClipboard}
                                            copied={copied}
                                            requiresAuth={endpoint.requiresAuth}
                                            hasToken={!!adminToken}
                                        />
                                    ))}
                                </div>
                            </div>
                        )
                    )}
                </div>

                {/* Stats */}
                <div className="mt-12 bg-card-bg border border-border-color rounded-lg p-6">
                    <h2 className="text-xl font-bold text-candle-yellow mb-4">
                        📊 Test Summary
                    </h2>
                    <div className="grid grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-candle-yellow">
                                {allEndpoints.length}
                            </div>
                            <p className="text-text-secondary">
                                Total Endpoints
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-400">
                                {
                                    Object.values(results).filter(
                                        (r) => r.success
                                    ).length
                                }
                            </div>
                            <p className="text-text-secondary">Passed Tests</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-red-400">
                                {
                                    Object.values(results).filter(
                                        (r) => !r.success
                                    ).length
                                }
                            </div>
                            <p className="text-text-secondary">Failed Tests</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Endpoint Card Component
const EndpointCard = ({
    endpoint,
    isExpanded,
    onToggle,
    onTest,
    isLoading,
    result,
    getMethodColor,
    copyToClipboard,
    copied,
    requiresAuth,
    hasToken,
}) => {
    return (
        <div className="bg-card-bg border border-border-color rounded-lg overflow-hidden hover:border-candle-yellow/50 transition-all">
            {/* Header */}
            <button
                onClick={onToggle}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-dark-bg/50 transition-colors"
            >
                <div className="flex items-center gap-4 flex-1 text-left">
                    <span
                        className={`px-3 py-1 rounded font-bold text-sm border ${getMethodColor(
                            endpoint.method
                        )}`}
                    >
                        {endpoint.method}
                    </span>
                    <div>
                        <p className="font-semibold text-candle-white">
                            {endpoint.name}
                        </p>
                        <p className="text-xs text-text-secondary">
                            {endpoint.endpoint}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {result && (
                        <div
                            className={`text-sm font-bold ${
                                result.success
                                    ? "text-green-400"
                                    : "text-red-400"
                            }`}
                        >
                            {result.success ? "✓ PASS" : "✗ FAIL"} (
                            {result.status})
                        </div>
                    )}
                    {isExpanded ? (
                        <FiChevronUp size={20} />
                    ) : (
                        <FiChevronDown size={20} />
                    )}
                </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="border-t border-border-color px-6 py-6 bg-dark-bg/50 space-y-4">
                    {/* Description */}
                    <div>
                        <p className="text-text-secondary">
                            {endpoint.description}
                        </p>
                    </div>

                    {/* URL */}
                    <div>
                        <p className="text-sm text-text-secondary mb-2">
                            Endpoint URL:
                        </p>
                        <div className="flex gap-2">
                            <code className="flex-1 bg-darker-bg border border-border-color rounded px-3 py-2 text-xs text-candle-yellow overflow-x-auto">
                                {endpoint.fullUrl}
                            </code>
                            <button
                                onClick={() =>
                                    copyToClipboard(
                                        endpoint.fullUrl,
                                        endpoint.name + "-url"
                                    )
                                }
                                className="px-3 py-2 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 rounded transition-all"
                            >
                                {copied[endpoint.name + "-url"] ? (
                                    <FiCheck size={16} />
                                ) : (
                                    <FiCopy size={16} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Auth Warning */}
                    {requiresAuth && !hasToken && (
                        <div className="p-3 bg-yellow-500/20 border border-yellow-500/50 rounded text-yellow-200 text-sm">
                            ⚠️ This endpoint requires authentication. Login
                            first to get a token.
                        </div>
                    )}

                    {/* Request Body */}
                    {endpoint.body && (
                        <div>
                            <p className="text-sm text-text-secondary mb-2">
                                Request Body:
                            </p>
                            <pre className="bg-darker-bg border border-border-color rounded px-3 py-2 text-xs text-candle-yellow overflow-x-auto">
                                {JSON.stringify(endpoint.body, null, 2)}
                            </pre>
                        </div>
                    )}

                    {/* Test Button & Result */}
                    <div className="flex gap-2 items-start">
                        <button
                            onClick={onTest}
                            disabled={isLoading || (requiresAuth && !hasToken)}
                            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FiPlay size={16} />
                            {isLoading ? "Testing..." : "Test Endpoint"}
                        </button>
                    </div>

                    {/* Result */}
                    {result && (
                        <div
                            className={`p-4 rounded border ${
                                result.success
                                    ? "bg-green-500/10 border-green-500/30"
                                    : "bg-red-500/10 border-red-500/30"
                            }`}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                {result.success ? (
                                    <FiCheck
                                        className="text-green-400"
                                        size={20}
                                    />
                                ) : (
                                    <FiX className="text-red-400" size={20} />
                                )}
                                <span
                                    className={`font-bold ${
                                        result.success
                                            ? "text-green-400"
                                            : "text-red-400"
                                    }`}
                                >
                                    {result.success
                                        ? "✓ Request Successful"
                                        : "✗ Request Failed"}
                                </span>
                                <span className="text-xs text-text-secondary">
                                    {result.timestamp}
                                </span>
                            </div>
                            <pre className="bg-darker-bg border border-border-color rounded px-3 py-2 text-xs text-candle-yellow overflow-x-auto">
                                {JSON.stringify(
                                    result.success ? result.data : result.error,
                                    null,
                                    2
                                )}
                            </pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default APIExplorer;
