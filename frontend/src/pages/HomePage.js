import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function HomePage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const res = await axios.get("http://localhost:5001/api/products");
            if (res.data.success) {
                setProducts(res.data.products.slice(0, 3));
            }
        } catch (err) {
            console.log("Error fetching products");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg text-text-primary">
            {/* Navigation Header */}
            <header className="sticky top-0 z-50 bg-dark-bg/98 backdrop-blur-md border-b-2 border-candle-yellow/20 shadow-lg">
                <div className="container">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex flex-col items-end">
                            <h2 className="text-2xl font-bold text-gradient">
                                HuParfum
                            </h2>
                            <span className="text-candle-yellow text-xs uppercase tracking-wider font-semibold">
                                عطور وشموع فاخرة جزائرية 🕯️✨
                            </span>
                        </div>
                        <nav className="flex gap-6 items-center">
                            <Link
                                to="/"
                                className="text-candle-white uppercase text-sm font-medium hover:text-candle-yellow transition-colors border-b-2 border-candle-yellow pb-1"
                            >
                                الرئيسية
                            </Link>
                            <Link
                                to="/products"
                                className="text-candle-white uppercase text-sm font-medium hover:text-candle-yellow transition-colors"
                            >
                                المتجر
                            </Link>
                            <Link
                                to="/login"
                                className="text-candle-white uppercase text-sm font-medium hover:text-candle-yellow transition-colors"
                            >
                                دخول
                            </Link>
                            <Link to="/register" className="btn-primary">
                                تسجيل
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-hero-gradient border-b border-candle-yellow/15">
                <div className="absolute inset-0 bg-radial-gradient opacity-30 pointer-events-none"></div>
                <div className="container relative z-10">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="mb-6 inline-block bg-gradient-to-r from-candle-yellow/25 to-candle-yellow/15 border border-candle-yellow/50 text-bright-yellow px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wider shadow-glow">
                            حصري وفاخر
                        </div>
                        <h1 className="text-5xl md:text-6xl mb-6 text-candle-white text-shadow">
                            أطيب الريحات والشموع الفاخرة الجزائرية
                        </h1>
                        <p className="text-lg text-candle-white mb-10 text-shadow-sm leading-relaxed">
                            اكتشف مجموعة عطورنا وشموعنا المختارة بعناية من أجود
                            الروائح الجزائرية الأصلية
                        </p>
                        <div className="flex gap-6 justify-center flex-wrap">
                            <Link to="/products" className="btn-primary">
                                استكشف المتجر
                            </Link>
                            <Link to="/register" className="btn-secondary">
                                انضم الآن
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            {/* Features Section */}
            <section className="py-20 bg-dark-bg/50 border-b border-border-color">
                <div className="container">
                    <h2 className="text-center text-4xl mb-16">ليش نختارنا؟</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: "✓",
                                title: "منتوجات أصلية",
                                desc: "كل منتوج تمّ اختياره بعناية فائقة",
                            },
                            {
                                icon: "🚚",
                                title: "توصيل سريع",
                                desc: "نوصّلك الطلب في أسرع وقت",
                            },
                            {
                                icon: "�",
                                title: "خدمة زبونة ممتازة",
                                desc: "فريق هدى ديالنا موجود ليك دايما",
                            },
                            {
                                icon: "🔔",
                                title: "تحديثات فورية",
                                desc: "اتسلّم الأخبار في التيليجرام",
                            },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="card border border-candle-yellow/20 hover:border-candle-yellow/50 hover:bg-candle-yellow/5 hover:-translate-y-2 bg-card-bg/80 p-6 text-center"
                            >
                                <div className="text-4xl mb-3">{item.icon}</div>
                                <h3 className="text-xl font-bold text-candle-white mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-text-secondary text-sm">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-20 bg-dark-bg">
                <div className="container">
                    <h2 className="text-center text-4xl mb-16">
                        كيفاش تشري معنا؟
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                num: "1",
                                title: "اختار المنتوج",
                                desc: "اختار من بين مختلف الريحات",
                            },
                            {
                                num: "2",
                                title: "اضيفو للسلة",
                                desc: "زيد المنتوج وبدا الدفع",
                            },
                            {
                                num: "3",
                                title: "تأكيد الطلب",
                                desc: "هدى تتكلم معك على التيليجرام",
                            },
                            {
                                num: "4",
                                title: "الاستقبال",
                                desc: "اتسلّم الطلب في بيتك",
                            },
                        ].map((step, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col items-center text-center"
                            >
                                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-candle-yellow to-bright-yellow flex items-center justify-center text-2xl font-bold text-darker-bg mb-4">
                                    {step.num}
                                </div>
                                <h3 className="text-lg font-bold text-candle-white mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-text-secondary">
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-r from-candle-yellow/10 to-bright-yellow/10 border-t border-b border-candle-yellow/20">
                <div className="container text-center">
                    <h2 className="text-4xl mb-4">بغيت تشري حاجة الآن؟</h2>
                    <p className="text-lg text-text-secondary mb-8">
                        انت في المكان الصحيح! تعال واختار أفضل الريحات ديالنا
                    </p>
                    <Link to="/products" className="btn-primary inline-block">
                        🛍️ روح للمتجر
                    </Link>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 bg-dark-bg/50">
                <div className="container">
                    <h2 className="text-center text-4xl mb-12">تواصل معنا</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="card bg-card-bg/80 border border-border-color p-6 text-center">
                            <div className="text-3xl mb-3">📱</div>
                            <h3 className="text-lg font-bold text-candle-white mb-2">
                                الهاتف
                            </h3>
                            <p className="text-text-secondary">
                                +213 XXX XXX XXX
                            </p>
                        </div>
                        <div className="card bg-card-bg/80 border border-border-color p-6 text-center">
                            <div className="text-3xl mb-3">📧</div>
                            <h3 className="text-lg font-bold text-candle-white mb-2">
                                الإيميل
                            </h3>
                            <p className="text-text-secondary">
                                info@huparfum.com
                            </p>
                        </div>
                        <div className="card bg-card-bg/80 border border-border-color p-6 text-center">
                            <div className="text-3xl mb-3">💬</div>
                            <h3 className="text-lg font-bold text-candle-white mb-2">
                                تيليجرام
                            </h3>
                            <a
                                href="https://t.me/houda"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-candle-yellow hover:text-bright-yellow font-semibold"
                            >
                                @houda
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-darker-bg border-t border-border-color py-10">
                <div className="container text-center">
                    <p className="text-text-secondary mb-2">
                        &copy; 2024 HuParfum - كل الحقوق محفوظة
                    </p>
                    <p className="text-text-muted">صُنعت بـ ❤️ من أجلك</p>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;
