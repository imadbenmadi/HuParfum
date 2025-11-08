import React from "react";
import {
    FiExternalLink,
    FiTrendingUp,
    FiSettings,
    FiBook,
} from "react-icons/fi";

const TestingHub = () => {
    const testingTools = [
        {
            name: "🚀 Interactive API Tester",
            description:
                "Test all API endpoints with a comprehensive interactive interface",
            link: "/api-tester",
            icon: "🧪",
            features: [
                "Test all GET, POST, PUT, DELETE endpoints",
                "Auto-fill request bodies with examples",
                "Real-time response display",
                "Token management for authenticated requests",
                "Copy response to clipboard",
            ],
        },
        {
            name: "📚 Swagger API Documentation",
            description: "Full API documentation with interactive Swagger UI",
            link: "http://localhost:5001/api-docs",
            external: true,
            icon: "📖",
            features: [
                "Complete OpenAPI 3.0 documentation",
                "Try-it-out feature for all endpoints",
                "Schema validation",
                "Authentication management",
                "Real-time request/response examples",
            ],
        },
    ];

    const testScenarios = [
        {
            title: "🔐 Authentication Flow",
            steps: [
                "1. Click 'Interactive API Tester'",
                "2. Go to 'Authentication' section",
                "3. Test 'Admin Login' with credentials: admin@huparfum.com / admin-password",
                "4. Copy the returned token to the 'Admin Token' field at the top",
                "5. All authenticated requests will now work",
            ],
        },
        {
            title: "🏪 Product Management",
            steps: [
                "1. Ensure you're logged in with admin token",
                "2. Test 'Get All Products' to see existing products",
                "3. Test 'Create Product' to add a new product",
                "4. Verify the new product appears in the list",
            ],
        },
        {
            title: "⚙️ Settings Management",
            steps: [
                "1. Test 'Get Public Settings' (no auth needed)",
                "2. Test 'Get Settings by Category' with different categories",
                "3. Login with admin token",
                "4. Test 'Update Settings' to modify website configuration",
                "5. Verify changes are reflected in the homepage",
            ],
        },
        {
            title: "🎁 Order Management",
            steps: [
                "1. Create a user account if not already done",
                "2. Login with user credentials",
                "3. Copy the user token to the API Tester",
                "4. Test 'Create Order' with product IDs and quantities",
                "5. Test 'Get My Orders' to see created orders",
                "6. Login as admin to see all orders",
            ],
        },
    ];

    const criticalEndpoints = [
        {
            method: "POST",
            path: "/api/auth/admin-login",
            name: "Admin Login",
            importance: "CRITICAL",
        },
        {
            method: "GET",
            path: "/api/admin/products",
            name: "Get Products",
            importance: "HIGH",
        },
        {
            method: "POST",
            path: "/api/admin/products",
            name: "Create Product",
            importance: "HIGH",
        },
        {
            method: "GET",
            path: "/api/admin/settings",
            name: "Get All Settings",
            importance: "HIGH",
        },
        {
            method: "PUT",
            path: "/api/admin/settings/:key",
            name: "Update Settings",
            importance: "HIGH",
        },
        {
            method: "GET",
            path: "/health",
            name: "Health Check",
            importance: "MEDIUM",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            {/* Navigation */}
            <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-yellow-400">
                        🧪 HuParfum Testing Hub
                    </h1>
                    <a
                        href="/"
                        className="text-gray-400 hover:text-yellow-400 transition"
                    >
                        Back to Home
                    </a>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Quick Links */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-yellow-400 mb-6">
                        🎯 Testing Tools
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {testingTools.map((tool, idx) => (
                            <div
                                key={idx}
                                className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-yellow-400 transition"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-xl font-bold text-yellow-400">
                                            {tool.name}
                                        </h3>
                                        <span className="text-3xl">
                                            {tool.icon}
                                        </span>
                                    </div>

                                    <p className="text-gray-400 mb-4">
                                        {tool.description}
                                    </p>

                                    <div className="mb-4">
                                        <h4 className="text-sm font-semibold text-gray-300 mb-2">
                                            Features:
                                        </h4>
                                        <ul className="space-y-1">
                                            {tool.features.map((feat, i) => (
                                                <li
                                                    key={i}
                                                    className="text-sm text-gray-400"
                                                >
                                                    ✓ {feat}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <a
                                        href={tool.link}
                                        target={tool.external ? "_blank" : ""}
                                        rel={
                                            tool.external
                                                ? "noopener noreferrer"
                                                : ""
                                        }
                                        className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-300 transition"
                                    >
                                        Open{" "}
                                        {tool.external && <FiExternalLink />}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Critical Endpoints */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-yellow-400 mb-6">
                        ⚡ Critical Endpoints
                    </h2>
                    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-900 border-b border-gray-700">
                                        <th className="px-6 py-3 text-left text-yellow-400 font-semibold">
                                            Method
                                        </th>
                                        <th className="px-6 py-3 text-left text-yellow-400 font-semibold">
                                            Endpoint
                                        </th>
                                        <th className="px-6 py-3 text-left text-yellow-400 font-semibold">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-yellow-400 font-semibold">
                                            Importance
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {criticalEndpoints.map((ep, idx) => (
                                        <tr
                                            key={idx}
                                            className="hover:bg-gray-700 transition"
                                        >
                                            <td className="px-6 py-3">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-bold ${
                                                        ep.method === "GET"
                                                            ? "bg-blue-600 text-white"
                                                            : ep.method ===
                                                              "POST"
                                                            ? "bg-green-600 text-white"
                                                            : ep.method ===
                                                              "PUT"
                                                            ? "bg-yellow-600 text-black"
                                                            : "bg-red-600 text-white"
                                                    }`}
                                                >
                                                    {ep.method}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 font-mono text-sm text-gray-300">
                                                {ep.path}
                                            </td>
                                            <td className="px-6 py-3 text-gray-300">
                                                {ep.name}
                                            </td>
                                            <td className="px-6 py-3">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-semibold ${
                                                        ep.importance ===
                                                        "CRITICAL"
                                                            ? "bg-red-600 text-white"
                                                            : ep.importance ===
                                                              "HIGH"
                                                            ? "bg-orange-600 text-white"
                                                            : "bg-yellow-600 text-black"
                                                    }`}
                                                >
                                                    {ep.importance}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Test Scenarios */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-yellow-400 mb-6">
                        📋 Testing Scenarios
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {testScenarios.map((scenario, idx) => (
                            <div
                                key={idx}
                                className="bg-gray-800 rounded-lg border border-gray-700 p-6"
                            >
                                <h3 className="text-lg font-bold text-yellow-400 mb-4">
                                    {scenario.title}
                                </h3>
                                <ol className="space-y-2">
                                    {scenario.steps.map((step, i) => (
                                        <li
                                            key={i}
                                            className="text-sm text-gray-400"
                                        >
                                            {step}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Database Info */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold text-yellow-400 mb-6">
                        💾 Seeded Database
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                            <h3 className="text-yellow-400 font-bold mb-3">
                                👤 Admin Accounts
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="bg-gray-900 p-3 rounded">
                                    <p className="text-gray-300">
                                        <strong>Super Admin:</strong>
                                    </p>
                                    <p className="text-gray-400 text-xs font-mono">
                                        admin@huparfum.com
                                    </p>
                                    <p className="text-gray-400 text-xs font-mono">
                                        admin-password
                                    </p>
                                </div>
                                <div className="bg-gray-900 p-3 rounded">
                                    <p className="text-gray-300">
                                        <strong>Manager:</strong>
                                    </p>
                                    <p className="text-gray-400 text-xs font-mono">
                                        manager@huparfum.com
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                            <h3 className="text-yellow-400 font-bold mb-3">
                                🧑‍💼 Test Users
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="bg-gray-900 p-3 rounded">
                                    <p className="text-gray-300">
                                        <strong>User 1:</strong>
                                    </p>
                                    <p className="text-gray-400 text-xs font-mono">
                                        test@example.com
                                    </p>
                                    <p className="text-gray-400 text-xs font-mono">
                                        Test@12345
                                    </p>
                                </div>
                                <div className="bg-gray-900 p-3 rounded">
                                    <p className="text-gray-300">
                                        <strong>User 2:</strong>
                                    </p>
                                    <p className="text-gray-400 text-xs font-mono">
                                        john@example.com
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                            <h3 className="text-yellow-400 font-bold mb-3">
                                🛍️ Products
                            </h3>
                            <div className="space-y-2 text-sm text-gray-400">
                                <p>✓ 8 Algerian Products</p>
                                <p>✓ Perfumes & Candles</p>
                                <p>✓ Arabic Descriptions</p>
                                <p>✓ Pricing Ready</p>
                                <div className="mt-3 text-xs">
                                    <p className="text-yellow-400">
                                        Use API Tester to:
                                    </p>
                                    <p>• View all products</p>
                                    <p>• Add new products</p>
                                    <p>• Update products</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Instructions */}
                <section className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-12">
                    <h2 className="text-2xl font-bold text-yellow-400 mb-4">
                        📖 Quick Start Guide
                    </h2>
                    <div className="space-y-3 text-gray-400">
                        <p>
                            <strong className="text-yellow-400">
                                1. Start Testing:
                            </strong>{" "}
                            Click on 'Interactive API Tester' above to begin
                            testing all endpoints
                        </p>
                        <p>
                            <strong className="text-yellow-400">
                                2. Admin Login First:
                            </strong>{" "}
                            Test the 'Admin Login' endpoint with{" "}
                            <code className="bg-gray-900 px-2 py-1 rounded text-xs">
                                admin@huparfum.com
                            </code>{" "}
                            and copy the token
                        </p>
                        <p>
                            <strong className="text-yellow-400">
                                3. Paste Token:
                            </strong>{" "}
                            Paste the admin token in the token field for
                            authenticated requests
                        </p>
                        <p>
                            <strong className="text-yellow-400">
                                4. Test All Endpoints:
                            </strong>{" "}
                            Use the provided test scenarios to verify all
                            functionality
                        </p>
                        <p>
                            <strong className="text-yellow-400">
                                5. Check Responses:
                            </strong>{" "}
                            View real-time API responses and verify the data
                        </p>
                    </div>
                </section>

                {/* Status */}
                <section className="bg-green-900 border border-green-700 rounded-lg p-6 mb-12">
                    <h3 className="text-xl font-bold text-green-400 mb-3">
                        ✅ System Status
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <p className="text-2xl">🗄️</p>
                            <p className="text-green-300 text-sm">Database</p>
                            <p className="text-green-400 font-bold">Online</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl">🖥️</p>
                            <p className="text-green-300 text-sm">Backend</p>
                            <p className="text-green-400 font-bold">
                                Port 5001
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl">⚛️</p>
                            <p className="text-green-300 text-sm">Frontend</p>
                            <p className="text-green-400 font-bold">
                                Port 3002
                            </p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl">📚</p>
                            <p className="text-green-300 text-sm">Swagger</p>
                            <p className="text-green-400 font-bold">
                                /api-docs
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default TestingHub;
