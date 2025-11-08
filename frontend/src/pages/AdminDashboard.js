// Admin Dashboard - Main Layout
// Handles navigation between admin sections

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiBarChart3,
    FiPackage,
    FiShoppingCart,
    FiLogOut,
    FiToggle2,
} from "react-icons/fi";
import AdminStatsPage from "./AdminStatsPage";
import AdminOrdersPage from "./AdminOrdersPage";
import AdminProductsPage from "./AdminProductsPage";
import AdminFeaturesPage from "./AdminFeaturesPage";

function AdminDashboard({ admin, adminToken, onLogout }) {
    const [activeTab, setActiveTab] = useState("dashboard");
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        onLogout();
        navigate("/admin/login");
    };

    return (
        <div className="min-h-screen bg-dark-bg">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-dark-bg/98 backdrop-blur-md border-b-2 border-candle-yellow/20 shadow-lg">
                <div className="container">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-candle-yellow to-bright-yellow bg-clip-text text-transparent">
                            لوحة التحكم
                        </h1>
                        <div className="flex items-center gap-6">
                            <span className="text-candle-white">
                                أهلا {admin?.name}
                            </span>
                            <button
                                className="btn-secondary flex items-center gap-2"
                                onClick={handleLogout}
                            >
                                <FiLogOut size={18} />
                                خروج
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar Navigation */}
                <nav className="w-full md:w-48 bg-card-bg border-r border-border-color p-4 md:min-h-[calc(100vh-80px)]">
                    <div className="space-y-2">
                        {[
                            {
                                key: "dashboard",
                                label: "الإحصائيات",
                                icon: FiBarChart3,
                            },
                            {
                                key: "orders",
                                label: "الطلبات",
                                icon: FiPackage,
                            },
                            {
                                key: "products",
                                label: "المنتجات",
                                icon: FiShoppingCart,
                            },
                            {
                                key: "features",
                                label: "إدارة الميزات",
                                icon: FiToggle2,
                            },
                        ].map((tab) => {
                            const IconComponent = tab.icon;
                            return (
                                <button
                                    key={tab.key}
                                    className={`w-full text-right px-4 py-3 rounded-lg transition-all flex items-center justify-start gap-3 ${
                                        activeTab === tab.key
                                            ? "bg-gradient-to-r from-candle-yellow to-bright-yellow text-darker-bg font-semibold"
                                            : "text-candle-white hover:bg-dark-bg"
                                    }`}
                                    onClick={() => setActiveTab(tab.key)}
                                >
                                    <IconComponent size={20} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </nav>

                {/* Content Area */}
                <div className="flex-1 p-6 md:p-8">
                    {activeTab === "dashboard" && (
                        <AdminStatsPage adminToken={adminToken} />
                    )}
                    {activeTab === "orders" && (
                        <AdminOrdersPage adminToken={adminToken} />
                    )}
                    {activeTab === "products" && (
                        <AdminProductsPage adminToken={adminToken} />
                    )}
                    {activeTab === "features" && (
                        <AdminFeaturesPage adminToken={adminToken} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
