// Admin Settings Page
// Manage website configuration dynamically

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    FiEdit2,
    FiSave,
    FiX,
    FiRefreshCw,
    FiCheck,
    FiAlertCircle,
} from "react-icons/fi";
import {
    getAllSettings,
    updateSetting,
    resetSetting,
} from "../utils/settingsManager";

const AdminSettingsPage = ({ adminToken }) => {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingKey, setEditingKey] = useState(null);
    const [editValues, setEditValues] = useState({});
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const data = await getAllSettings(adminToken, true);
            setSettings(data);
        } catch (error) {
            showMessage("Failed to fetch settings", "error");
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (msg, type = "success") => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => setMessage(""), 3000);
    };

    const handleEdit = (setting) => {
        setEditingKey(setting.key);
        setEditValues(JSON.parse(JSON.stringify(setting.value)));
    };

    const handleCancel = () => {
        setEditingKey(null);
        setEditValues({});
    };

    const handleInputChange = (field, value) => {
        setEditValues({
            ...editValues,
            [field]: value,
        });
    };

    const handleNestedChange = (parent, field, value) => {
        setEditValues({
            ...editValues,
            [parent]: {
                ...editValues[parent],
                [field]: value,
            },
        });
    };

    const handleSave = async (key) => {
        try {
            const result = await updateSetting(key, editValues, adminToken);
            if (result.success) {
                showMessage("Setting updated successfully", "success");
                setSettings(
                    settings.map((s) =>
                        s.key === key ? { ...s, value: editValues } : s
                    )
                );
                setEditingKey(null);
            } else {
                showMessage(result.message, "error");
            }
        } catch (error) {
            showMessage("Error saving setting", "error");
        }
    };

    const handleReset = async (key) => {
        if (
            window.confirm(
                `Are you sure you want to reset "${key}" to defaults?`
            )
        ) {
            try {
                const result = await resetSetting(key, adminToken);
                if (result.success) {
                    showMessage("Setting reset to defaults", "success");
                    fetchSettings();
                } else {
                    showMessage(result.message, "error");
                }
            } catch (error) {
                showMessage("Error resetting setting", "error");
            }
        }
    };

    const filteredSettings =
        filter === "all"
            ? settings
            : settings.filter((s) => s.category === filter);

    const categories = ["all", ...new Set(settings.map((s) => s.category))];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <FiRefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-candle-yellow" />
                    <p className="text-candle-white">جاري التحميل...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-candle-white mb-2">
                        ⚙️ إدارة الإعدادات
                    </h2>
                    <p className="text-candle-white/70">
                        أدر جميع إعدادات الموقع ديناميكياً
                    </p>
                </div>
                <button
                    onClick={fetchSettings}
                    className="btn-secondary flex items-center gap-2"
                >
                    <FiRefreshCw size={18} />
                    تحديث
                </button>
            </div>

            {/* Message Alert */}
            {message && (
                <div
                    className={`p-4 rounded-lg flex items-center gap-3 ${
                        messageType === "success"
                            ? "bg-green-500/20 border border-green-500/50 text-green-200"
                            : "bg-red-500/20 border border-red-500/50 text-red-200"
                    }`}
                >
                    {messageType === "success" ? (
                        <FiCheck size={20} />
                    ) : (
                        <FiAlertCircle size={20} />
                    )}
                    {message}
                </div>
            )}

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            filter === cat
                                ? "bg-candle-yellow text-darker-bg"
                                : "bg-card-bg text-candle-white hover:bg-dark-bg"
                        }`}
                    >
                        {cat === "all"
                            ? "الكل"
                            : cat
                                  .replace(/_/g, " ")
                                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </button>
                ))}
            </div>

            {/* Settings Grid */}
            <div className="space-y-4">
                {filteredSettings.map((setting) => (
                    <SettingCard
                        key={setting.key}
                        setting={setting}
                        isEditing={editingKey === setting.key}
                        editValues={editValues}
                        onEdit={handleEdit}
                        onCancel={handleCancel}
                        onSave={handleSave}
                        onReset={handleReset}
                        onInputChange={handleInputChange}
                        onNestedChange={handleNestedChange}
                    />
                ))}
            </div>
        </div>
    );
};

// Setting Card Component
const SettingCard = ({
    setting,
    isEditing,
    editValues,
    onEdit,
    onCancel,
    onSave,
    onReset,
    onInputChange,
    onNestedChange,
}) => {
    return (
        <div className="bg-card-bg border border-border-color rounded-lg p-6 hover:border-candle-yellow/50 transition-all">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-candle-yellow capitalize">
                        🔧 {setting.key.replace(/_/g, " ")}
                    </h3>
                    <p className="text-candle-white/60 text-sm mt-1">
                        {setting.description}
                    </p>
                    <span className="inline-block mt-2 text-xs bg-bright-yellow/20 text-bright-yellow px-2 py-1 rounded capitalize">
                        {setting.category}
                    </span>
                </div>
                <div className="flex gap-2">
                    {!isEditing && (
                        <>
                            <button
                                onClick={() => onEdit(setting)}
                                className="btn-secondary text-sm flex items-center gap-1"
                            >
                                <FiEdit2 size={16} />
                                تعديل
                            </button>
                            <button
                                onClick={() => onReset(setting.key)}
                                className="px-3 py-2 text-sm bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-lg transition-all flex items-center gap-1"
                            >
                                <FiRefreshCw size={16} />
                                إعادة تعيين
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Content */}
            {isEditing ? (
                <EditableSettingContent
                    setting={setting}
                    editValues={editValues}
                    onInputChange={onInputChange}
                    onNestedChange={onNestedChange}
                />
            ) : (
                <ViewSettingContent value={setting.value} />
            )}

            {/* Actions */}
            {isEditing && (
                <div className="mt-6 flex gap-2 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-600/30 text-gray-300 hover:bg-gray-600/50 rounded-lg flex items-center gap-2 transition-all"
                    >
                        <FiX size={16} />
                        إلغاء
                    </button>
                    <button
                        onClick={() => onSave(setting.key)}
                        className="px-4 py-2 bg-green-500/30 text-green-300 hover:bg-green-500/50 rounded-lg flex items-center gap-2 transition-all"
                    >
                        <FiSave size={16} />
                        حفظ
                    </button>
                </div>
            )}
        </div>
    );
};

// View Setting Content
const ViewSettingContent = ({ value }) => {
    if (typeof value === "object") {
        return (
            <div className="bg-dark-bg/50 rounded p-4 space-y-2">
                {Object.entries(value).map(([key, val]) => (
                    <div key={key} className="text-sm">
                        <span className="text-bright-yellow font-medium">
                            {key.replace(/_/g, " ")}:
                        </span>
                        <span className="text-candle-white/80 ml-2">
                            {typeof val === "object"
                                ? JSON.stringify(val, null, 2)
                                : String(val)}
                        </span>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="bg-dark-bg/50 rounded p-4 text-candle-white/80">
            {String(value)}
        </div>
    );
};

// Editable Setting Content
const EditableSettingContent = ({
    setting,
    editValues,
    onInputChange,
    onNestedChange,
}) => {
    if (typeof editValues === "object" && !Array.isArray(editValues)) {
        return (
            <div className="space-y-4">
                {Object.entries(editValues).map(([key, val]) => {
                    if (typeof val === "object" && !Array.isArray(val)) {
                        return (
                            <div
                                key={key}
                                className="bg-dark-bg/30 rounded p-4"
                            >
                                <h4 className="text-bright-yellow font-semibold mb-3 capitalize">
                                    {key.replace(/_/g, " ")}
                                </h4>
                                <div className="space-y-3 ml-2">
                                    {Object.entries(val).map(
                                        ([subKey, subVal]) => (
                                            <div key={subKey}>
                                                <label className="block text-sm text-candle-white/70 mb-1 capitalize">
                                                    {subKey.replace(/_/g, " ")}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={subVal}
                                                    onChange={(e) =>
                                                        onNestedChange(
                                                            key,
                                                            subKey,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full bg-dark-bg border border-border-color rounded px-3 py-2 text-candle-white focus:outline-none focus:border-candle-yellow"
                                                />
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={key}>
                            <label className="block text-sm text-candle-white/70 mb-1 capitalize">
                                {key.replace(/_/g, " ")}
                            </label>
                            {typeof val === "boolean" ? (
                                <input
                                    type="checkbox"
                                    checked={val}
                                    onChange={(e) =>
                                        onInputChange(key, e.target.checked)
                                    }
                                    className="w-4 h-4"
                                />
                            ) : typeof val === "number" ? (
                                <input
                                    type="number"
                                    value={val}
                                    onChange={(e) =>
                                        onInputChange(
                                            key,
                                            Number(e.target.value)
                                        )
                                    }
                                    className="w-full bg-dark-bg border border-border-color rounded px-3 py-2 text-candle-white focus:outline-none focus:border-candle-yellow"
                                />
                            ) : (
                                <textarea
                                    value={val}
                                    onChange={(e) =>
                                        onInputChange(key, e.target.value)
                                    }
                                    rows="3"
                                    className="w-full bg-dark-bg border border-border-color rounded px-3 py-2 text-candle-white focus:outline-none focus:border-candle-yellow resize-none"
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }

    return (
        <input
            type="text"
            value={editValues}
            onChange={(e) => onInputChange("value", e.target.value)}
            className="w-full bg-dark-bg border border-border-color rounded px-3 py-2 text-candle-white focus:outline-none focus:border-candle-yellow"
        />
    );
};

export default AdminSettingsPage;
