// Register Page Component

import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { MdOutlineFlag } from "react-icons/md";
import {
    validateRegisterForm,
    formatAlgerianPhone,
    detectTextDirection,
} from "../utils/validation";

function RegisterPage() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [textDirections, setTextDirections] = useState({
        name: "ltr",
        email: "ltr",
    });
    const nameInputRef = useRef(null);
    const navigate = useNavigate();

    // Auto-focus on first input when page loads
    useEffect(() => {
        nameInputRef.current?.focus();
    }, []);

    // Handle text direction for name input
    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        setTextDirections((prev) => ({
            ...prev,
            name: detectTextDirection(value),
        }));
    };

    // Handle text direction for email input
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setTextDirections((prev) => ({
            ...prev,
            email: detectTextDirection(value),
        }));
    };

    // Handle phone input with only numbers
    const handlePhoneChange = (e) => {
        const value = e.target.value;
        // Only allow numbers and +
        const cleaned = value.replace(/[^\d+]/g, "");
        setPhone(cleaned);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        setFieldErrors({});

        // Frontend validation
        const validation = validateRegisterForm({
            name,
            phone,
            email,
            password,
            passwordConfirm,
        });

        if (!validation.valid) {
            setFieldErrors(validation.errors);
            setError("تحقق من الحقول أعلاه");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post(
                "http://localhost:5001/api/auth/register",
                {
                    name: name.trim(),
                    phone: formatAlgerianPhone(phone),
                    email: email.toLowerCase().trim(),
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
        <div className="min-h-screen bg-dark-bg flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md">
                <div className="bg-card-bg border border-border-color rounded-xl p-8 shadow-xl">
                    <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-candle-yellow to-bright-yellow bg-clip-text text-transparent mb-2">
                        HuParfum
                    </h1>
                    <h2 className="text-2xl font-semibold text-candle-white text-center mb-8">
                        إنشاء حساب جديد
                    </h2>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-text-primary font-medium mb-2">
                                الاسم
                            </label>
                            <input
                                ref={nameInputRef}
                                type="text"
                                value={name}
                                onChange={handleNameChange}
                                required
                                placeholder="اسمك"
                                dir={textDirections.name}
                                className={`${
                                    fieldErrors.name
                                        ? "border-red-500 bg-red-500/10"
                                        : ""
                                }`}
                            />
                            {fieldErrors.name && (
                                <p className="text-red-400 text-sm mt-1">
                                    {fieldErrors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-text-primary font-medium mb-2">
                                رقم الهاتف (الجزائر فقط)
                            </label>
                            <div className="flex items-center bg-input-bg border border-border-color rounded-lg overflow-hidden">
                                <span className="px-3 py-2 text-xl flex-shrink-0 flex items-center gap-2 text-candle-yellow">
                                    <MdOutlineFlag size={20} />
                                    +213
                                </span>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    required
                                    placeholder="XXX XXX XXX"
                                    maxLength="9"
                                    className={`flex-1 bg-transparent border-none outline-none text-text-primary placeholder-text-muted px-2 ${
                                        fieldErrors.phone ? "bg-red-500/10" : ""
                                    }`}
                                />
                            </div>
                            {fieldErrors.phone && (
                                <p className="text-red-400 text-sm mt-1">
                                    {fieldErrors.phone}
                                </p>
                            )}
                            <p className="text-text-muted text-xs mt-2">
                                أدخل 9 أرقام فقط (بدون +213 أو 0)
                            </p>
                        </div>

                        <div>
                            <label className="block text-text-primary font-medium mb-2">
                                الإيميل
                            </label>
                            <input
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

                        <div>
                            <label className="block text-text-primary font-medium mb-2">
                                أكّد الكلمة السرية
                            </label>
                            <input
                                type="password"
                                value={passwordConfirm}
                                onChange={(e) =>
                                    setPasswordConfirm(e.target.value)
                                }
                                required
                                placeholder="••••••••"
                                className={
                                    fieldErrors.passwordConfirm
                                        ? "border-red-500 bg-red-500/10"
                                        : ""
                                }
                            />
                            {fieldErrors.passwordConfirm && (
                                <p className="text-red-400 text-sm mt-1">
                                    {fieldErrors.passwordConfirm}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full"
                            disabled={loading}
                        >
                            {loading ? "جاري التسجيل..." : "إنشاء حساب"}
                        </button>
                    </form>

                    <p className="text-center text-text-muted mt-6">
                        عندك حساب بالفعل?{" "}
                        <Link
                            to="/login"
                            className="text-candle-yellow hover:text-bright-yellow font-semibold transition-colors"
                        >
                            دخول
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

export default RegisterPage;
