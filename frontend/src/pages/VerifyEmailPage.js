// Verify Email Page Component

import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get("token");

            if (!token) {
                setError("التوكن مالقاعش");
                setLoading(false);
                return;
            }

            try {
                const res = await axios.post(
                    "http://localhost:5000/api/auth/verify-email",
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
            } finally {
                setLoading(false);
            }
        };

        verifyEmail();
    }, [searchParams, navigate]);

    return (
        <div style={{ textAlign: "center", padding: "2rem" }}>
            <h1>🎁 HuParfum</h1>
            {loading && <p>جاري التحقق من البريد...</p>}
            {message && <div style={{ color: "green" }}>{message}</div>}
            {error && <div style={{ color: "red" }}>{error}</div>}
            <Link to="/" style={{ marginTop: "2rem", display: "block" }}>
                العودة للرئيسية
            </Link>
        </div>
    );
}

export default VerifyEmailPage;
