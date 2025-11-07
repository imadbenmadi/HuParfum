// My Orders Page Component
// Display user orders with status and Telegram linking option

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MyOrdersPage.css";

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
                "http://localhost:5000/api/orders/my-orders",
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
                "http://localhost:5000/api/telegram/generate-link",
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
        payed: { ar: "تمّ الدفع", icon: "✅" },
        delivering: { ar: "جاري التوصيل", icon: "🚚" },
        delivered_successfully: { ar: "توصّل بنجاح", icon: "🎁" },
    };

    return (
        <div className="my-orders-page">
            {/* Header */}
            <header className="header">
                <div className="container">
                    <div className="header-content">
                        <h1>🎁 HuParfum - طلبياتي</h1>
                        <div className="user-menu">
                            <span>مرحبا {user?.name} 👋</span>
                            <button
                                className="btn btn-secondary"
                                onClick={onLogout}
                            >
                                خروج
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <section className="orders-section">
                <div className="container">
                    {loading ? (
                        <div className="loading">جاري تحميل الطلبيات...</div>
                    ) : orders.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">🛍️</div>
                            <h2>ما عندك حتى طلبية هسع</h2>
                            <p>ابدا توضع طلبيات من عندنا الآن!</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate("/products")}
                            >
                                اروح للمتجر
                            </button>
                        </div>
                    ) : (
                        <>
                            <h2>طلبياتي ({orders.length})</h2>
                            <div className="orders-list">
                                {orders.map((order) => (
                                    <div key={order.id} className="order-card">
                                        <div className="order-header">
                                            <div className="order-id">
                                                <span className="order-number">
                                                    الطلب #{order.id}
                                                </span>
                                                <span className="order-date">
                                                    {new Date(
                                                        order.created_at
                                                    ).toLocaleDateString(
                                                        "ar-DZ"
                                                    )}
                                                </span>
                                            </div>
                                            <div className="order-status">
                                                <span
                                                    className={`status-badge status-${order.status}`}
                                                >
                                                    {
                                                        statusLabels[
                                                            order.status
                                                        ]?.icon
                                                    }{" "}
                                                    {
                                                        statusLabels[
                                                            order.status
                                                        ]?.ar
                                                    }
                                                </span>
                                            </div>
                                        </div>

                                        <div className="order-details">
                                            <div className="detail-item">
                                                <span className="label">
                                                    المنتوج:
                                                </span>
                                                <span className="value">
                                                    {order.product?.name}
                                                </span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="label">
                                                    الكمية:
                                                </span>
                                                <span className="value">
                                                    {order.quantity}
                                                </span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="label">
                                                    السعر:
                                                </span>
                                                <span className="value">
                                                    {order.product?.price *
                                                        order.quantity}{" "}
                                                    دج
                                                </span>
                                            </div>
                                            {order.delivery_agency && (
                                                <div className="detail-item">
                                                    <span className="label">
                                                        وكالة التوصيل:
                                                    </span>
                                                    <span className="value">
                                                        {order.delivery_agency}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="order-actions">
                                            {!order.telegram_linked ? (
                                                <button
                                                    className="btn btn-primary"
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
                                                    className="btn btn-success"
                                                    disabled
                                                >
                                                    ✅ راك مربوط مع البوت
                                                </button>
                                            )}

                                            <a
                                                href="https://t.me/houda"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-secondary"
                                            >
                                                💬 تواصل مع هدى
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}

export default MyOrdersPage;
