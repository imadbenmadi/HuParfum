// Order controller
// Handles order creation, retrieval, and status updates

const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const { sendOrderConfirmationEmail } = require("../notifications/emailService");
const { sendNewOrderAlert } = require("../notifications/telegramOpsBot");
require("dotenv").config();

// Create new order
exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { product_id, quantity } = req.body;

        // Validation
        if (!product_id || !quantity) {
            return res.status(400).json({
                success: false,
                message: "المنتوج والكمية مطلوبة",
            });
        }

        // Get user
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "المستخدم مالقاعش",
            });
        }

        // Get product
        const product = await Product.findByPk(product_id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "المنتوج مالقاعش",
            });
        }

        // Create order
        const order = await Order.create({
            user_id: userId,
            product_id,
            quantity,
            status: "requested",
            telegram_linked: false,
        });

        // Send confirmation email to user
        const totalPrice = product.price * quantity;
        await sendOrderConfirmationEmail(
            user.email,
            user.name,
            order.id,
            product.name,
            quantity,
            totalPrice
        );

        // Send alert to admin
        await sendNewOrderAlert(
            order.id,
            user.name,
            user.phone,
            user.email,
            product.name,
            quantity,
            totalPrice
        );

        res.status(201).json({
            success: true,
            message: "تمّ إضافة الطلب بنجاح!",
            order: {
                id: order.id,
                product_id: product.id,
                product_name: product.name,
                quantity,
                price: totalPrice,
                status: order.status,
                created_at: order.created_at,
            },
        });
    } catch (err) {
        console.error("Create order error:", err);
        res.status(500).json({
            success: false,
            message: "خطأ في إضافة الطلب",
            error: err.message,
        });
    }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await Order.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: Product,
                    attributes: [
                        "id",
                        "name",
                        "description",
                        "price",
                        "image_url",
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
            product: order.Product,
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
        console.error("Get user orders error:", err);
        res.status(500).json({
            success: false,
            message: "خطأ في جلب الطلبيات",
            error: err.message,
        });
    }
};

// Get single order
exports.getOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { orderId } = req.params;

        const order = await Order.findOne({
            where: {
                id: orderId,
                user_id: userId,
            },
            include: [
                {
                    model: Product,
                    attributes: [
                        "id",
                        "name",
                        "description",
                        "price",
                        "image_url",
                    ],
                },
                {
                    model: User,
                    attributes: ["id", "name", "phone", "email"],
                },
            ],
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "الطلب مالقاعش",
            });
        }

        const statusMap = {
            requested: "جديد",
            under_discussion: "قيد المناقشة",
            payed: "تمّ الدفع",
            delivering: "جاري التوصيل",
            delivered_successfully: "توصّل بنجاح",
        };

        res.json({
            success: true,
            order: {
                id: order.id,
                product: order.Product,
                quantity: order.quantity,
                status: order.status,
                status_label: statusMap[order.status],
                telegram_linked: order.telegram_linked,
                delivery_agency: order.delivery_agency,
                created_at: order.created_at,
            },
        });
    } catch (err) {
        console.error("Get order error:", err);
        res.status(500).json({
            success: false,
            message: "خطأ في جلب الطلب",
            error: err.message,
        });
    }
};

module.exports = exports;
