// My Orders Page Component
// Display user orders with status and Telegram linking option

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyOrdersPage({ token, user, onLogout }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, [token]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(
                "http://localhost:5001/api/orders/my-orders",
                {
                    headers: { Authorization: `Bearer ${token}` },
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

    const handleLinkTelegram = async (orderId) => {
        try {
            const res = await axios.post(
                "http://localhost:5001/api/telegram/generate-link",
                {
                    user_id: user.id,
                    order_id: orderId,
                }
            );

            if (res.data.success) {
                // Open Telegram link
                window.location.href = res.data.deep_link;
            }
        } catch (err) {
            alert("خطأ في إنشاء الرابط");
        }
    };

    const statusLabels = {
        requested: { ar: "جديد", icon: "🆕" },
        under_discussion: { ar: "قيد المناقشة", icon: "💬" },
        payed: { ar: "تمّ الدفع", icon: "" },
        delivering: { ar: "جاري التوصيل", icon: "🚚" },
        delivered_successfully: { ar: "توصّل بنجاح", icon: "🎁" },
    };

    return (
        <div className="min-h-screen bg-dark-bg">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-dark-bg/98 backdrop-blur-md border-b-2 border-candle-yellow/20 shadow-lg">
                <div className="container">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-candle-yellow to-bright-yellow bg-clip-text text-transparent">
                            🎁 HuParfum - طلبياتي
                        </h1>
                        <div className="flex items-center gap-6">
                            <span className="text-candle-white">
                                مرحبا {user?.name} 👋
                            </span>
                            <button
                                className="btn-secondary"
                                onClick={onLogout}
                            >
                                خروج
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <section className="py-12 md:py-16">
                <div className="container">
                    {loading ? (
                        <div className="flex items-center justify-center min-h-[60vh] text-xl font-semibold text-candle-yellow">
                            جاري تحميل الطلبيات...
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-20 bg-card-bg border border-border-color rounded-xl">
                            <div className="text-6xl mb-6">🛍️</div>
                            <h2 className="text-2xl font-bold text-candle-white mb-3">
                                ما عندك حتى طلبية هسع
                            </h2>
                            <p className="text-text-muted mb-8">
                                ابدا توضع طلبيات من عندنا الآن!
                            </p>
                            <button
                                className="btn-primary"
                                onClick={() => navigate("/products")}
                            >
                                اروح للمتجر
                            </button>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-3xl font-bold text-candle-white mb-8">
                                طلبياتي ({orders.length})
                            </h2>
                            <div className="space-y-6">
                                {orders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="bg-card-bg border border-border-color rounded-xl overflow-hidden hover:shadow-lg transition-all"
                                    >
                                        {/* Order Header */}
                                        <div className="p-6 border-b border-border-color flex justify-between items-start">
                                            <div>
                                                <p className="text-text-muted text-sm mb-1">
                                                    الطلب #{order.id}
                                                </p>
                                                <p className="text-candle-white text-sm">
                                                    {new Date(
                                                        order.created_at
                                                    ).toLocaleDateString(
                                                        "ar-DZ"
                                                    )}
                                                </p>
                                            </div>
                                            <span
                                                className={`status-${order.status} inline-block px-4 py-2 rounded-full text-sm font-semibold`}
                                            >
                                                {
                                                    statusLabels[order.status]
                                                        ?.icon
                                                }{" "}
                                                {statusLabels[order.status]?.ar}
                                            </span>
                                        </div>

                                        {/* Order Details */}
                                        <div className="p-6 border-b border-border-color grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <label className="text-text-muted text-sm block mb-1">
                                                    المنتوج
                                                </label>
                                                <p className="text-candle-white font-semibold">
                                                    {order.product?.name}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-text-muted text-sm block mb-1">
                                                    الكمية
                                                </label>
                                                <p className="text-candle-white font-semibold">
                                                    {order.quantity}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="text-text-muted text-sm block mb-1">
                                                    السعر
                                                </label>
                                                <p className="text-bright-yellow font-bold">
                                                    {order.product?.price *
                                                        order.quantity}{" "}
                                                    دج
                                                </p>
                                            </div>
                                            {order.delivery_agency && (
                                                <div>
                                                    <label className="text-text-muted text-sm block mb-1">
                                                        وكالة التوصيل
                                                    </label>
                                                    <p className="text-candle-white font-semibold">
                                                        {order.delivery_agency}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Order Actions */}
                                        <div className="p-6 flex gap-3">
                                            {!order.telegram_linked ? (
                                                <button
                                                    className="btn-primary flex-1"
                                                    onClick={() =>
                                                        handleLinkTelegram(
                                                            order.id
                                                        )
                                                    }
                                                >
                                                    📱 توصّل بالتحديثات في
                                                    تيليجرام
                                                </button>
                                            ) : (
                                                <button
                                                    className="flex-1 px-6 py-3 bg-green-500/20 text-green-300 border border-green-500/50 rounded-md font-semibold cursor-not-allowed"
                                                    disabled
                                                >
                                                    ✓ راك مربوط مع البوت
                                                </button>
                                            )}

                                            <a
                                                href="https://t.me/houda"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-secondary"
                                            >
                                                💬 تواصل مع هدى
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default MyOrdersPage;
