// Products Page Component
// Display all available perfumes

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState(
        JSON.parse(localStorage.getItem("cart") || "[]")
    );

    useEffect(() => {
        // Fetch products from backend (mock data for now)
        const mockProducts = [
            {
                id: 1,
                name: "عطر الورد البلدي",
                description:
                    "عطر فاخر مع رائحة الورد الجزائري الأصلي. رائحة دافئة وثابتة تدوم طول اليوم.",
                price: 2500,
                image_url: "🌹",
            },
            {
                id: 2,
                name: "عطر العود الجزائري",
                description:
                    "عطر قديم الطريقة مع العود الثقيل والدافئ. مناسب للعيد والمناسبات.",
                price: 3500,
                image_url: "✨",
            },
            {
                id: 3,
                name: "عطر البرتقال والليمون",
                description:
                    "عطر منعش فاخر بنكهة الحمضيات. خفيف وعطري مناسب للصيف.",
                price: 1800,
                image_url: "🍊",
            },
            {
                id: 4,
                name: "عطر الفانيليا والعسل",
                description:
                    "عطر حلو وناعم مع رائحة الفانيليا والعسل الطبيعي. مثالي للنساء.",
                price: 2200,
                image_url: "🍯",
            },
            {
                id: 5,
                name: "عطر الزعفران الملكي",
                description:
                    "عطر أنيق مع رائحة الزعفران والمسك. حصري وفاخر جداً.",
                price: 4000,
                image_url: "👑",
            },
        ];

        setProducts(mockProducts);
        setLoading(false);
    }, []);

    const handleAddToCart = (product) => {
        const existingItem = cart.find((item) => item.id === product.id);

        if (existingItem) {
            const updatedCart = cart.map((item) =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
            setCart(updatedCart);
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }

        localStorage.setItem(
            "cart",
            JSON.stringify([...cart, { ...product, quantity: 1 }])
        );
        alert("تمّ الزيادة للسلة! 🛒");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen text-xl font-semibold text-candle-yellow">
                جاري تحميل المتجر...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg">
            {/* Header */}
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
                                className="text-bright-yellow font-semibold"
                            >
                                المتجر
                            </Link>
                            <Link
                                to="/cart"
                                className="text-candle-white hover:text-bright-yellow transition-colors"
                            >
                                السلة ({cart.length})
                            </Link>
                            <Link
                                to="/login"
                                className="text-candle-white hover:text-bright-yellow transition-colors"
                            >
                                دخول
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Products Section */}
            <section className="py-12 md:py-16">
                <div className="container">
                    <h1 className="text-5xl font-bold text-candle-white mb-4">
                        🌹 متجرنا
                    </h1>
                    <p className="text-xl text-text-muted mb-12">
                        اختار من بين أجود الريحات الفاخرة والشموع العطرية
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="card group">
                                <div className="text-6xl text-center py-8 bg-gradient-to-br from-candle-yellow/20 to-bright-yellow/20">
                                    {product.image_url}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-candle-white mb-2">
                                        {product.name}
                                    </h3>
                                    <p className="text-text-muted text-sm mb-4 line-clamp-2">
                                        {product.description}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-bright-yellow font-bold text-lg">
                                            {product.price} دج
                                        </span>
                                        <button
                                            className="btn-primary py-2 px-4"
                                            onClick={() =>
                                                handleAddToCart(product)
                                            }
                                        >
                                            زيد للسلة
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ProductsPage;
