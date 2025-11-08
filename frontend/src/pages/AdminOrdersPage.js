// Admin Orders Page - Order Management

import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminOrdersPage({ adminToken }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState("");

    useEffect(() => {
        fetchOrders();
    }, [adminToken]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                "http://localhost:5001/api/admin/orders",
                {
                    headers: { Authorization: `Bearer ${adminToken}` },
                }
            );
            if (res.data.success) {
                setOrders(res.data.orders);
            }
        } catch (err) {
            console.error("Failed to fetch orders:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (orderId) => {
        if (!newStatus) return;

        try {
            const res = await axios.put(
                `http://localhost:5001/api/admin/orders/${orderId}/status`,
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${adminToken}` },
                }
            );

            if (res.data.success) {
                setSelectedOrder(null);
                setNewStatus("");
                fetchOrders();
            }
        } catch (err) {
            console.error("Failed to update status:", err);
        }
    };

    const statusMap = {
        requested: { ar: "جديد", color: "#3498db" },
        under_discussion: { ar: "قيد المناقشة", color: "#f39c12" },
        payed: { ar: "تمّ الدفع", color: "#27ae60" },
        delivering: { ar: "جاري التوصيل", color: "#e74c3c" },
        delivered_successfully: { ar: "توصّل بنجاح", color: "#2ecc71" },
    };

    return (
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
                                            {statusMap[order.status]?.ar ||
                                                order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            className="px-4 py-2 bg-candle-yellow text-darker-bg rounded-lg font-semibold hover:shadow-yellow-md transition-all"
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                setNewStatus(order.status);
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

            {/* Update Status Modal */}
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

export default AdminOrdersPage;
