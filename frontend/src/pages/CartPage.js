// Cart Page Component
// Shopping cart and checkout

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./CartPage.css";

function CartPage({ token }) {
    const [cart, setCart] = useState(
        JSON.parse(localStorage.getItem("cart") || "[]")
    );
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleRemoveFromCart = (productId) => {
        const updatedCart = cart.filter((item) => item.id !== productId);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const handleQuantityChange = (productId, quantity) => {
        if (quantity <= 0) {
            handleRemoveFromCart(productId);
            return;
        }

        const updatedCart = cart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
        );
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const handleCheckout = async () => {
        if (!token) {
            navigate("/login");
            return;
        }

        if (cart.length === 0) {
            setMessage("السلة فارغة!");
            return;
        }

        setLoading(true);

        try {
            for (const item of cart) {
                await axios.post(
                    "http://localhost:5000/api/orders/create",
                    {
                        product_id: item.id,
                        quantity: item.quantity,
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
            }

            setMessage("تمّ الطلب بنجاح! ستتكلم معك هدى قريباً");
            localStorage.removeItem("cart");
            setCart([]);

            setTimeout(() => {
                navigate("/my-orders");
            }, 2000);
        } catch (err) {
            setMessage(err.response?.data?.message || "خطأ في الطلب");
        } finally {
            setLoading(false);
        }
    };

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="cart-page">
            <header className="header">
                <div className="container">
                    <Link to="/" className="logo">
                        <h1>🎁 HuParfum</h1>
                    </Link>
                    <nav className="nav">
                        <Link to="/">الرئيسية</Link>
                        <Link to="/products">المتجر</Link>
                    </nav>
                </div>
            </header>

            <section className="cart-section">
                <div className="container">
                    <h1>🛒 السلة ديالي</h1>

                    {message && (
                        <div className="alert alert-info">{message}</div>
                    )}

                    {cart.length === 0 ? (
                        <div className="empty-cart">
                            <p>السلة فارغة</p>
                            <Link to="/products" className="btn btn-primary">
                                اروح للمتجر
                            </Link>
                        </div>
                    ) : (
                        <div className="cart-layout">
                            <div className="cart-items">
                                {cart.map((item) => (
                                    <div key={item.id} className="cart-item">
                                        <div className="item-image">
                                            {item.image_url}
                                        </div>
                                        <div className="item-details">
                                            <h3>{item.name}</h3>
                                            <p className="price">
                                                {item.price} دج
                                            </p>
                                        </div>
                                        <div className="item-quantity">
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.id,
                                                        item.quantity - 1
                                                    )
                                                }
                                            >
                                                −
                                            </button>
                                            <input
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    handleQuantityChange(
                                                        item.id,
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                            />
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.id,
                                                        item.quantity + 1
                                                    )
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="item-total">
                                            {item.price * item.quantity} دج
                                        </div>
                                        <button
                                            className="btn-remove"
                                            onClick={() =>
                                                handleRemoveFromCart(item.id)
                                            }
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="cart-summary">
                                <h2>ملخص الطلب</h2>
                                <div className="summary-item">
                                    <span>عدد المنتوجات:</span>
                                    <span>
                                        {cart.reduce(
                                            (sum, item) => sum + item.quantity,
                                            0
                                        )}
                                    </span>
                                </div>
                                <div className="summary-item total">
                                    <span>المجموع:</span>
                                    <span>{total} دج</span>
                                </div>
                                <button
                                    className="btn btn-primary btn-block"
                                    onClick={handleCheckout}
                                    disabled={loading}
                                >
                                    {loading
                                        ? "جاري المعالجة..."
                                        : "✅ تأكيد الطلب"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default CartPage;
