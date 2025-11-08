import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../components/Toast";

function AdminDashboardPage({ admin, adminToken, onLogout }) {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState("dashboard");
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState("");
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            setLoading(true);
            if (activeTab === "dashboard") {
                const res = await axios.get(
                    "http://localhost:5001/api/admin/dashboard/stats",
                    {
                        headers: { Authorization: `Bearer ${adminToken}` },
                    }
                );
                if (res.data.success) setStats(res.data.stats);
            } else if (activeTab === "orders") {
                const res = await axios.get(
                    "http://localhost:5001/api/admin/orders",
                    {
                        headers: { Authorization: `Bearer ${adminToken}` },
                    }
                );
                if (res.data.success) setOrders(res.data.orders);
            } else if (activeTab === "products") {
                const res = await axios.get(
                    "http://localhost:5001/api/admin/products",
                    {
                        headers: { Authorization: `Bearer ${adminToken}` },
                    }
                );
                if (res.data.success) setProducts(res.data.products);
            }
        } catch (err) {
            toast.addToast(
                err.response?.data?.message || "خطأ في جلب البيانات",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!adminToken) {
            navigate("/admin/login");
            return;
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab, adminToken]);

    const handleUpdateStatus = async (orderId) => {
        try {
            const res = await axios.put(
                `http://localhost:5001/api/admin/orders/${orderId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${adminToken}` } }
            );
            if (res.data.success) {
                toast.addToast("تم تحديث الحالة بنجاح", "success");
                setSelectedOrder(null);
                setNewStatus("");
                fetchData();
            }
        } catch (err) {
            toast.addToast(
                err.response?.data?.message || "خطأ في التحديث",
                "error"
            );
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminData");
        onLogout();
        navigate("/admin/login");
    };

    const statusMap = {
        requested: { ar: "جديد", color: "#3498db" },
        under_discussion: { ar: "قيد المناقشة", color: "#f39c12" },
        payed: { ar: "تمّ الدفع", color: "#27ae60" },
        delivering: { ar: "جاري التوصيل", color: "#e74c3c" },
        delivered_successfully: { ar: "توصّل بنجاح", color: "#2ecc71" },
    };

    return (
        <div className="min-h-screen bg-dark-bg">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-dark-bg/98 backdrop-blur-md border-b-2 border-candle-yellow/20 shadow-lg">
                <div className="container">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-candle-yellow to-bright-yellow bg-clip-text text-transparent">
                            لوحة التحكم 📊
                        </h1>
                        <div className="flex items-center gap-6">
                            <span className="text-candle-white">
                                أهلا {admin?.name}
                            </span>
                            <button
                                className="btn-secondary"
                                onClick={handleLogout}
                            >
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
                        {["dashboard", "orders", "products"].map((tab) => (
                            <button
                                key={tab}
                                className={`w-full text-right px-4 py-3 rounded-lg transition-all ${
                                    activeTab === tab
                                        ? "bg-gradient-to-r from-candle-yellow to-bright-yellow text-darker-bg font-semibold"
                                        : "text-candle-white hover:bg-dark-bg"
                                }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab === "dashboard" && "📊 الإحصائيات"}
                                {tab === "orders" && "📦 الطلبات"}
                                {tab === "products" && "🛍️ المنتجات"}
                            </button>
                        ))}
                    </div>
                </nav>

                {/* Content Area */}
                <div className="flex-1 p-6 md:p-8">
                    {/* Dashboard Tab */}
                    {activeTab === "dashboard" && (
                        <div>
                            <h2 className="text-3xl font-bold text-candle-white mb-8">
                                لوحة التحكم
                            </h2>
                            {loading ? (
                                <p className="text-center text-candle-yellow text-lg">
                                    جاري التحميل...
                                </p>
                            ) : stats ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                                        <div className="text-blue-300 text-sm font-semibold mb-2">
                                            إجمالي الطلبات
                                        </div>
                                        <div className="text-4xl font-bold text-blue-200">
                                            {stats.total_orders}
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
                                        <div className="text-yellow-300 text-sm font-semibold mb-2">
                                            طلبات اليوم
                                        </div>
                                        <div className="text-4xl font-bold text-yellow-200">
                                            {stats.today_orders}
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-orange-500/20 to-orange-500/10 border border-orange-500/30 rounded-xl p-6">
                                        <div className="text-orange-300 text-sm font-semibold mb-2">
                                            طلبات جديدة
                                        </div>
                                        <div className="text-4xl font-bold text-orange-200">
                                            {stats.pending_orders}
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-green-500/20 to-green-500/10 border border-green-500/30 rounded-xl p-6">
                                        <div className="text-green-300 text-sm font-semibold mb-2">
                                            طلبات مكتملة
                                        </div>
                                        <div className="text-4xl font-bold text-green-200">
                                            {stats.completed_orders}
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === "orders" && (
                        <div>
                            <h2 className="text-3xl font-bold text-candle-white mb-8">
                                إدارة الطلبات
                            </h2>
                            {loading ? (
                                <p className="text-center text-candle-yellow text-lg">
                                    جاري التحميل...
                                </p>
                            ) : orders.length > 0 ? (
                                <div className="overflow-x-auto bg-card-bg border border-border-color rounded-xl">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-border-color bg-dark-bg/50">
                                                <th className="px-6 py-4 text-right text-text-muted text-sm font-semibold">
                                                    رقم الطلب
                                                </th>
                                                <th className="px-6 py-4 text-right text-text-muted text-sm font-semibold">
                                                    اسم الزبون
                                                </th>
                                                <th className="px-6 py-4 text-right text-text-muted text-sm font-semibold">
                                                    الهاتف
                                                </th>
                                                <th className="px-6 py-4 text-right text-text-muted text-sm font-semibold">
                                                    المنتج
                                                </th>
                                                <th className="px-6 py-4 text-right text-text-muted text-sm font-semibold">
                                                    الكمية
                                                </th>
                                                <th className="px-6 py-4 text-right text-text-muted text-sm font-semibold">
                                                    الحالة
                                                </th>
                                                <th className="px-6 py-4 text-right text-text-muted text-sm font-semibold">
                                                    الإجراءات
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((order) => (
                                                <tr
                                                    key={order.id}
                                                    className="border-b border-border-color hover:bg-dark-bg/50 transition-colors"
                                                >
                                                    <td className="px-6 py-4 text-text-primary">
                                                        #{order.id}
                                                    </td>
                                                    <td className="px-6 py-4 text-candle-white font-medium">
                                                        {order.customer?.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-text-primary">
                                                        {order.customer?.phone}
                                                    </td>
                                                    <td className="px-6 py-4 text-text-primary">
                                                        {order.product?.name}
                                                    </td>
                                                    <td className="px-6 py-4 text-text-primary">
                                                        {order.quantity}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                                            {order.status_label}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            className="px-4 py-2 bg-candle-yellow text-darker-bg rounded-lg font-semibold hover:shadow-yellow-md transition-all"
                                                            onClick={() => {
                                                                setSelectedOrder(
                                                                    order
                                                                );
                                                                setNewStatus(
                                                                    order.status
                                                                );
                                                            }}
                                                        >
                                                            تحديث
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-center text-text-muted py-8">
                                    لا توجد طلبات
                                </p>
                            )}
                        </div>
                    )}

                    {/* Products Tab */}
                    {activeTab === "products" && (
                        <div>
                            <h2 className="text-3xl font-bold text-candle-white mb-8">
                                إدارة المنتجات
                            </h2>
                            {loading ? (
                                <p className="text-center text-candle-yellow text-lg">
                                    جاري التحميل...
                                </p>
                            ) : products.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.map((product) => (
                                        <div key={product.id} className="card">
                                            <div className="text-5xl text-center py-6 bg-gradient-to-br from-candle-yellow/20 to-bright-yellow/20">
                                                🧴
                                            </div>
                                            <div className="p-6">
                                                <h3 className="text-lg font-semibold text-candle-white mb-2">
                                                    {product.name}
                                                </h3>
                                                <p className="text-text-muted text-sm mb-3">
                                                    {product.category}
                                                </p>
                                                <div className="flex justify-between items-center mb-4">
                                                    <span className="text-bright-yellow font-bold">
                                                        {product.price} دج
                                                    </span>
                                                    <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                                                        المخزون: {product.stock}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="flex-1 px-3 py-2 bg-candle-yellow text-darker-bg rounded font-semibold text-sm hover:shadow-yellow-md transition-all">
                                                        تعديل
                                                    </button>
                                                    <button className="flex-1 px-3 py-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded font-semibold text-sm hover:bg-red-500/30 transition-all">
                                                        حذف
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-text-muted py-8">
                                    لا توجد منتجات
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal for updating order status */}
            {selectedOrder && (
                <div
                    className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
                    onClick={() => setSelectedOrder(null)}
                >
                    <div
                        className="bg-card-bg border border-border-color rounded-xl max-w-md w-full shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center p-6 border-b border-border-color">
                            <h3 className="text-xl font-bold text-candle-white">
                                تعديل حالة الطلب #{selectedOrder.id}
                            </h3>
                            <button
                                className="text-text-muted hover:text-candle-white text-2xl"
                                onClick={() => setSelectedOrder(null)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6">
                            <label className="block text-text-primary font-medium mb-3">
                                حالة الطلب الجديدة
                            </label>
                            <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="w-full px-4 py-3 bg-dark-bg border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-candle-yellow"
                            >
                                <option value="">اختر حالة...</option>
                                {[
                                    { key: "requested", label: "جديد" },
                                    {
                                        key: "under_discussion",
                                        label: "قيد المناقشة",
                                    },
                                    { key: "payed", label: "تمّ الدفع" },
                                    {
                                        key: "delivering",
                                        label: "جاري التوصيل",
                                    },
                                    {
                                        key: "delivered_successfully",
                                        label: "توصّل بنجاح",
                                    },
                                ].map((status) => (
                                    <option key={status.key} value={status.key}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex gap-3 p-6 border-t border-border-color">
                            <button
                                className="btn-primary flex-1"
                                onClick={() =>
                                    handleUpdateStatus(selectedOrder.id)
                                }
                            >
                                تحديث
                            </button>
                            <button
                                className="btn-secondary flex-1"
                                onClick={() => setSelectedOrder(null)}
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboardPage;
