// Admin Products Page - Product Management with Validation

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
    validateProductForm,
    calculateDiscountPercentage,
} from "../utils/adminProductValidation";

function AdminProductsPage({ adminToken }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);

    // Form fields
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        reduction_price: "",
        category: "",
        stock: "",
    });

    const [fieldErrors, setFieldErrors] = useState({});
    const [generalError, setGeneralError] = useState("");
    const [generalSuccess, setGeneralSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const nameInputRef = useRef(null);

    useEffect(() => {
        fetchProducts();
    }, [adminToken]);

    useEffect(() => {
        if (showForm && nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, [showForm]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await axios.get(
                "http://localhost:5001/api/admin/products",
                {
                    headers: { Authorization: `Bearer ${adminToken}` },
                }
            );
            if (res.data.success) {
                setProducts(res.data.products);
            }
        } catch (err) {
            console.error("Failed to fetch products:", err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            price: "",
            reduction_price: "",
            category: "",
            stock: "",
        });
        setFieldErrors({});
        setGeneralError("");
        setGeneralSuccess("");
        setIsEditing(false);
        setEditingProductId(null);
    };

    const handleOpenForm = (product = null) => {
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                reduction_price: product.reduction_price || "",
                category: product.category,
                stock: product.stock,
            });
            setIsEditing(true);
            setEditingProductId(product.id);
        } else {
            resetForm();
        }
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        resetForm();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear field error when user starts typing
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError("");
        setGeneralSuccess("");

        // Frontend validation
        const validation = validateProductForm(formData);

        if (!validation.valid) {
            setFieldErrors(validation.errors);
            setGeneralError("تحقق من الحقول أعلاه");
            return;
        }

        setSubmitting(true);

        try {
            const url = isEditing
                ? `http://localhost:5001/api/admin/products/${editingProductId}`
                : "http://localhost:5001/api/admin/products";

            const method = isEditing ? "put" : "post";

            const res = await axios({
                method,
                url,
                data: {
                    name: formData.name.trim(),
                    description: formData.description.trim(),
                    price: parseFloat(formData.price),
                    reduction_price:
                        formData.reduction_price === ""
                            ? null
                            : parseFloat(formData.reduction_price),
                    category: formData.category,
                    stock: parseInt(formData.stock),
                },
                headers: { Authorization: `Bearer ${adminToken}` },
            });

            if (res.data.success) {
                setGeneralSuccess(
                    isEditing
                        ? "تم تحديث المنتج بنجاح"
                        : "تم إضافة المنتج بنجاح"
                );
                fetchProducts();
                setTimeout(() => handleCloseForm(), 1500);
            }
        } catch (err) {
            setGeneralError(err.response?.data?.message || "خطأ في حفظ المنتج");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (productId) => {
        if (!window.confirm("هل تريد حذف هذا المنتج؟")) return;

        try {
            const res = await axios.delete(
                `http://localhost:5001/api/admin/products/${productId}`,
                {
                    headers: { Authorization: `Bearer ${adminToken}` },
                }
            );

            if (res.data.success) {
                fetchProducts();
            }
        } catch (err) {
            console.error("Failed to delete product:", err);
        }
    };

    const discountPercentage = calculateDiscountPercentage(
        formData.price,
        formData.reduction_price
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-candle-white">
                    إدارة المنتجات
                </h2>
                <button
                    className="btn-primary"
                    onClick={() => handleOpenForm()}
                >
                    ➕ إضافة منتج جديد
                </button>
            </div>

            {loading ? (
                <p className="text-center text-candle-yellow text-lg">
                    جاري التحميل...
                </p>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-card-bg border border-border-color rounded-xl overflow-hidden hover:border-candle-yellow/50 transition-all"
                        >
                            <div className="text-5xl text-center py-8 bg-gradient-to-br from-candle-yellow/20 to-bright-yellow/20">
                                🧴
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-candle-white mb-2">
                                    {product.name}
                                </h3>
                                <p className="text-text-muted text-sm mb-4 line-clamp-2">
                                    {product.description}
                                </p>

                                <div className="mb-4 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-text-muted text-sm">
                                            الفئة:
                                        </span>
                                        <span className="text-candle-white font-medium">
                                            {product.category}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-text-muted text-sm">
                                            المخزون:
                                        </span>
                                        <span className="text-blue-300 font-medium">
                                            {product.stock}
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-4 space-y-2 pb-4 border-b border-border-color">
                                    <div className="flex justify-between items-center">
                                        <span className="text-text-muted text-sm">
                                            السعر:
                                        </span>
                                        <span className="text-bright-yellow font-bold">
                                            {product.price} دج
                                        </span>
                                    </div>
                                    {product.reduction_price && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-text-muted text-sm">
                                                بعد الخصم:
                                            </span>
                                            <div className="text-right">
                                                <div className="text-green-400 font-bold">
                                                    {product.reduction_price} دج
                                                </div>
                                                <div className="text-xs text-green-300">
                                                    (خصم{" "}
                                                    {calculateDiscountPercentage(
                                                        product.price,
                                                        product.reduction_price
                                                    )}
                                                    %)
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        className="flex-1 px-3 py-2 bg-candle-yellow text-darker-bg rounded font-semibold text-sm hover:shadow-yellow-md transition-all"
                                        onClick={() => handleOpenForm(product)}
                                    >
                                        ✏️ تعديل
                                    </button>
                                    <button
                                        className="flex-1 px-3 py-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded font-semibold text-sm hover:bg-red-500/30 transition-all"
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        🗑️ حذف
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-text-muted mb-4">
                        لا توجد منتجات حالياً
                    </p>
                    <button
                        className="btn-primary"
                        onClick={() => handleOpenForm()}
                    >
                        ➕ إضافة أول منتج
                    </button>
                </div>
            )}

            {/* Product Form Modal */}
            {showForm && (
                <div
                    className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto"
                    onClick={handleCloseForm}
                >
                    <div
                        className="bg-card-bg border border-border-color rounded-xl max-w-2xl w-full shadow-2xl my-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-border-color">
                            <h3 className="text-xl font-bold text-candle-white">
                                {isEditing ? "تعديل المنتج" : "إضافة منتج جديد"}
                            </h3>
                            <button
                                className="text-text-muted hover:text-candle-white text-2xl"
                                onClick={handleCloseForm}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Error Messages */}
                        {generalError && (
                            <div className="p-6 pb-0">
                                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
                                    {generalError}
                                </div>
                            </div>
                        )}

                        {generalSuccess && (
                            <div className="p-6 pb-0">
                                <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300">
                                    {generalSuccess}
                                </div>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-text-primary font-medium mb-2">
                                    اسم المنتج
                                </label>
                                <input
                                    ref={nameInputRef}
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="مثال: عطر رقيق"
                                    className={`w-full px-4 py-3 bg-dark-bg border rounded-lg text-text-primary focus:outline-none focus:border-candle-yellow transition-colors ${
                                        fieldErrors.name
                                            ? "border-red-500 bg-red-500/10"
                                            : "border-border-color"
                                    }`}
                                />
                                {fieldErrors.name && (
                                    <p className="text-red-400 text-sm mt-1">
                                        {fieldErrors.name}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-text-primary font-medium mb-2">
                                    الوصف
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="أضف وصفاً مفصلاً للمنتج"
                                    rows="3"
                                    className={`w-full px-4 py-3 bg-dark-bg border rounded-lg text-text-primary focus:outline-none focus:border-candle-yellow transition-colors resize-none ${
                                        fieldErrors.description
                                            ? "border-red-500 bg-red-500/10"
                                            : "border-border-color"
                                    }`}
                                />
                                {fieldErrors.description && (
                                    <p className="text-red-400 text-sm mt-1">
                                        {fieldErrors.description}
                                    </p>
                                )}
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-text-primary font-medium mb-2">
                                    الفئة
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 bg-dark-bg border rounded-lg text-text-primary focus:outline-none focus:border-candle-yellow transition-colors ${
                                        fieldErrors.category
                                            ? "border-red-500 bg-red-500/10"
                                            : "border-border-color"
                                    }`}
                                >
                                    <option value="">اختر فئة...</option>
                                    <option value="عطور">عطور</option>
                                    <option value="مسك">مسك</option>
                                    <option value="عود">عود</option>
                                    <option value="بخور">بخور</option>
                                </select>
                                {fieldErrors.category && (
                                    <p className="text-red-400 text-sm mt-1">
                                        {fieldErrors.category}
                                    </p>
                                )}
                            </div>

                            {/* Price Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Price */}
                                <div>
                                    <label className="block text-text-primary font-medium mb-2">
                                        السعر الأصلي (دج)
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        className={`w-full px-4 py-3 bg-dark-bg border rounded-lg text-text-primary focus:outline-none focus:border-candle-yellow transition-colors ${
                                            fieldErrors.price
                                                ? "border-red-500 bg-red-500/10"
                                                : "border-border-color"
                                        }`}
                                    />
                                    {fieldErrors.price && (
                                        <p className="text-red-400 text-sm mt-1">
                                            {fieldErrors.price}
                                        </p>
                                    )}
                                </div>

                                {/* Reduction Price */}
                                <div>
                                    <label className="block text-text-primary font-medium mb-2">
                                        سعر الخصم (دج) - اختياري
                                    </label>
                                    <input
                                        type="number"
                                        name="reduction_price"
                                        value={formData.reduction_price}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        step="0.01"
                                        min="0"
                                        className={`w-full px-4 py-3 bg-dark-bg border rounded-lg text-text-primary focus:outline-none focus:border-candle-yellow transition-colors ${
                                            fieldErrors.reduction_price
                                                ? "border-red-500 bg-red-500/10"
                                                : "border-border-color"
                                        }`}
                                    />
                                    {fieldErrors.reduction_price && (
                                        <p className="text-red-400 text-sm mt-1">
                                            {fieldErrors.reduction_price}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Discount Display */}
                            {formData.price && formData.reduction_price && (
                                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                    <p className="text-green-300 text-sm">
                                        ✅ خصم{" "}
                                        <span className="font-bold">
                                            {discountPercentage}%
                                        </span>
                                        : من{" "}
                                        <span className="font-bold">
                                            {formData.price}
                                        </span>
                                        إلى{" "}
                                        <span className="font-bold">
                                            {formData.reduction_price}
                                        </span>
                                        دج
                                    </p>
                                </div>
                            )}

                            {/* Stock */}
                            <div>
                                <label className="block text-text-primary font-medium mb-2">
                                    المخزون (الكمية)
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    placeholder="0"
                                    min="0"
                                    className={`w-full px-4 py-3 bg-dark-bg border rounded-lg text-text-primary focus:outline-none focus:border-candle-yellow transition-colors ${
                                        fieldErrors.stock
                                            ? "border-red-500 bg-red-500/10"
                                            : "border-border-color"
                                    }`}
                                />
                                {fieldErrors.stock && (
                                    <p className="text-red-400 text-sm mt-1">
                                        {fieldErrors.stock}
                                    </p>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-4 border-t border-border-color">
                                <button
                                    type="submit"
                                    className="btn-primary flex-1"
                                    disabled={submitting}
                                >
                                    {submitting
                                        ? "جاري الحفظ..."
                                        : isEditing
                                        ? "تحديث المنتج"
                                        : "إضافة المنتج"}
                                </button>
                                <button
                                    type="button"
                                    className="btn-secondary flex-1"
                                    onClick={handleCloseForm}
                                    disabled={submitting}
                                >
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminProductsPage;
