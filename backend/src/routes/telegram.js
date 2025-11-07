// Telegram webhook routes
// Handles Telegram bot updates: user linking, commands, etc.

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
const {
    verifyTelegramToken,
    generateTelegramToken,
} = require("../utils/encryption");
const {
    sendLinkingConfirmation,
    sendOrdersStatus,
} = require("../notifications/telegramUserBot");
const { sendUserLinkingAlert } = require("../notifications/telegramOpsBot");
const { telegramWebhookLimiter } = require("../middlewares/rateLimiter");
require("dotenv").config();

// Telegram user bot webhook
router.post("/user-bot/webhook", telegramWebhookLimiter, async (req, res) => {
    try {
        const update = req.body;

        if (!update.message && !update.callback_query) {
            return res.json({ ok: true });
        }

        // Handle start command with token
        if (update.message?.text?.startsWith("/start")) {
            const parts = update.message.text.split(" ");
            const chatId = update.message.chat.id;
            const userName = update.message.chat.first_name || "صديقي";

            if (parts.length === 2) {
                const encryptedToken = parts[1];
                const tokenData = verifyTelegramToken(encryptedToken);

                if (!tokenData.valid) {
                    return res.json({ ok: true });
                }

                const { user_id, order_id } = tokenData.data;

                // Check if user exists
                const user = await User.findByPk(user_id);
                if (!user) {
                    return res.json({ ok: true });
                }

                // Check if order exists and belongs to this user
                const order = await Order.findOne({
                    where: {
                        id: order_id,
                        user_id: user_id,
                    },
                });

                if (!order) {
                    return res.json({ ok: true });
                }

                // Check if already linked
                if (
                    user.telegram_chat_id === String(chatId) &&
                    order.telegram_linked
                ) {
                    return res.json({ ok: true });
                }

                // Link user to telegram
                user.telegram_chat_id = String(chatId);
                user.telegram_username = update.message.chat.username || "";
                await user.save();

                // Link order to telegram
                order.telegram_linked = true;
                await order.save();

                // Send confirmation
                await sendLinkingConfirmation(chatId, user.name);

                // Send admin alert
                await sendUserLinkingAlert(
                    user.id,
                    user.name,
                    order.id,
                    chatId
                );
            } else {
                // Just /start without token
                // Send welcome message
                const welcomeMessage = `
🎁 *مرحبا بيك في HuParfum!*

هاد البوت يخبّرك على طلبياتك في الفور! 
استعمل /status باش تشوف طلبياتك.

🛍️ روح على الموقع: ${process.env.FRONTEND_URL}
        `;

                const axios = require("axios");
                await axios.post(
                    `https://api.telegram.org/bot${process.env.USER_BOT_TOKEN}/sendMessage`,
                    {
                        chat_id: chatId,
                        text: welcomeMessage,
                        parse_mode: "Markdown",
                    }
                );
            }

            return res.json({ ok: true });
        }

        // Handle /status command
        if (update.message?.text === "/status") {
            const chatId = update.message.chat.id;

            // Find user by telegram_chat_id
            const user = await User.findOne({
                where: {
                    telegram_chat_id: String(chatId),
                },
            });

            if (!user) {
                return res.json({ ok: true });
            }

            // Get user's last 5 orders
            const orders = await Order.findAll({
                where: {
                    user_id: user.id,
                },
                include: [Product],
                order: [["created_at", "DESC"]],
                limit: 5,
            });

            // Send orders status
            await sendOrdersStatus(chatId, orders);

            return res.json({ ok: true });
        }

        res.json({ ok: true });
    } catch (err) {
        console.error("Telegram webhook error:", err);
        res.json({ ok: false, error: err.message });
    }
});

// Generate Telegram link endpoint (for frontend)
router.post("/generate-link", async (req, res) => {
    try {
        const { user_id, order_id } = req.body;

        if (!user_id || !order_id) {
            return res.status(400).json({
                success: false,
                message: "user_id و order_id مطلوبة",
            });
        }

        // Check if order exists and belongs to user
        const order = await Order.findOne({
            where: {
                id: order_id,
                user_id: user_id,
            },
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "الطلب مالقاعش",
            });
        }

        // Generate encrypted token
        const token = generateTelegramToken(user_id, order_id, 24);

        // Generate deep link
        const deepLink = `${process.env.TELEGRAM_DEEP_LINK_BASE}?start=${token}`;

        res.json({
            success: true,
            deep_link: deepLink,
            message: "رابط الربط تمّ إنشاؤه بنجاح",
        });
    } catch (err) {
        console.error("Generate link error:", err);
        res.status(500).json({
            success: false,
            message: "خطأ في إنشاء الرابط",
            error: err.message,
        });
    }
});

module.exports = router;
