// Encryption utility for Telegram token generation and verification
// Uses AES-256-CBC for secure token encryption

const crypto = require("crypto");
require("dotenv").config();

// Generate encrypted token for Telegram deep linking
function generateTelegramToken(userId, orderId, expiryHours = 24) {
    const encryptionKey = Buffer.from(
        process.env.ENCRYPTION_KEY.padEnd(32, "0").slice(0, 32)
    );
    const iv = crypto.randomBytes(16);

    const data = JSON.stringify({
        user_id: userId,
        order_id: orderId,
        timestamp: Date.now(),
        expiry: Date.now() + expiryHours * 60 * 60 * 1000,
    });

    const cipher = crypto.createCipheriv("aes-256-cbc", encryptionKey, iv);
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");

    const token = iv.toString("hex") + ":" + encrypted;
    return token;
}

// Decrypt and verify Telegram token
function verifyTelegramToken(token) {
    try {
        const encryptionKey = Buffer.from(
            process.env.ENCRYPTION_KEY.padEnd(32, "0").slice(0, 32)
        );
        const [ivHex, encrypted] = token.split(":");
        const iv = Buffer.from(ivHex, "hex");

        const decipher = crypto.createDecipheriv(
            "aes-256-cbc",
            encryptionKey,
            iv
        );
        let decrypted = decipher.update(encrypted, "hex", "utf8");
        decrypted += decipher.final("utf8");

        const data = JSON.parse(decrypted);

        // Check if token has expired
        if (Date.now() > data.expiry) {
            return { valid: false, error: "Token expired" };
        }

        return { valid: true, data };
    } catch (err) {
        return { valid: false, error: err.message };
    }
}

module.exports = {
    generateTelegramToken,
    verifyTelegramToken,
};
