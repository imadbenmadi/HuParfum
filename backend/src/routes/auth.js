// Authentication routes
// User registration, login, email verification

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protectUser } = require("../middlewares/auth");
const { authLimiter } = require("../middlewares/rateLimiter");

// Public routes
router.post("/register", authLimiter, authController.register);
router.post("/verify-email", authLimiter, authController.verifyEmail);
router.post("/login", authLimiter, authController.login);

// Protected routes
router.get("/profile", protectUser, authController.getProfile);

module.exports = router;
