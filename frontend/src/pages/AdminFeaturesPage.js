// Admin Features Page - Manage Feature Toggles
// Control feature flags for email verification, email service provider, and future features

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    getAllFeatures,
    updateFeatureStatus,
    updateFeatureConfig,
} from "../utils/featureFlags";
import { FiToggle2, FiSettings, FiRefreshCw } from "react-icons/fi";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function AdminFeaturesPage({ adminToken }) {
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [editingConfig, setEditingConfig] = useState(null);
    const [configValues, setConfigValues] = useState({});
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchFeatures();
    }, [adminToken]);

    const fetchFeatures = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE}/admin/features`, {
                headers: { Authorization: `Bearer ${adminToken}` },
            });

            if (response.data.success) {
                setFeatures(response.data.features);
            }
        } catch (err) {
            console.error("Failed to fetch features:", err);
            showMessage("خطأ في تحميل الميزات", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (featureName, newStatus) => {
        try {
            setUpdating(featureName);
            const result = await updateFeatureStatus(
                featureName,
                newStatus,
                adminToken
            );

            if (result.success) {
                showMessage(`تم تحديث "${featureName}" بنجاح`, "success");
                // Update local state
                setFeatures(
                    features.map((f) =>
                        f.feature_name === featureName
                            ? { ...f, status: newStatus }
                            : f
                    )
                );
            } else {
                showMessage(result.error || "خطأ في التحديث", "error");
            }
        } catch (err) {
            console.error("Failed to update feature:", err);
            showMessage("خطأ في تحديث الميزة", "error");
        } finally {
            setUpdating(null);
        }
    };

    const handleConfigEdit = (feature) => {
        setEditingConfig(feature.feature_name);
        setConfigValues(feature.config || {});
    };

    const handleConfigSave = async (featureName) => {
        try {
            setUpdating(featureName);
            const result = await updateFeatureConfig(
                featureName,
                configValues,
                adminToken
            );

            if (result.success) {
                showMessage(`تم تحديث إعدادات "${featureName}"`, "success");
                setFeatures(
                    features.map((f) =>
                        f.feature_name === featureName
                            ? { ...f, config: configValues }
                            : f
                    )
                );
                setEditingConfig(null);
            } else {
                showMessage(result.error || "خطأ في التحديث", "error");
            }
        } catch (err) {
            console.error("Failed to save config:", err);
            showMessage("خطأ في حفظ الإعدادات", "error");
        } finally {
            setUpdating(null);
        }
    };

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "required":
                return "bg-red-500/20 border-red-500/50 text-red-300";
            case "optional":
                return "bg-yellow-500/20 border-yellow-500/50 text-yellow-300";
            case "disabled":
                return "bg-gray-500/20 border-gray-500/50 text-gray-300";
            default:
                return "bg-gray-500/20 border-gray-500/50 text-gray-300";
        }
    };

    const getStatusDescription = (status) => {
        switch (status) {
            case "required":
                return "مفروض - يجب على المستخدم إكماله";
            case "optional":
                return "اختياري - عرض نافذة منبثقة فقط";
            case "disabled":
                return "معطل - تخطي هذه الميزة";
            default:
                return "";
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-candle-white mb-2">
                        إدارة الميزات
                    </h2>
                    <p className="text-candle-gray text-sm">
                        تحكم في تفعيل وتعطيل الميزات المختلفة للتطبيق
                    </p>
                </div>
                <button
                    onClick={fetchFeatures}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-candle-yellow/20 border border-candle-yellow/50 text-candle-yellow rounded-lg hover:bg-candle-yellow/30 transition disabled:opacity-50"
                >
                    <FiRefreshCw size={16} />
                    تحديث
                </button>
            </div>

            {/* Message */}
            {message && (
                <div
                    className={`p-4 rounded-lg border ${
                        message.type === "success"
                            ? "bg-green-500/10 border-green-500/50 text-green-300"
                            : "bg-red-500/10 border-red-500/50 text-red-300"
                    }`}
                >
                    {message.text}
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="text-center py-12">
                    <p className="text-candle-yellow text-lg">
                        جاري التحميل...
                    </p>
                </div>
            ) : features.length === 0 ? (
                <div className="text-center py-12 bg-dark-navy/30 rounded-lg border border-candle-gray/20">
                    <p className="text-candle-gray">لا توجد ميزات متاحة</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {/* Email Verification Feature */}
                    {features.map((feature) => (
                        <div
                            key={feature.feature_name}
                            className="bg-dark-navy/30 border border-candle-gray/20 rounded-lg p-6 space-y-4"
                        >
                            {/* Feature Header */}
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-candle-white capitalize">
                                        {feature.feature_name.replace(
                                            /_/g,
                                            " "
                                        )}
                                    </h3>
                                    <p className="text-candle-gray text-sm mt-1">
                                        {feature.description}
                                    </p>
                                </div>
                                <div
                                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                        feature.status
                                    )}`}
                                >
                                    {feature.status}
                                </div>
                            </div>

                            {/* Status Description */}
                            <p className="text-candle-gray text-sm">
                                {getStatusDescription(feature.status)}
                            </p>

                            {/* Status Controls */}
                            <div className="flex gap-3 flex-wrap">
                                {["required", "optional", "disabled"].map(
                                    (status) => (
                                        <button
                                            key={status}
                                            onClick={() =>
                                                handleStatusChange(
                                                    feature.feature_name,
                                                    status
                                                )
                                            }
                                            disabled={
                                                updating ===
                                                feature.feature_name
                                            }
                                            className={`px-4 py-2 rounded-lg border transition font-semibold capitalize ${
                                                feature.status === status
                                                    ? `bg-candle-yellow/30 border-candle-yellow text-candle-yellow`
                                                    : `bg-dark-navy/50 border-candle-gray/30 text-candle-gray hover:border-candle-yellow/50`
                                            } ${
                                                updating ===
                                                feature.feature_name
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                            }`}
                                        >
                                            <FiToggle2
                                                className="inline mr-2"
                                                size={16}
                                            />
                                            {status}
                                        </button>
                                    )
                                )}
                            </div>

                            {/* Configuration Section */}
                            <div className="bg-dark-navy/50 rounded-lg p-4 space-y-3">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-candle-white font-semibold flex items-center gap-2">
                                        <FiSettings size={16} />
                                        الإعدادات
                                    </h4>
                                    {editingConfig !== feature.feature_name && (
                                        <button
                                            onClick={() =>
                                                handleConfigEdit(feature)
                                            }
                                            className="text-xs px-2 py-1 bg-candle-yellow/20 text-candle-yellow rounded hover:bg-candle-yellow/30"
                                        >
                                            تعديل
                                        </button>
                                    )}
                                </div>

                                {/* Config Display/Edit */}
                                {editingConfig === feature.feature_name ? (
                                    <div className="space-y-2">
                                        {Object.entries(configValues).map(
                                            ([key, value]) => (
                                                <div
                                                    key={key}
                                                    className="space-y-1"
                                                >
                                                    <label className="block text-xs text-candle-gray capitalize">
                                                        {key}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={value}
                                                        onChange={(e) =>
                                                            setConfigValues({
                                                                ...configValues,
                                                                [key]: e.target
                                                                    .value,
                                                            })
                                                        }
                                                        className="w-full bg-dark-navy border border-candle-gray/30 rounded px-3 py-2 text-candle-white text-sm"
                                                    />
                                                </div>
                                            )
                                        )}
                                        <div className="flex gap-2 pt-2">
                                            <button
                                                onClick={() =>
                                                    handleConfigSave(
                                                        feature.feature_name
                                                    )
                                                }
                                                disabled={
                                                    updating ===
                                                    feature.feature_name
                                                }
                                                className="flex-1 px-3 py-2 bg-green-500/20 border border-green-500/50 text-green-300 rounded hover:bg-green-500/30 transition disabled:opacity-50"
                                            >
                                                حفظ
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setEditingConfig(null)
                                                }
                                                disabled={
                                                    updating ===
                                                    feature.feature_name
                                                }
                                                className="flex-1 px-3 py-2 bg-red-500/20 border border-red-500/50 text-red-300 rounded hover:bg-red-500/30 transition disabled:opacity-50"
                                            >
                                                إلغاء
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-sm text-candle-gray">
                                        {Object.entries(feature.config || {})
                                            .length > 0 ? (
                                            <div className="space-y-1">
                                                {Object.entries(
                                                    feature.config
                                                ).map(([key, value]) => (
                                                    <div
                                                        key={key}
                                                        className="flex justify-between"
                                                    >
                                                        <span className="font-semibold capitalize">
                                                            {key}:
                                                        </span>
                                                        <span className="text-candle-yellow">
                                                            {String(value)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-candle-gray/60">
                                                لا توجد إعدادات
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Last Updated */}
                            <div className="text-xs text-candle-gray/60 flex justify-between">
                                <span>
                                    آخر تحديث:{" "}
                                    {new Date(
                                        feature.updatedAt
                                    ).toLocaleDateString("ar-DZ", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                                <span>
                                    تم الإنشاء:{" "}
                                    {new Date(
                                        feature.createdAt
                                    ).toLocaleDateString("ar-DZ", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Information Box */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h4 className="text-candle-white font-semibold mb-2">
                    شرح الحالات:
                </h4>
                <ul className="text-sm text-candle-gray space-y-1">
                    <li>
                        <span className="text-red-300">مفروض (Required):</span>{" "}
                        المستخدم ملزم بإكمال هذه الميزة قبل الاستمرار
                    </li>
                    <li>
                        <span className="text-yellow-300">
                            اختياري (Optional):
                        </span>{" "}
                        عرض نافذة منبثقة للمستخدم لكن يمكنه الاستمرار بدونها
                    </li>
                    <li>
                        <span className="text-gray-300">معطل (Disabled):</span>{" "}
                        تخطي هذه الميزة تماماً ولا تظهر للمستخدم
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default AdminFeaturesPage;
