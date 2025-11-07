// Authentication middleware
// Protects routes and verifies JWT tokens

const { verifyToken } = require("../utils/jwt");
const User = require("../models/User");
const Admin = require("../models/Admin");

// Protect user routes
exports.protectUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "لا يوجد توكن. قم بتسجيل الدخول أولاً",
            });
        }

        const decoded = verifyToken(token);

        if (!decoded || decoded.type !== "user") {
            return res.status(401).json({
                success: false,
                message: "التوكن غير صحيح أو منتهي الصلاحية",
            });
        }

        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "المستخدم مالقاعش",
            });
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("Protect user error:", err);
        res.status(500).json({
            success: false,
            message: "خطأ في التحقق من التوكن",
            error: err.message,
        });
    }
};

// Protect admin routes
exports.protectAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "لا يوجد توكن. قم بتسجيل الدخول أولاً",
            });
        }

        const decoded = verifyToken(token);

        if (!decoded || decoded.type !== "admin") {
            return res.status(401).json({
                success: false,
                message: "التوكن غير صحيح أو منتهي الصلاحية",
            });
        }

        const admin = await Admin.findByPk(decoded.id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "الإداري مالقاعش",
            });
        }

        req.admin = admin;
        next();
    } catch (err) {
        console.error("Protect admin error:", err);
        res.status(500).json({
            success: false,
            message: "خطأ في التحقق من التوكن",
            error: err.message,
        });
    }
};

module.exports = exports;
