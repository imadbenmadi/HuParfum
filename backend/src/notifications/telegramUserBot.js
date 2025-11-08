// Telegram user bot service
// Sends notifications to users when their order status changes

const axios = require("axios");
require("dotenv").config();

const BOT_TOKEN = process.env.USER_BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

// Get Arabic status label with emoji
function getStatusMessageArabic(status) {
    const messages = {
        requested:
            "🆕 طلبياتك تسجّلت في النظام! في الانتظار شوي حتى نتكلم معاك.",
        under_discussion:
            "💬 هسع راك في النقاش معانا. غادي نخبّرك بأي خبر جديد.",
        payed: " الدفع تمّ بنجاح! الحمد لله غادي نبدا نتحضّر للتوصيل.",
        delivering: "🚚 الطلب خارج مع وكالة التوصيل! توصّلك قريب قريب.",
        delivered_successfully:
            "🎁 الحمد لله! الطلب توصّل بنجاح. نتمنى تكون راضي! شكراً على الثقة! 🙏",
    };
    return messages[status] || status;
}

// Send status update message to user
async function sendStatusUpdateMessage(chatId, orderId, status, productName) {
    const message = `
📦 *تحديث الطلب #${orderId}*

المنتوج: ${productName}
الحالة الجديدة: *${getStatusMessageArabic(status)}*

---
لو عندك أي استفسار، اضغط على الزرّ تحتاه👇
  `;

    try {
        await axios.post(`${API_URL}/sendMessage`, {
            chat_id: chatId,
            text: message,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📞 تواصل مع هدى", url: "https://t.me/houda" }],
                ],
            },
        });
        console.log(
            ` Status update sent to chat ${chatId} for order #${orderId}`
        );
    } catch (err) {
        console.error(
            `❌ Failed to send status update to chat ${chatId}:`,
            err.message
        );
    }
}

// Send initial linking confirmation
async function sendLinkingConfirmation(chatId, userName) {
    const message = `
 *تمّ الربط بنجاح!*

سلام يا ${userName}! 👋

راك مربوط معنا في نظام الإشعارات ديال HuParfum. من هسع فصاعدا، غادي توصلك كل التحديثات هنا مباشرة!

🔔 ستتسلّم إشعارات:
• عند تغيير حالة الطلب
• عند تأكيد الدفع
• عند بدء التوصيل
• عند وصول الطلب

---
شكراً على الثقة! 🙏
  `;

    try {
        await axios.post(`${API_URL}/sendMessage`, {
            chat_id: chatId,
            text: message,
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [{ text: "📞 تواصل مع هدى", url: "https://t.me/houda" }],
                ],
            },
        });
        console.log(` Linking confirmation sent to chat ${chatId}`);
    } catch (err) {
        console.error(
            `❌ Failed to send linking confirmation to chat ${chatId}:`,
            err.message
        );
    }
}

// Send last 5 orders status
async function sendOrdersStatus(chatId, orders) {
    let message = `📋 *طلبياتك الأخيرة:*\n\n`;

    if (orders.length === 0) {
        message = `🔍 ما عندك حتى طلبية هسع! 
    
    بغيت تشري ريحة جميلة؟ زيد واحد! 🌹`;
    } else {
        orders.forEach((order, index) => {
            const statusMap = {
                requested: "جديد 🆕",
                under_discussion: "قيد المناقشة 💬",
                payed: "تمّ الدفع ",
                delivering: "جاري التوصيل 🚚",
                delivered_successfully: "توصّل بنجاح 🎁",
            };

            message += `${index + 1}. *الطلب #${order.id}*
المنتوج: ${order.Product?.name || "غير محدد"}
الحالة: ${statusMap[order.status] || order.status}
التاريخ: ${new Date(order.created_at).toLocaleDateString("ar-DZ")}
---
`;
        });
    }

    try {
        await axios.post(`${API_URL}/sendMessage`, {
            chat_id: chatId,
            text: message,
            parse_mode: "Markdown",
        });
        console.log(` Orders status sent to chat ${chatId}`);
    } catch (err) {
        console.error(
            `❌ Failed to send orders status to chat ${chatId}:`,
            err.message
        );
    }
}

module.exports = {
    sendStatusUpdateMessage,
    sendLinkingConfirmation,
    sendOrdersStatus,
};
