// Admin Dashboard Component
// Admin panel for managing orders, products, and statistics

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard({ admin, token, onLogout }) {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [activeTab, token]);

    const fetchData = async () => {
        try {
            if (activeTab === "dashboard") {
                const res = await axios.get(
                    "http://localhost:5000/api/admin/dashboard/stats",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (res.data.success) {
                    setStats(res.data.stats);
                }
            } else if (activeTab === "orders") {
                const res = await axios.get(
                    "http://localhost:5000/api/admin/orders",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (res.data.success) {
                    setOrders(res.data.orders);
                }
            }
        } catch (err) {
            console.error("Failed to fetch data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            const res = await axios.put(
                `http://localhost:5000/api/admin/orders/${orderId}/status`,
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (res.data.success) {
                alert("تمّ تحديث الحالة بنجاح");
                fetchData();
            }
        } catch (err) {
            alert("خطأ في تحديث الحالة");
        }
    };

    const statusMap = {
        requested: "جديد",
        under_discussion: "قيد المناقشة",
        payed: "تمّ الدفع",
        delivering: "جاري التوصيل",
        delivered_successfully: "توصّل بنجاح",
    };

    return (
        <div className="admin-dashboard">
            {/* Header */}
            <header className="admin-header">
                <div className="container">
                    <h1>Admin Dashboard - HuParfum</h1>
                    <div className="admin-info">
                        <span>مرحبا {admin?.name} (إداري)</span>
                        <button
                            className="btn btn-secondary"
                            onClick={onLogout}
                        >
                            خروج
                        </button>
                    </div>
                </div>
            </header>

            {/* Sidebar Navigation */}
            <div className="admin-container">
                <nav className="admin-nav">
                    <button
                        className={`nav-item ${
                            activeTab === "dashboard" ? "active" : ""
                        }`}
                        onClick={() => {
                            setActiveTab("dashboard");
                            setLoading(true);
                        }}
                    >
                        Dashboard
                    </button>
                    <button
                        className={`nav-item ${
                            activeTab === "orders" ? "active" : ""
                        }`}
                        onClick={() => {
                            setActiveTab("orders");
                            setLoading(true);
                        }}
                    >
                        Orders
                    </button>
                    <button
                        className={`nav-item ${
                            activeTab === "products" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("products")}
                    >
                        Products
                    </button>
                    <button
                        className={`nav-item ${
                            activeTab === "settings" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("settings")}
                    >
                        Settings
                    </button>
                </nav>

                {/* Main Content */}
                <main className="admin-content">
                    {loading ? (
                        <div className="loading">جاري التحميل...</div>
                    ) : activeTab === "dashboard" ? (
                        <div className="dashboard-tab">
                            <h2>Dashboard Stats</h2>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-label">
                                        إجمالي الطلبيات
                                    </div>
                                    <div className="stat-value">
                                        {stats?.total_orders || 0}
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-label">
                                        طلبيات اليوم
                                    </div>
                                    <div className="stat-value">
                                        {stats?.today_orders || 0}
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-label">
                                        الطلبيات قيد الانتظار
                                    </div>
                                    <div className="stat-value">
                                        {stats?.pending_orders || 0}
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-label">
                                        الطلبيات المكتملة
                                    </div>
                                    <div className="stat-value">
                                        {stats?.completed_orders || 0}
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-label">
                                        إجمالي الزبائن
                                    </div>
                                    <div className="stat-value">
                                        {stats?.total_users || 0}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : activeTab === "orders" ? (
                        <div className="orders-tab">
                            <h2>📦 إدارة الطلبيات</h2>
                            <div className="orders-table-wrapper">
                                <table className="orders-table">
                                    <thead>
                                        <tr>
                                            <th>رقم الطلب</th>
                                            <th>الزبون</th>
                                            <th>الهاتف</th>
                                            <th>المنتوج</th>
                                            <th>الحالة</th>
                                            <th>الإجراءات</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.id}>
                                                <td>#{order.id}</td>
                                                <td>{order.customer.name}</td>
                                                <td>{order.customer.phone}</td>
                                                <td>{order.product.name}</td>
                                                <td>
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) =>
                                                            handleUpdateStatus(
                                                                order.id,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="status-select"
                                                    >
                                                        <option value="requested">
                                                            جديد
                                                        </option>
                                                        <option value="under_discussion">
                                                            قيد المناقشة
                                                        </option>
                                                        <option value="payed">
                                                            تمّ الدفع
                                                        </option>
                                                        <option value="delivering">
                                                            جاري التوصيل
                                                        </option>
                                                        <option value="delivered_successfully">
                                                            توصّل بنجاح
                                                        </option>
                                                    </select>
                                                </td>
                                                <td className="actions">
                                                    <a
                                                        href={`https://t.me/${order.customer.telegram_username}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-small"
                                                    >
                                                        Message
                                                    </a>
                                                    <button
                                                        className="btn btn-small"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(
                                                                order.customer
                                                                    .phone
                                                            );
                                                            alert(
                                                                "تمّ نسخ الرقم"
                                                            );
                                                        }}
                                                    >
                                                        📋
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : activeTab === "products" ? (
                        <div className="products-tab">
                            <h2>Manage Products</h2>
                            <p>This feature is coming soon</p>
                        </div>
                    ) : activeTab === "settings" ? (
                        <div className="settings-tab">
                            <h2>Settings</h2>
                            <p>This feature is coming soon</p>
                        </div>
                    ) : null}
                </main>
            </div>
        </div>
    );
}

export default AdminDashboard;
