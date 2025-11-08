import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminLoginPage({ setAdminToken, onLoginSuccess }) {
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
                "http://localhost:5001/api/admin/login",
                {
                    email,
                    password,
                }
            );

            if (res.data.success) {
                localStorage.setItem("adminToken", res.data.token);
                localStorage.setItem(
                    "adminData",
                    JSON.stringify(res.data.admin)
                );
                setAdminToken(res.data.token);
                onLoginSuccess(res.data.admin);
                navigate("/admin/dashboard");
            }
        } catch (err) {
            setError(
                err.response?.data?.message || "خطأ في الدخول. تحقق من البيانات"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                <div className="bg-card-bg border border-border-color rounded-xl p-8 shadow-xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-candle-yellow to-bright-yellow bg-clip-text text-transparent mb-2">
                            🎁 HuParfum
                        </h1>
                        <p className="text-text-muted text-lg">
                            لوحة تحكم الإدارة 🔐
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-text-primary font-medium mb-2"
                            >
                                البريد الإلكتروني
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="أدخل بريدك الإلكتروني"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-text-primary font-medium mb-2"
                            >
                                كلمة المرور
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="أدخل كلمة المرور"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? "جاري الدخول..." : "دخول"}
                        </button>
                    </form>

                    <div className="text-center mt-8 pt-6 border-t border-border-color">
                        <p className="text-text-muted text-sm">
                            ⚠️ للمسؤولين فقط
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminLoginPage;
