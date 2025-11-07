// Home Page Component
// Landing page with introduction and featured products

import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage() {
    return (
        <div className="home-page">
            {/* Header/Navigation */}
            <header className="header">
                <div className="container">
                    <div className="header-content">
                        <div className="logo">
                            <h1>🎁 HuParfum</h1>
                            <p>أطيب الريحات الجزائرية</p>
                        </div>
                        <nav className="nav">
                            <Link to="/">الرئيسية</Link>
                            <Link to="/products">المتجر</Link>
                            <Link to="/login">دخول</Link>
                            <Link to="/register">التسجيل</Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <h1>🌹 أطيب الريحات الفاخرة الجزائرية</h1>
                        <p>عطور أصلية 100% مع أجود المنتوجات من الجزائر</p>
                        <Link to="/products" className="btn btn-primary">
                            👉 ابدا الآن
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <h2>ليش نختارنا?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <span className="icon">✅</span>
                            <h3>منتوجات أصلية</h3>
                            <p>كل منتوج تمّ اختياره بعناية فائقة</p>
                        </div>
                        <div className="feature-card">
                            <span className="icon">🚚</span>
                            <h3>توصيل سريع</h3>
                            <p>نوصّلك الطلب في أسرع وقت</p>
                        </div>
                        <div className="feature-card">
                            <span className="icon">💬</span>
                            <h3>خدمة زبونة ممتازة</h3>
                            <p>فريق هدى ديالنا موجود ليك دايما</p>
                        </div>
                        <div className="feature-card">
                            <span className="icon">🔔</span>
                            <h3>تحديثات فورية</h3>
                            <p>اتسلّم الأخبار في التيليجرام</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="how-it-works">
                <div className="container">
                    <h2>كيفاش تشري معنا?</h2>
                    <div className="steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <h3>اختار المنتوج</h3>
                            <p>اختار من بين مختلف الريحات</p>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <h3>اضيفو للسلة</h3>
                            <p>زيد المنتوج وبدا الدفع</p>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <h3>تأكيد الطلب</h3>
                            <p>هدى تتكلم معك على التيليجرام</p>
                        </div>
                        <div className="step">
                            <div className="step-number">4</div>
                            <h3>الاستقبال</h3>
                            <p>اتسلّم الطلب في بيتك</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="container">
                    <h2>بغيت تشري حاجة الآن?</h2>
                    <p>انت في المكان الصحيح! تعال واختار أفضل الريحات ديالنا</p>
                    <Link to="/products" className="btn btn-primary btn-large">
                        🛍️ روح للمتجر
                    </Link>
                </div>
            </section>

            {/* Contact Section */}
            <section className="contact">
                <div className="container">
                    <h2>تواصل معنا</h2>
                    <div className="contact-info">
                        <div className="contact-item">
                            <span>📱 الهاتف:</span>
                            <p>+213 XXX XXX XXX</p>
                        </div>
                        <div className="contact-item">
                            <span>📧 الإيميل:</span>
                            <p>info@huparfum.com</p>
                        </div>
                        <div className="contact-item">
                            <span>💬 تيليجرام:</span>
                            <a
                                href="https://t.me/houda"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                @houda
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <p>&copy; 2024 HuParfum - كل الحقوق محفوظة</p>
                    <p>صُنعت بـ ❤️ من أجلك</p>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;
