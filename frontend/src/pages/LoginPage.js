// Login Page Component

import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { validateLoginForm, detectTextDirection } from "../utils/validation";

function LoginPage({ setToken, setUser }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [resending, setResending] = useState(false);
    const [showResendOption, setShowResendOption] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [textDirections, setTextDirections] = useState({
        email: "ltr",
    });
    const emailInputRef = useRef(null);
    const navigate = useNavigate();

    // Auto-focus on first input when page loads
    useEffect(() => {
        emailInputRef.current?.focus();
    }, []);

    // Handle text direction for email input
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setTextDirections((prev) => ({
            ...prev,
            email: detectTextDirection(value),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setShowResendOption(false);
        setFieldErrors({});

        // Frontend validation
        const validation = validateLoginForm({ email, password });

        if (!validation.valid) {
            setFieldErrors(validation.errors);
            setError("تحقق من الحقول أعلاه");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:5001/api/auth/login",
                {
                    email: email.toLowerCase().trim(),
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
            const errorMsg = err.response?.data?.message || "خطأ في الدخول";
            setError(errorMsg);

            // Check if error is email not verified
            if (
                errorMsg.includes("تأكيد") ||
                errorMsg.includes("verified") ||
                errorMsg.includes("verify")
            ) {
                setShowResendOption(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendEmail = async () => {
        if (!email) {
            setError("الرجاء إدخال بريدك الإلكتروني");
            return;
        }

        setResending(true);
        setError("");

        try {
            const res = await axios.post(
                "http://localhost:5001/api/auth/resend-verification-email",
                { email: email.toLowerCase() }
            );

            if (res.data.success) {
                setError("تمّ إرسال رسالة التأكيد. شوف بريدك الإلكتروني");
                setShowResendOption(false);
                setPassword("");
            }
        } catch (err) {
            setError(
                err.response?.data?.message || "خطأ في إرسال البريد الإلكتروني"
            );
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                <div className="bg-card-bg border border-border-color rounded-xl p-8 shadow-xl">
                    <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-candle-yellow to-bright-yellow bg-clip-text text-transparent mb-2">
                        HuParfum
                    </h1>
                    <h2 className="text-2xl font-semibold text-candle-white text-center mb-8">
                        دخول للحساب
                    </h2>

                    {error && (
                        <div
                            className={`mb-6 p-4 rounded-lg border ${
                                showResendOption
                                    ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-300"
                                    : "bg-red-500/20 border-red-500/50 text-red-300"
                            }`}
                        >
                            {error}
                        </div>
                    )}

                    {showResendOption && (
                        <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
                            <p className="text-blue-300 text-sm mb-3">
                                هل تريد إعادة إرسال رسالة التأكيد؟
                            </p>
                            <button
                                onClick={handleResendEmail}
                                disabled={resending}
                                className="w-full px-4 py-2 bg-candle-yellow text-darker-bg rounded-lg font-semibold hover:shadow-yellow-md transition-all disabled:opacity-50"
                            >
                                {resending
                                    ? "جاري الإرسال..."
                                    : "إرسال رسالة التأكيد"}
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-text-primary font-medium mb-2">
                                الإيميل
                            </label>
                            <input
                                ref={emailInputRef}
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                required
                                placeholder="example@email.com"
                                dir={textDirections.email}
                                className={`${
                                    fieldErrors.email
                                        ? "border-red-500 bg-red-500/10"
                                        : ""
                                }`}
                            />
                            {fieldErrors.email && (
                                <p className="text-red-400 text-sm mt-1">
                                    {fieldErrors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-text-primary font-medium mb-2">
                                الكلمة السرية
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className={
                                    fieldErrors.password
                                        ? "border-red-500 bg-red-500/10"
                                        : ""
                                }
                            />
                            {fieldErrors.password && (
                                <p className="text-red-400 text-sm mt-1">
                                    {fieldErrors.password}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? "جاري الدخول..." : "دخول"}
                        </button>
                    </form>

                    <p className="text-center text-text-muted mt-6">
                        ما عندك حساب?{" "}
                        <Link
                            to="/register"
                            className="text-candle-yellow hover:text-bright-yellow font-semibold transition-colors"
                        >
                            اشترِ الآن
                        </Link>
                    </p>

                    <Link
                        to="/"
                        className="btn-secondary w-full inline-block text-center mt-4"
                    >
                        العودة للرئيسية
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
