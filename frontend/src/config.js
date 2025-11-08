// Frontend configuration
// Store API base URL and other settings

const API_BASE_URL =
    process.env.REACT_APP_API_URL || "http://localhost:5001/api";
const TELEGRAM_BOT_USERNAME = "HuParfumBot";

export const API = {
    // Auth endpoints
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
    verifyEmail: `${API_BASE_URL}/auth/verify-email`,
    profile: `${API_BASE_URL}/auth/profile`,

    // Order endpoints
    createOrder: `${API_BASE_URL}/orders/create`,
    getOrders: `${API_BASE_URL}/orders/my-orders`,
    getOrder: (id) => `${API_BASE_URL}/orders/${id}`,

    // Admin endpoints
    adminLogin: `${API_BASE_URL}/admin/login`,
    adminOrders: `${API_BASE_URL}/admin/orders`,
    updateOrderStatus: (id) => `${API_BASE_URL}/admin/orders/${id}/status`,
    dashboardStats: `${API_BASE_URL}/admin/dashboard/stats`,

    // Telegram endpoints
    generateTelegramLink: `${API_BASE_URL}/telegram/generate-link`,
};

export const TELEGRAM = {
    botUsername: TELEGRAM_BOT_USERNAME,
    deepLinkBase: `https://t.me/${TELEGRAM_BOT_USERNAME}`,
    houdaLink: "https://t.me/houda",
};

export const APP = {
    name: "HuParfum",
    tagline: "أطيب الريحات الجزائرية",
    description: "متجر الريحات الفاخرة الجزائري",
};
