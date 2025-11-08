// Admin controller
// Handles admin operations: manage orders, products, and send notifications

const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const Admin = require("../models/Admin");
const {
    sendPaymentConfirmationEmail,
    sendDeliveryInProgressEmail,
    sendDeliveryCompleteEmail,
} = require("../notifications/emailService");
const { sendStatusUpdateMessage } = require("../notifications/telegramUserBot");
const { sendStatusChangeAlert } = require("../notifications/telegramOpsBot");
require("dotenv").config();

// Admin login
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "الإيميل والكلمة السرية مطلوبة",
            });
        }

        const admin = await Admin.findOne({
            where: { email: email.toLowerCase() },
        });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "الإيميل أو الكلمة السرية غير صحيحة",
            });
        }

        const isPasswordCorrect = await admin.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "الإيميل أو الكلمة السرية غير صحيحة",
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: admin.role },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            message: "تمّ الدخول بنجاح!",
            token: token,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (err) {
        console.error("Admin login error:", err);
        res.status(500).json({
            success: false,
            message: "خطأ في الدخول",
            error: err.message,
        });
    }
};

// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: Product,
                    attributes: ["id", "name", "description", "price"],
                },
                {
                    model: User,
                    attributes: [
                        "id",
                        "name",
                        "phone",
                        "email",
                        "telegram_username",
                        "telegram_chat_id",
                    ],
                },
            ],
            order: [["created_at", "DESC"]],
        });

        const statusMap = {
            requested: "جديد",
            under_discussion: "قيد المناقشة",
            payed: "تمّ الدفع",
            delivering: "جاري التوصيل",
            delivered_successfully: "توصّل بنجاح",
        };

        const formattedOrders = orders.map((order) => ({
            id: order.id,
            customer: {
                id: order.User.id,
                name: order.User.name,
                phone: order.User.phone,
                email: order.User.email,
                telegram_username: order.User.telegram_username,
                telegram_chat_id: order.User.telegram_chat_id,
            },
            product: {
                id: order.Product.id,
                name: order.Product.name,
            },
            quantity: order.quantity,
            status: order.status,
            status_label: statusMap[order.status],
            telegram_linked: order.telegram_linked,
            delivery_agency: order.delivery_agency,
            created_at: order.created_at,
        }));

        res.json({
            success: true,
            count: formattedOrders.length,
            orders: formattedOrders,
        });
    } catch (err) {
        console.error("Get all orders error:", err);
        res.status(500).json({
            success: false,
            message: "خطأ في جلب الطلبيات",
            error: err.message,
        });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, delivery_agency } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "الحالة مطلوبة",
            });
        }

        const validStatuses = [
            "requested",
            "under_discussion",
            "payed",
            "delivering",
            "delivered_successfully",
        ];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "الحالة غير صحيحة",
            });
        }

        const order = await Order.findByPk(orderId, {
            include: [User, Product],
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "الطلب مالقاعش",
            });
        }

        const oldStatus = order.status;

        // Update order
        order.status = status;
        if (delivery_agency) {
            order.delivery_agency = delivery_agency;
        }
        await order.save();

        // Send notifications based on status change
        const user = order.User;

        if (status === "payed") {
            // Send payment confirmation
            if (user.email) {
                await sendPaymentConfirmationEmail(
                    user.email,
                    user.name,
                    order.id
                );
            }
        } else if (status === "delivering") {
            // Send delivery in progress email
            if (user.email) {
                await sendDeliveryInProgressEmail(
                    user.email,
                    user.name,
                    order.id,
                    delivery_agency || "وكالة التوصيل"
                );
            }
        } else if (status === "delivered_successfully") {
            // Send delivery complete email
            if (user.email) {
                await sendDeliveryCompleteEmail(
                    user.email,
                    user.name,
                    order.id
                );
            }
        }

        // Send Telegram notification if user is linked
        if (order.telegram_linked && user.telegram_chat_id) {
            await sendStatusUpdateMessage(
                user.telegram_chat_id,
                order.id,
                status,
                order.Product.name
            );
        }

        // Send admin alert
        await sendStatusChangeAlert(order.id, user.name, oldStatus, status);

        res.json({
            success: true,
            message: "تمّ تحديث الحالة بنجاح!",
            order: {
                id: order.id,
                status: order.status,
                delivery_agency: order.delivery_agency,
            },
        });
    } catch (err) {
        console.error("Update order status error:", err);
        res.status(500).json({
            success: false,
            message: "خطأ في تحديث الحالة",
            error: err.message,
        });
    }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
    try {
        const totalOrders = await Order.count();
        const todayOrders = await Order.count({
            where: {
                created_at: {
                    [require("sequelize").Op.gte]: new Date(
                        new Date().setHours(0, 0, 0, 0)
                    ),
                },
            },
        });

        const pendingOrders = await Order.count({
            where: {
                status: "requested",
            },
        });

        const completedOrders = await Order.count({
            where: {
                status: "delivered_successfully",
            },
        });

        const totalUsers = await User.count();

        res.json({
            success: true,
            stats: {
                total_orders: totalOrders,
                today_orders: todayOrders,
                pending_orders: pendingOrders,
                completed_orders: completedOrders,
                total_users: totalUsers,
            },
        });
    } catch (err) {
        console.error("Get dashboard stats error:", err);
        res.status(500).json({
            success: false,
            message: "خطأ في جلب الإحصائيات",
            error: err.message,
        });
    }
};

// Get all products (admin)
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            attributes: [
                "id",
                "name",
                "description",
                "category",
                "price",
                "stock",
            ],
            order: [["created_at", "DESC"]],
        });

        res.json({
            success: true,
            count: products.length,
            products: products,
        });
    } catch (err) {
        console.error("Get all products error:", err);
        res.status(500).json({
            success: false,
            message: "خطأ في جلب المنتجات",
            error: err.message,
        });
    }
};

module.exports = exports;
