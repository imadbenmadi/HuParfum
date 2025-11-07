// Admin routes
// Admin operations: manage orders, view statistics

const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protectAdmin } = require("../middlewares/auth");
const { limiter } = require("../middlewares/rateLimiter");

// Public route
router.post("/login", limiter, adminController.adminLogin);

// Protected routes (admin must be logged in)
router.get("/dashboard/stats", protectAdmin, adminController.getDashboardStats);
router.get("/orders", protectAdmin, adminController.getAllOrders);
router.put(
    "/orders/:orderId/status",
    protectAdmin,
    adminController.updateOrderStatus
);

module.exports = router;
