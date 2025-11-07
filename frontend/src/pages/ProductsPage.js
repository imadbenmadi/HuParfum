// Products Page Component
// Display all available perfumes

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./ProductsPage.css";

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
        return <div className="loading">جاري تحميل المتجر...</div>;
    }

    return (
        <div className="products-page">
            {/* Header */}
            <header className="header">
                <div className="container">
                    <div className="header-content">
                        <Link to="/" className="logo">
                            <h1>🎁 HuParfum</h1>
                        </Link>
                        <nav className="nav">
                            <Link to="/">الرئيسية</Link>
                            <Link to="/products">المتجر</Link>
                            <Link to="/cart">السلة ({cart.length})</Link>
                            <Link to="/login">دخول</Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Products Section */}
            <section className="products-section">
                <div className="container">
                    <h1>🌹 متجرنا</h1>
                    <p className="subtitle">
                        اختار من بين أجود الريحات الفاخرة
                    </p>

                    <div className="products-grid">
                        {products.map((product) => (
                            <div key={product.id} className="product-card">
                                <div className="product-image">
                                    {product.image_url}
                                </div>
                                <h3>{product.name}</h3>
                                <p className="description">
                                    {product.description}
                                </p>
                                <div className="product-footer">
                                    <span className="price">
                                        {product.price} دج
                                    </span>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        زيد للسلة
                                    </button>
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
