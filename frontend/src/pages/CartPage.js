// Cart Page Component
// Shopping cart and checkout

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

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
                    "http://localhost:5001/api/orders/create",
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
        <div className="min-h-screen bg-dark-bg">
            <header className="sticky top-0 z-50 bg-dark-bg/98 backdrop-blur-md border-b-2 border-candle-yellow/20 shadow-lg">
                <div className="container">
                    <div className="flex justify-between items-center py-4">
                        <Link to="/" className="no-underline">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-candle-yellow to-bright-yellow bg-clip-text text-transparent">
                                🎁 HuParfum
                            </h1>
                        </Link>
                        <nav className="flex gap-8">
                            <Link
                                to="/"
                                className="text-candle-white hover:text-bright-yellow transition-colors"
                            >
                                الرئيسية
                            </Link>
                            <Link
                                to="/products"
                                className="text-candle-white hover:text-bright-yellow transition-colors"
                            >
                                المتجر
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            <section className="py-12 md:py-16">
                <div className="container">
                    <h1 className="text-4xl font-bold text-candle-white mb-8">
                        🛒 السلة ديالي
                    </h1>

                    {message && (
                        <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg text-blue-300">
                            {message}
                        </div>
                    )}

                    {cart.length === 0 ? (
                        <div className="text-center py-16 bg-card-bg border border-border-color rounded-xl">
                            <p className="text-xl text-text-muted mb-6">
                                السلة فارغة
                            </p>
                            <Link
                                to="/products"
                                className="btn-primary inline-block"
                            >
                                اروح للمتجر
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-4">
                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 p-4 bg-card-bg border border-border-color rounded-lg hover:shadow-lg transition-all"
                                    >
                                        <div className="text-4xl">
                                            {item.image_url}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-candle-white">
                                                {item.name}
                                            </h3>
                                            <p className="text-bright-yellow font-bold">
                                                {item.price} دج
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 bg-dark-bg rounded-lg p-1">
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.id,
                                                        item.quantity - 1
                                                    )
                                                }
                                                className="px-3 py-1 hover:bg-candle-yellow hover:text-darker-bg transition-colors rounded"
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
                                                className="w-16 text-center bg-dark-bg border border-border-color rounded px-2 py-1 text-candle-white"
                                            />
                                            <button
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        item.id,
                                                        item.quantity + 1
                                                    )
                                                }
                                                className="px-3 py-1 hover:bg-candle-yellow hover:text-darker-bg transition-colors rounded"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="text-right min-w-24">
                                            <p className="text-bright-yellow font-bold">
                                                {item.price * item.quantity} دج
                                            </p>
                                            <button
                                                className="text-accent-red hover:text-red-400 transition-colors mt-1"
                                                onClick={() =>
                                                    handleRemoveFromCart(
                                                        item.id
                                                    )
                                                }
                                            >
                                                ✕ حذف
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-card-bg border border-border-color rounded-xl p-6 h-fit sticky top-20">
                                <h2 className="text-2xl font-bold text-candle-white mb-6">
                                    ملخص الطلب
                                </h2>
                                <div className="space-y-4 mb-6 pb-6 border-b border-border-color">
                                    <div className="flex justify-between text-text-primary">
                                        <span>عدد المنتوجات:</span>
                                        <span className="font-semibold">
                                            {cart.reduce(
                                                (sum, item) =>
                                                    sum + item.quantity,
                                                0
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-bright-yellow text-lg font-bold">
                                        <span>المجموع:</span>
                                        <span>{total} دج</span>
                                    </div>
                                </div>
                                <button
                                    className="btn-primary w-full"
                                    onClick={handleCheckout}
                                    disabled={loading}
                                >
                                    {loading
                                        ? "جاري المعالجة..."
                                        : "تأكيد الطلب"}
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
