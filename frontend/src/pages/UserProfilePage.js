import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../components/Toast";

function UserProfilePage({ token, user, onLogout }) {
    const toast = useToast();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(user || {});
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        telegram_username: user?.telegram_username || "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.put(
                "http://localhost:5001/api/auth/profile",
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                toast.addToast("تم تحديث الملف الشخصي بنجاح", "success");
                setProfile(res.data.user);
                setIsEditing(false);
            }
        } catch (err) {
            toast.addToast(
                err.response?.data?.message || "خطأ في التحديث",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        onLogout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-dark-bg">
            <header className="sticky top-0 z-50 bg-dark-bg/98 backdrop-blur-md border-b-2 border-candle-yellow/20 shadow-lg">
                <div className="container">
                    <div className="flex justify-between items-center py-4">
                        <h1 className="text-3xl font-bold text-candle-white">
                            الملف الشخصي 👤
                        </h1>
                        <button
                            onClick={handleLogout}
                            className="btn-secondary"
                        >
                            تسجيل الخروج
                        </button>
                    </div>
                </div>
            </header>

            <section className="py-12 md:py-16">
                <div className="container max-w-2xl">
                    <div className="bg-card-bg border border-border-color rounded-xl overflow-hidden shadow-xl">
                        {/* Profile Header */}
                        <div className="bg-gradient-to-r from-candle-yellow/20 to-bright-yellow/20 p-8 border-b border-border-color">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-candle-yellow to-bright-yellow flex items-center justify-center text-3xl font-bold text-darker-bg">
                                    {profile.name
                                        ? profile.name.charAt(0).toUpperCase()
                                        : "U"}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-candle-white">
                                        {profile.name}
                                    </h2>
                                    <p className="text-text-muted">
                                        {profile.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Profile Content */}
                        <div className="p-8">
                            {!isEditing ? (
                                <div className="space-y-6">
                                    <div className="pb-6 border-b border-border-color">
                                        <label className="text-text-muted text-sm font-semibold uppercase mb-2 block">
                                            الاسم
                                        </label>
                                        <p className="text-2xl font-semibold text-candle-white">
                                            {profile.name}
                                        </p>
                                    </div>
                                    <div className="pb-6 border-b border-border-color">
                                        <label className="text-text-muted text-sm font-semibold uppercase mb-2 block">
                                            البريد الإلكتروني
                                        </label>
                                        <p className="text-lg text-candle-white">
                                            {profile.email}
                                        </p>
                                    </div>
                                    <div className="pb-6 border-b border-border-color">
                                        <label className="text-text-muted text-sm font-semibold uppercase mb-2 block">
                                            الهاتف
                                        </label>
                                        <p className="text-lg text-candle-white">
                                            {profile.phone || "لم يتم إدخاله"}
                                        </p>
                                    </div>
                                    <div className="pb-6">
                                        <label className="text-text-muted text-sm font-semibold uppercase mb-2 block">
                                            اسم Telegram
                                        </label>
                                        <p className="text-lg text-candle-white">
                                            {profile.telegram_username ||
                                                "لم يتم الربط"}
                                        </p>
                                    </div>
                                    <button
                                        className="btn-primary w-full"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        تعديل الملف الشخصي
                                    </button>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleUpdateProfile}
                                    className="space-y-6"
                                >
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-text-primary font-medium mb-2"
                                        >
                                            الاسم
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
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
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            disabled
                                            title="لا يمكن تغيير البريد الإلكتروني"
                                            className="opacity-60 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="phone"
                                            className="block text-text-primary font-medium mb-2"
                                        >
                                            الهاتف
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="أدخل رقم الهاتف"
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="telegram_username"
                                            className="block text-text-primary font-medium mb-2"
                                        >
                                            اسم Telegram
                                        </label>
                                        <input
                                            type="text"
                                            id="telegram_username"
                                            name="telegram_username"
                                            value={formData.telegram_username}
                                            onChange={handleInputChange}
                                            placeholder="أدخل اسم Telegram (بدون @)"
                                        />
                                    </div>
                                    <div className="flex gap-4 pt-6">
                                        <button
                                            type="submit"
                                            className="btn-primary flex-1"
                                            disabled={loading}
                                        >
                                            {loading
                                                ? "جاري الحفظ..."
                                                : "حفظ التغييرات"}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn-secondary flex-1"
                                            onClick={() => setIsEditing(false)}
                                        >
                                            إلغاء
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default UserProfilePage;
