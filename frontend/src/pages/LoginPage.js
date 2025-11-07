// Login Page Component

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./AuthPage.css";

function LoginPage({ setToken, setUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    email,
                    password,
                }
            );

            if (res.data.success) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                setToken(res.data.token);
                setUser(res.data.user);
                navigate("/my-orders");
            }
        } catch (err) {
            setError(err.response?.data?.message || "خطأ في الدخول");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <h1>🎁 HuParfum</h1>
                    <h2>دخول للحساب</h2>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit}>
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

                        <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            disabled={loading}
                        >
                            {loading ? "جاري الدخول..." : "دخول"}
                        </button>
                    </form>

                    <p className="auth-link">
                        ما عندك حساب? <Link to="/register">اشترِ الآن</Link>
                    </p>

                    <Link to="/" className="btn btn-secondary btn-block">
                        العودة للرئيسية
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
