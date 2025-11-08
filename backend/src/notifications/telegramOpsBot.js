// Telegram operations bot service
// Sends alerts to admin about new orders, linking, and status changes

const axios = require("axios");
require("dotenv").config();

const BOT_TOKEN = process.env.OPS_BOT_TOKEN;
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;
const ADMIN_CHAT_ID = process.env.HOUDA_TELEGRAM_ID;

// Send new order alert to admin
async function sendNewOrderAlert(
    orderId,
    customerName,
    phone,
    email,
    productName,
    quantity,
    price
) {
    const message = `
🛍️ *طلب جديد! #${orderId}*

👤 *الزبون:* ${customerName}
📱 *الرقم:* ${phone}
📧 *الإيميل:* ${email}
🎁 *المنتوج:* ${productName}
📊 *الكمية:* ${quantity}
💰 *السعر:* ${price} دج

---
اضغط تحتاه باش تتكلم مع الزبون في التيليجرام 👇
  `;

    try {
        await axios.post(`${API_URL}/sendMessage`, {
            chat_id: ADMIN_CHAT_ID,
            text: message,
            parse_mode: "Markdown",
        });
        console.log(` New order alert sent to admin for order #${orderId}`);
    } catch (err) {
        console.error(`❌ Failed to send new order alert:`, err.message);
    }
}

// Send user linking alert to admin
async function sendUserLinkingAlert(userId, userName, orderId, userChatId) {
    const message = `
🔗 *الزبون ربط التيليجرام!*

👤 *الزبون:* ${userName} (ID: ${userId})
🎫 *الطلب:* #${orderId}
💬 *Telegram ID:* ${userChatId}

---
الزبون هسع غادي يتسلّم الإشعارات في الفور!
  `;

    try {
        await axios.post(`${API_URL}/sendMessage`, {
            chat_id: ADMIN_CHAT_ID,
            text: message,
            parse_mode: "Markdown",
        });
        console.log(` User linking alert sent to admin for user #${userId}`);
    } catch (err) {
        console.error(`❌ Failed to send user linking alert:`, err.message);
    }
}

// Send status change alert to admin
async function sendStatusChangeAlert(
    orderId,
    customerName,
    oldStatus,
    newStatus
) {
    const statusMap = {
        requested: "جديد",
        under_discussion: "قيد المناقشة",
        payed: "تمّ الدفع",
        delivering: "جاري التوصيل",
        delivered_successfully: "توصّل بنجاح",
    };

    const message = `
🔄 *تغيير الحالة للطلب #${orderId}*

👤 *الزبون:* ${customerName}
📌 *الحالة القديمة:* ${statusMap[oldStatus] || oldStatus}
➡️ *الحالة الجديدة:* ${statusMap[newStatus] || newStatus}

---
تمّ إرسال إشعار للزبون تلقائياً 
  `;

    try {
        await axios.post(`${API_URL}/sendMessage`, {
            chat_id: ADMIN_CHAT_ID,
            text: message,
            parse_mode: "Markdown",
        });
        console.log(` Status change alert sent to admin for order #${orderId}`);
    } catch (err) {
        console.error(`❌ Failed to send status change alert:`, err.message);
    }
}

module.exports = {
    sendNewOrderAlert,
    sendUserLinkingAlert,
    sendStatusChangeAlert,
};
