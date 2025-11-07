// User authentication controller
// Handles registration, login, email verification, and profile management

const User = require("../models/User");
const {
    generateUserToken,
    generateVerificationToken,
    verifyToken,
} = require("../utils/jwt");
const { sendVerificationEmail } = require("../notifications/emailService");
require("dotenv").config();

// Register user
exports.register = async (req, res) => {
    try {
        const { name, phone, email, password, passwordConfirm } = req.body;

        // Validation
        if (!name || !phone || !email || !password || !passwordConfirm) {
            return res.status(400).json({
                success: false,
                message: "جميع الحقول مطلوبة",
            });
        }

        if (password !== passwordConfirm) {
            return res.status(400).json({
                success: false,
                message: "الكلمات السرية ما تتطابقش",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            where: {
                email: email.toLowerCase(),
            },
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "هاد الإيميل مسجّل بالفعل",
            });
        }

        const existingPhone = await User.findOne({
            where: {
                phone: phone,
            },
        });

        if (existingPhone) {
            return res.status(400).json({
                success: false,
                message: "هاد الرقم مسجّل بالفعل",
            });
        }

        // Create user
        const user = await User.create({
            name,
            phone,
            email: email.toLowerCase(),
            password,
            email_verified: false,
        });

        // Generate verification token and link
        const verificationToken = generateVerificationToken(user.email);
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

        // Send verification email
        await sendVerificationEmail(user.email, user.name, verificationLink);

        res.status(201).json({
            success: true,
            message: "تمّ التسجيل بنجاح! شوف بريدك باش تأكّد الحساب",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
        });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({
            success: false,
            message: "خطأ في التسجيل",
            error: err.message,
        });
    }
};

// Verify email
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "التوكن مطلوب",
            });
        }

        const decoded = verifyToken(token);

        if (!decoded || decoded.type !== "verification") {
            return res.status(400).json({
                success: false,
                message: "التوكن غير صحيح أو منتهي الصلاحية",
            });
        }

        const user = await User.findOne({
            where: {
                email: decoded.email,
            },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "المستخدم مالقاعش",
            });
        }

        if (user.email_verified) {
            return res.status(400).json({
                success: false,
                message: "حسابك أكّد بالفعل",
            });
        }

        // Mark email as verified
        user.email_verified = true;
        await user.save();

        res.json({
            success: true,
            message: "تمّ التأكيد بنجاح! دخول للحساب ديالك",
        });
    } catch (err) {
        console.error("Email verification error:", err);
        res.status(500).json({
            success: false,
            message: "خطأ في التأكيد",
            error: err.message,
        });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "الإيميل والكلمة السرية مطلوبة",
            });
        }

        const user = await User.findOne({
            where: {
                email: email.toLowerCase(),
            },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "الإيميل أو الكلمة السرية غير صحيحة",
            });
        }

        if (!user.email_verified) {
            return res.status(403).json({
                success: false,
                message: "أكّد حسابك أول. شوف الإيميل ديالك",
            });
        }

        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "الإيميل أو الكلمة السرية غير صحيحة",
            });
        }

        const token = generateUserToken(user.id);

        res.json({
            success: true,
            message: "تمّ الدخول بنجاح!",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                email_verified: user.email_verified,
                telegram_linked: !!user.telegram_chat_id,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({
            success: false,
            message: "خطأ في الدخول",
            error: err.message,
        });
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findByPk(userId, {
            attributes: { exclude: ["password"] },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "المستخدم مالقاعش",
            });
        }

        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                email_verified: user.email_verified,
                telegram_linked: !!user.telegram_chat_id,
                telegram_username: user.telegram_username,
            },
        });
    } catch (err) {
        console.error("Get profile error:", err);
        res.status(500).json({
            success: false,
            message: "خطأ في جلب البروفايل",
            error: err.message,
        });
    }
};

module.exports = exports;
