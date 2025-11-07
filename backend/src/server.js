// Main server file for HuParfum Backend
// Initialize Express app, setup middleware, and start listening

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

// Import database and models
const sequelize = require("./config/database");
const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");
const Admin = require("./models/Admin");

// Import routes
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/orders");
const adminRoutes = require("./routes/admin");
const telegramRoutes = require("./routes/telegram");

// Import middleware
const { limiter } = require("./middlewares/rateLimiter");

// Initialize Express app
const app = express();

// Middleware setup
app.use(helmet()); // Security headers
app.use(cors()); // CORS
app.use(express.json()); // Parse JSON
app.use(limiter); // Rate limiting

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/telegram", telegramRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        message: "HuParfum Backend is running",
        timestamp: new Date(),
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "الصفحة مالقاعش",
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error("Server error:", err);
    res.status(500).json({
        success: false,
        message: "خطأ في السيرفر",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
});

// Initialize database and start server
async function startServer() {
    try {
        // Sync database
        await sequelize.sync({ alter: true });
        console.log("[OK] Database synchronized");

        // Start listening
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`[OK] HuParfum Backend running on port ${PORT}`);
            console.log(`[INFO] Environment: ${process.env.NODE_ENV}`);
        });
    } catch (err) {
        console.error("[ERROR] Failed to start server:", err);
        process.exit(1);
    }
}

startServer();

module.exports = app;
