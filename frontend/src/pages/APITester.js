import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    FiCopy,
    FiCheck,
    FiX,
    FiChevronDown,
    FiChevronUp,
} from "react-icons/fi";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const APITester = () => {
    const [endpoints, setEndpoints] = useState([]);
    const [selectedEndpoint, setSelectedEndpoint] = useState(null);
    const [method, setMethod] = useState("GET");
    const [headers, setHeaders] = useState({});
    const [body, setBody] = useState("{}");
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [expandedEndpoint, setExpandedEndpoint] = useState(null);
    const [authToken, setAuthToken] = useState(
        localStorage.getItem("adminToken") || ""
    );

    const apiEndpoints = [
        {
            category: "🔐 Authentication",
            endpoints: [
                {
                    name: "Admin Login",
                    method: "POST",
                    path: "/api/auth/admin-login",
                    description: "Login as admin with email and password",
                    body: {
                        email: "admin@huparfum.com",
                        password: "admin-password",
                    },
                    requiresAuth: false,
                },
                {
                    name: "User Register",
                    method: "POST",
                    path: "/api/auth/register",
                    description: "Register a new user account",
                    body: {
                        name: "Test User",
                        email: "test@example.com",
                        phone: "0123456789",
                        password: "Test@12345",
                    },
                    requiresAuth: false,
                },
                {
                    name: "User Login",
                    method: "POST",
                    path: "/api/auth/login",
                    description: "Login as regular user",
                    body: {
                        email: "test@example.com",
                        password: "Test@12345",
                    },
                    requiresAuth: false,
                },
            ],
        },
        {
            category: "🏪 Products",
            endpoints: [
                {
                    name: "Get All Products",
                    method: "GET",
                    path: "/api/admin/products",
                    description: "Fetch all products (admin only)",
                    requiresAuth: true,
                },
                {
                    name: "Create Product",
                    method: "POST",
                    path: "/api/admin/products",
                    description: "Add a new product (admin only)",
                    body: {
                        name: "New Perfume",
                        description: "A great perfume",
                        price: 3500,
                        image_url: "https://via.placeholder.com/300x300",
                    },
                    requiresAuth: true,
                },
            ],
        },
        {
            category: "⚙️ Settings",
            endpoints: [
                {
                    name: "Get Public Settings",
                    method: "GET",
                    path: "/api/settings/social_media",
                    description: "Get public website settings",
                    requiresAuth: false,
                },
                {
                    name: "Get Settings by Category",
                    method: "GET",
                    path: "/api/settings/category/contact",
                    description: "Get settings by category",
                    requiresAuth: false,
                },
                {
                    name: "Get All Admin Settings",
                    method: "GET",
                    path: "/api/admin/settings",
                    description: "Get all website settings (admin only)",
                    requiresAuth: true,
                },
                {
                    name: "Update Settings",
                    method: "PUT",
                    path: "/api/admin/settings/social_media",
                    description: "Update website settings (admin only)",
                    body: {
                        value: {
                            telegram: "https://t.me/huparfum",
                            instagram: "@huparfum",
                        },
                    },
                    requiresAuth: true,
                },
            ],
        },
        {
            category: "🎁 Orders",
            endpoints: [
                {
                    name: "Get My Orders",
                    method: "GET",
                    path: "/api/orders",
                    description: "Get user's orders",
                    requiresAuth: true,
                },
                {
                    name: "Create Order",
                    method: "POST",
                    path: "/api/orders",
                    description: "Create a new order",
                    body: {
                        items: [
                            {
                                product_id: 1,
                                quantity: 2,
                            },
                        ],
                        total_price: 7000,
                    },
                    requiresAuth: true,
                },
            ],
        },
        {
            category: "📊 Admin Dashboard",
            endpoints: [
                {
                    name: "Get Dashboard Stats",
                    method: "GET",
                    path: "/api/admin/stats",
                    description: "Get admin dashboard statistics",
                    requiresAuth: true,
                },
                {
                    name: "Get All Orders (Admin)",
                    method: "GET",
                    path: "/api/admin/orders",
                    description: "Get all orders for admin",
                    requiresAuth: true,
                },
            ],
        },
        {
            category: "❓ Health & Info",
            endpoints: [
                {
                    name: "Health Check",
                    method: "GET",
                    path: "/health",
                    description: "Check if backend is running",
                    requiresAuth: false,
                },
            ],
        },
    ];

    const testEndpoint = async () => {
        if (!selectedEndpoint) return;

        setLoading(true);
        try {
            const config = {
                method,
                url: `${API_BASE_URL}${selectedEndpoint.path}`,
                headers: {
                    "Content-Type": "application/json",
                    ...headers,
                },
            };

            if (authToken && selectedEndpoint.requiresAuth) {
                config.headers.Authorization = `Bearer ${authToken}`;
            }

            if (method !== "GET" && body) {
                config.data = JSON.parse(body);
            }

            const res = await axios(config);
            setResponse({
                status: res.status,
                statusText: res.statusText,
                data: res.data,
                headers: res.headers,
            });
        } catch (error) {
            setResponse({
                status: error.response?.status || 0,
                statusText: error.response?.statusText || "Error",
                data: error.response?.data || {
                    error: error.message,
                },
                error: true,
            });
        }
        setLoading(false);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-yellow-400 mb-2">
                        🚀 API Tester
                    </h1>
                    <p className="text-gray-400">
                        Interactive API testing interface for HuParfum Backend
                    </p>
                </div>

                {/* Auth Token Section */}
                <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
                    <label className="block text-sm font-semibold text-yellow-400 mb-2">
                        Admin Token (Auto-filled from login):
                    </label>
                    <textarea
                        value={authToken}
                        onChange={(e) => {
                            setAuthToken(e.target.value);
                            localStorage.setItem("adminToken", e.target.value);
                        }}
                        placeholder="Paste admin token here for authenticated requests"
                        className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-400 focus:outline-none text-sm font-mono"
                        rows="2"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* API Endpoints List */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden sticky top-6">
                            <div className="bg-gray-900 px-4 py-3 border-b border-gray-700">
                                <h2 className="text-lg font-bold text-yellow-400">
                                    📋 Endpoints
                                </h2>
                            </div>

                            <div className="overflow-y-auto max-h-96">
                                {apiEndpoints.map((category, idx) => (
                                    <div key={idx}>
                                        <button
                                            onClick={() =>
                                                setExpandedEndpoint(
                                                    expandedEndpoint === idx
                                                        ? null
                                                        : idx
                                                )
                                            }
                                            className="w-full px-4 py-2 bg-gray-700 text-yellow-400 font-semibold text-sm hover:bg-gray-600 flex items-center justify-between"
                                        >
                                            {category.category}
                                            {expandedEndpoint === idx ? (
                                                <FiChevronUp />
                                            ) : (
                                                <FiChevronDown />
                                            )}
                                        </button>

                                        {expandedEndpoint === idx && (
                                            <div>
                                                {category.endpoints.map(
                                                    (ep, epIdx) => (
                                                        <button
                                                            key={epIdx}
                                                            onClick={() => {
                                                                setSelectedEndpoint(
                                                                    ep
                                                                );
                                                                setMethod(
                                                                    ep.method
                                                                );
                                                                if (ep.body) {
                                                                    setBody(
                                                                        JSON.stringify(
                                                                            ep.body,
                                                                            null,
                                                                            2
                                                                        )
                                                                    );
                                                                } else {
                                                                    setBody(
                                                                        "{}"
                                                                    );
                                                                }
                                                            }}
                                                            className={`w-full px-4 py-3 text-left border-l-4 text-sm transition ${
                                                                selectedEndpoint?.path ===
                                                                ep.path
                                                                    ? "bg-gray-700 border-yellow-400 text-yellow-300"
                                                                    : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700"
                                                            }`}
                                                        >
                                                            <div className="font-mono text-xs">
                                                                <span
                                                                    className={`inline-block px-2 py-1 rounded mr-2 font-bold ${
                                                                        ep.method ===
                                                                        "GET"
                                                                            ? "bg-blue-600"
                                                                            : ep.method ===
                                                                              "POST"
                                                                            ? "bg-green-600"
                                                                            : ep.method ===
                                                                              "PUT"
                                                                            ? "bg-yellow-600"
                                                                            : "bg-red-600"
                                                                    }`}
                                                                >
                                                                    {ep.method}
                                                                </span>
                                                            </div>
                                                            <div className="mt-1">
                                                                {ep.name}
                                                            </div>
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Request Builder */}
                    <div className="lg:col-span-2">
                        {selectedEndpoint ? (
                            <div className="space-y-6">
                                {/* Endpoint Info */}
                                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                                    <h3 className="text-lg font-bold text-yellow-400 mb-2">
                                        {selectedEndpoint.name}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-3">
                                        {selectedEndpoint.description}
                                    </p>

                                    <div className="bg-gray-900 p-3 rounded font-mono text-sm text-gray-300 mb-3">
                                        <span
                                            className={`inline-block px-2 py-1 rounded mr-2 font-bold ${
                                                method === "GET"
                                                    ? "bg-blue-600"
                                                    : method === "POST"
                                                    ? "bg-green-600"
                                                    : method === "PUT"
                                                    ? "bg-yellow-600"
                                                    : "bg-red-600"
                                            }`}
                                        >
                                            {method}
                                        </span>
                                        <span className="text-yellow-400">
                                            {selectedEndpoint.path}
                                        </span>
                                    </div>

                                    {selectedEndpoint.requiresAuth && (
                                        <div className="bg-red-900 border border-red-700 text-red-200 px-3 py-2 rounded text-sm">
                                            ⚠️ This endpoint requires
                                            authentication
                                        </div>
                                    )}
                                </div>

                                {/* Request Body */}
                                {method !== "GET" && (
                                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                                        <label className="block text-sm font-semibold text-yellow-400 mb-2">
                                            Request Body:
                                        </label>
                                        <textarea
                                            value={body}
                                            onChange={(e) =>
                                                setBody(e.target.value)
                                            }
                                            className="w-full p-3 bg-gray-700 text-white rounded border border-gray-600 focus:border-yellow-400 focus:outline-none font-mono text-sm"
                                            rows="6"
                                        />
                                    </div>
                                )}

                                {/* Test Button */}
                                <button
                                    onClick={testEndpoint}
                                    disabled={loading}
                                    className="w-full bg-yellow-400 text-black font-bold py-3 rounded-lg hover:bg-yellow-300 disabled:opacity-50 transition"
                                >
                                    {loading
                                        ? "Testing..."
                                        : "🧪 Test Endpoint"}
                                </button>

                                {/* Response */}
                                {response && (
                                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-lg font-bold text-yellow-400">
                                                Response
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`px-3 py-1 rounded font-bold ${
                                                        response.error
                                                            ? "bg-red-600 text-white"
                                                            : response.status >=
                                                                  200 &&
                                                              response.status <
                                                                  300
                                                            ? "bg-green-600 text-white"
                                                            : "bg-orange-600 text-white"
                                                    }`}
                                                >
                                                    {response.status}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        copyToClipboard(
                                                            JSON.stringify(
                                                                response.data,
                                                                null,
                                                                2
                                                            )
                                                        )
                                                    }
                                                    className="p-2 hover:bg-gray-700 rounded transition"
                                                >
                                                    {copied ? (
                                                        <FiCheck className="text-green-400" />
                                                    ) : (
                                                        <FiCopy className="text-gray-400" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <pre className="bg-gray-900 p-4 rounded overflow-auto max-h-64 text-sm text-gray-300 font-mono">
                                            {JSON.stringify(
                                                response.data,
                                                null,
                                                2
                                            )}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
                                <p className="text-gray-400 text-lg">
                                    👈 Select an endpoint to test
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default APITester;
