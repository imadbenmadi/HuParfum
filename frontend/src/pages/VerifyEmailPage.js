// Verify Email Page Component

import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [resending, setResending] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [showResend, setShowResend] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get("token");

            if (!token) {
                setError("التوكن مالقاعش");
                setShowResend(true);
                setLoading(false);
                return;
            }

            try {
                const res = await axios.post(
                    "http://localhost:5001/api/auth/verify-email",
                    {
                        token,
                    }
                );

                if (res.data.success) {
                    setMessage("تمّ التأكيد بنجاح! دخول للحساب ديالك الآن");
                    setTimeout(() => {
                        navigate("/login");
                    }, 2000);
                }
            } catch (err) {
                setError(err.response?.data?.message || "خطأ في التأكيد");
                setShowResend(true);
            } finally {
                setLoading(false);
            }
        };

        verifyEmail();
    }, [searchParams, navigate]);

    const handleResendEmail = async () => {
        if (!userEmail) {
            setError("الرجاء إدخال بريدك الإلكتروني");
            return;
        }

        setResending(true);
        setError("");

        try {
            const res = await axios.post(
                "http://localhost:5001/api/auth/resend-verification-email",
                { email: userEmail }
            );

            if (res.data.success) {
                setMessage(
                    "تمّ إرسال رسالة التأكيد مرة أخرى. شوف بريدك الإلكتروني"
                );
                setShowResend(false);
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
            <div className="w-full max-w-md text-center">
                <div className="bg-card-bg border border-border-color rounded-xl p-8 shadow-xl">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-candle-yellow to-bright-yellow bg-clip-text text-transparent mb-8">
                        HuParfum
                    </h1>

                    {loading && !showResend && (
                        <p className="text-lg text-candle-yellow font-semibold">
                            جاري التحقق من البريد...
                        </p>
                    )}

                    {message && (
                        <div className="text-green-300 bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="text-red-300 bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
                            {error}
                        </div>
                    )}

                    {showResend && (
                        <div className="space-y-4 mb-6">
                            <p className="text-text-muted mb-4">
                                لم تستقبل البريد الإلكتروني؟
                            </p>
                            <input
                                type="email"
                                placeholder="أدخل بريدك الإلكتروني"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-dark-bg border border-border-color rounded-lg text-candle-white focus:outline-none focus:border-candle-yellow"
                            />
                            <button
                                onClick={handleResendEmail}
                                disabled={resending}
                                className="w-full btn-primary"
                            >
                                {resending
                                    ? "جاري الإرسال..."
                                    : "إرسال البريد مرة أخرى"}
                            </button>
                        </div>
                    )}

                    <Link
                        to="/"
                        className="inline-block mt-6 text-candle-yellow hover:text-bright-yellow transition-colors font-semibold"
                    >
                        العودة للرئيسية →
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default VerifyEmailPage;
