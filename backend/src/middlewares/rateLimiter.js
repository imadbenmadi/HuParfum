// Rate limiting middleware
// Prevents abuse of API endpoints

const rateLimit = require("express-ratelimit");

// General rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "لقد تجاوزت حد الطلبات. حاول لاحقا",
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict rate limiter for authentication endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: "لقد حاولت عدة مرات. حاول لاحقا",
    skipSuccessfulRequests: false,
});

// Telegram webhook rate limiter
const telegramWebhookLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 50, // limit each IP to 50 requests per minute
    message: "حد الطلبات تجاوز",
    skipSuccessfulRequests: false,
});

module.exports = {
    limiter,
    authLimiter,
    telegramWebhookLimiter,
};
