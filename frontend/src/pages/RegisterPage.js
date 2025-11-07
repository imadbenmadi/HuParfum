// Register Page Component

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./AuthPage.css";

function RegisterPage() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        if (password !== passwordConfirm) {
            setError("الكلمات السرية ما تتطابقش");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:5000/api/auth/register",
                {
                    name,
                    phone,
                    email,
                    password,
                    passwordConfirm,
                }
            );

            if (res.data.success) {
                setSuccess("تمّ التسجيل بنجاح! شوف بريدك باش تأكّد الحساب");
                setTimeout(() => {
                    navigate("/verify-email");
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || "خطأ في التسجيل");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <h1>🎁 HuParfum</h1>
                    <h2>اشتري حساب جديد</h2>

                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && (
                        <div className="alert alert-success">{success}</div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>الاسم</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="اسمك"
                            />
                        </div>

                        <div className="form-group">
                            <label>رقم الهاتف</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                placeholder="+213 XXX XXX XXX"
                            />
                        </div>

                        <div className="form-group">
                            <label>الإيميل</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="example@email.com"
                            />
                        </div>

                        <div className="form-group">
                            <label>الكلمة السرية</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="form-group">
                            <label>أكّد الكلمة السرية</label>
                            <input
                                type="password"
                                value={passwordConfirm}
                                onChange={(e) =>
                                    setPasswordConfirm(e.target.value)
                                }
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            disabled={loading}
                        >
                            {loading ? "جاري التسجيل..." : "اشتري حساب"}
                        </button>
                    </form>

                    <p className="auth-link">
                        عندك حساب بالفعل? <Link to="/login">دخول</Link>
                    </p>

                    <Link to="/" className="btn btn-secondary btn-block">
                        العودة للرئيسية
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
