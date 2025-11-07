// Order routes
// Order creation, retrieval, and user order history

const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protectUser } = require("../middlewares/auth");
const { limiter } = require("../middlewares/rateLimiter");

// Protected routes (user must be logged in)
router.post("/create", protectUser, limiter, orderController.createOrder);
router.get("/my-orders", protectUser, orderController.getUserOrders);
router.get("/:orderId", protectUser, orderController.getOrder);

module.exports = router;
