// JWT authentication utility
// Creates and verifies JSON Web Tokens for user and admin authentication

const jwt = require("jsonwebtoken");
require("dotenv").config();

// Generate JWT token for user
function generateUserToken(userId) {
    return jwt.sign({ id: userId, type: "user" }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
}

// Generate JWT token for admin
function generateAdminToken(adminId) {
    return jwt.sign({ id: adminId, type: "admin" }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
}

// Verify JWT token
function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return null;
    }
}

// Generate email verification token (shorter expiry: 24h)
function generateVerificationToken(email) {
    return jwt.sign({ email, type: "verification" }, process.env.JWT_SECRET, {
        expiresIn: "24h",
    });
}

module.exports = {
    generateUserToken,
    generateAdminToken,
    verifyToken,
    generateVerificationToken,
};
