// Database Seeding System
// Initializes default admin, products, and other necessary data on first startup
// Handles all edge cases: no duplicates, idempotent operations

const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const Product = require("../models/Product");
const User = require("../models/User");
const FeatureFlag = require("../models/FeatureFlag");
const WebsiteSettings = require("../models/WebsiteSettings");

/**
 * Seed database with initial data
 * Safe to run multiple times - handles duplicates and existing data
 */
async function seedDatabase() {
    try {
        console.log("\n[SEED] Starting database seeding process...");

        // Step 1: Seed Admin Users
        await seedAdminUsers();

        // Step 2: Seed Products
        await seedProducts();

        // Step 3: Seed Default Users
        await seedDefaultUsers();

        // Step 4: Seed Feature Flags (already done but can re-verify)
        await seedFeatureFlags();

        // Step 5: Seed Website Settings (already done but can re-verify)
        await seedWebsiteSettings();

        console.log("[SEED] ✅ Database seeding completed successfully\n");
        return true;
    } catch (error) {
        console.error("[SEED] ❌ Error during seeding:", error.message);
        throw error;
    }
}

/**
 * Seed admin users
 * Ensures default admin exists without duplicates
 */
async function seedAdminUsers() {
    try {
        console.log("[SEED] Seeding admin users...");

        const adminAccounts = [
            {
                name: "Admin",
                email: "admin@huparfum.com",
                password: "admin-password", // Will be hashed
                role: "super_admin",
                telegram_chat_id: null,
            },
            {
                name: "Manager",
                email: "manager@huparfum.com",
                password: "manager-password",
                role: "admin",
                telegram_chat_id: null,
            },
            {
                name: "Moderator",
                email: "moderator@huparfum.com",
                password: "moderator-password",
                role: "moderator",
                telegram_chat_id: null,
            },
        ];

        for (const adminData of adminAccounts) {
            // Check if admin already exists
            const existingAdmin = await Admin.findOne({
                where: { email: adminData.email },
            });

            if (existingAdmin) {
                console.log(
                    `  [✓] Admin already exists: ${adminData.email} (skipped)`
                );
                continue;
            }

            // Hash password before creating
            const hashedPassword = await bcrypt.hash(adminData.password, 10);

            // Create new admin
            const admin = await Admin.create({
                ...adminData,
                password: hashedPassword,
            });

            console.log(`  [+] Created admin: ${admin.email} (${admin.role})`);
        }

        console.log("[SEED] ✅ Admin users seeded\n");
    } catch (error) {
        console.error("[SEED] Error seeding admins:", error.message);
        throw error;
    }
}

/**
 * Seed products
 * Creates sample perfume and candle products
 */
async function seedProducts() {
    try {
        console.log("[SEED] Seeding products...");

        const products = [
            {
                name: "عطر الورد الفاخر",
                description: "عطر فاخر جزائري من أجود الورود بصيغة تقليدية",
                price: 5000,
                image_url: "https://via.placeholder.com/300x300?text=Perfume1",
            },
            {
                name: "عطر الياسمين الأصلي",
                description: "عطر الياسمين الطبيعي 100% جزائري الصنع",
                price: 4500,
                image_url: "https://via.placeholder.com/300x300?text=Perfume2",
            },
            {
                name: "عطر المسك الذهبي",
                description: "مزيج فاخر من المسك والعود برائحة آسرة",
                price: 6000,
                image_url: "https://via.placeholder.com/300x300?text=Perfume3",
            },
            {
                name: "شمعة الفانيلا والعود",
                description: "شمعة عطرية فاخرة برائحة الفانيلا والعود الدافئة",
                price: 2000,
                image_url: "https://via.placeholder.com/300x300?text=Candle1",
            },
            {
                name: "شمعة البخور الطبيعية",
                description: "شمعة من شمع البخور الطبيعي برائحة هادئة",
                price: 2500,
                image_url: "https://via.placeholder.com/300x300?text=Candle2",
            },
            {
                name: "عطر البرتقال والزنجبيل",
                description: "مزيج منعش من البرتقال والزنجبيل الطبيعي",
                price: 4000,
                image_url: "https://via.placeholder.com/300x300?text=Perfume4",
            },
            {
                name: "شمعة الورد والياسمين",
                description: "شمعة عطرية مزدوجة الرائحة من الورد والياسمين",
                price: 2800,
                image_url: "https://via.placeholder.com/300x300?text=Candle3",
            },
            {
                name: "عطر القصب والسنديان",
                description: "عطر كلاسيكي جزائري برائحة دافئة وثابتة",
                price: 5500,
                image_url: "https://via.placeholder.com/300x300?text=Perfume5",
            },
        ];

        let createdCount = 0;
        let skippedCount = 0;

        for (const productData of products) {
            // Check if product already exists (by name)
            const existingProduct = await Product.findOne({
                where: { name: productData.name },
            });

            if (existingProduct) {
                console.log(
                    `  [✓] Product already exists: ${productData.name}`
                );
                skippedCount++;
                continue;
            }

            // Create new product
            await Product.create(productData);
            console.log(`  [+] Created product: ${productData.name}`);
            createdCount++;
        }

        console.log(
            `[SEED] ✅ Products seeded (${createdCount} new, ${skippedCount} existing)\n`
        );
    } catch (error) {
        console.error("[SEED] Error seeding products:", error.message);
        throw error;
    }
}

/**
 * Seed default test users
 * Creates sample customer accounts
 */
async function seedDefaultUsers() {
    try {
        console.log("[SEED] Seeding default users...");

        const users = [
            {
                name: "Test User",
                email: "test@example.com",
                phone: "0123456789",
                password: "Test@12345",
                verified: true,
                telegram_linked: false,
            },
            {
                name: "John Doe",
                email: "john@example.com",
                phone: "0987654321",
                password: "John@12345",
                verified: true,
                telegram_linked: false,
            },
        ];

        let createdCount = 0;
        let skippedCount = 0;

        for (const userData of users) {
            // Check if user already exists
            const existingUser = await User.findOne({
                where: { email: userData.email },
            });

            if (existingUser) {
                console.log(`  [✓] User already exists: ${userData.email}`);
                skippedCount++;
                continue;
            }

            // Hash password before creating
            const hashedPassword = await bcrypt.hash(userData.password, 10);

            // Create new user
            await User.create({
                ...userData,
                password: hashedPassword,
            });

            console.log(`  [+] Created user: ${userData.email}`);
            createdCount++;
        }

        console.log(
            `[SEED] ✅ Default users seeded (${createdCount} new, ${skippedCount} existing)\n`
        );
    } catch (error) {
        console.error("[SEED] Error seeding users:", error.message);
        throw error;
    }
}

/**
 * Verify feature flags exist
 */
async function seedFeatureFlags() {
    try {
        console.log("[SEED] Verifying feature flags...");

        const featureFlags = [
            {
                feature_name: "email_verification",
                status: "optional",
                description: "Email verification for user registration",
            },
            {
                feature_name: "product_reviews",
                status: "optional",
                description: "Allow customers to review products",
            },
            {
                feature_name: "discount_system",
                status: "optional",
                description: "Enable discount codes",
            },
        ];

        let createdCount = 0;
        let skippedCount = 0;

        for (const flagData of featureFlags) {
            const existingFlag = await FeatureFlag.findOne({
                where: { feature_name: flagData.feature_name },
            });

            if (existingFlag) {
                console.log(
                    `  [✓] Feature flag exists: ${flagData.feature_name}`
                );
                skippedCount++;
                continue;
            }

            await FeatureFlag.create(flagData);
            console.log(`  [+] Created feature flag: ${flagData.feature_name}`);
            createdCount++;
        }

        console.log(
            `[SEED] ✅ Feature flags verified (${createdCount} new, ${skippedCount} existing)\n`
        );
    } catch (error) {
        console.error("[SEED] Error with feature flags:", error.message);
        throw error;
    }
}

/**
 * Verify website settings exist
 */
async function seedWebsiteSettings() {
    try {
        console.log("[SEED] Verifying website settings...");

        const settings = [
            {
                key: "social_media",
                category: "social_media",
                description: "Social media links and information",
                value: {
                    telegram: {
                        personal_link: "https://t.me/imedbenmadi",
                        customer_bot: "HuParfumBot",
                        admin_bot: "HuParfumAdminBot",
                    },
                    instagram: {
                        handle: "@huparfum",
                        link: "https://instagram.com/huparfum",
                    },
                    facebook: {
                        page: "HuParfum",
                        link: "https://facebook.com/huparfum",
                    },
                    whatsapp: {
                        number: "+213123456789",
                        link: "https://wa.me/213123456789",
                    },
                },
            },
            {
                key: "contact",
                category: "contact",
                description: "Contact information",
                value: {
                    email: "info@huparfum.com",
                    phone: "+213123456789",
                    address: "Algiers, Algeria",
                    business_hours: "10:00 AM - 10:00 PM",
                },
            },
            {
                key: "homepage",
                category: "homepage",
                description: "Homepage content",
                value: {
                    hero_title: "أطيب الريحات والشموع الفاخرة الجزائرية",
                    hero_subtitle:
                        "اكتشف مجموعة عطورنا وشموعنا المختارة بعناية من أجود الروائح الجزائرية الأصلية",
                    featured_products_title: "منتجاتنا المختارة",
                    featured_products_count: 3,
                    show_testimonials: true,
                    tagline: "عطور وشموع فاخرة جزائرية 🕯️✨",
                },
            },
            {
                key: "general",
                category: "general",
                description: "General website settings",
                value: {
                    site_name: "HuParfum",
                    site_description: "Algerian Perfume E-Commerce Platform",
                    currency: "DZD",
                    language: "ar",
                    timezone: "Africa/Algiers",
                },
            },
            {
                key: "branding",
                category: "branding",
                description: "Branding and visual settings",
                value: {
                    logo_text: "HuParfum",
                    logo_emoji: "🕯️",
                    primary_color: "#FFD700",
                    secondary_color: "#1a1a1a",
                },
            },
        ];

        let createdCount = 0;
        let skippedCount = 0;

        for (const settingData of settings) {
            const existingSetting = await WebsiteSettings.findOne({
                where: { key: settingData.key },
            });

            if (existingSetting) {
                console.log(`  [✓] Setting exists: ${settingData.key}`);
                skippedCount++;
                continue;
            }

            await WebsiteSettings.create(settingData);
            console.log(`  [+] Created setting: ${settingData.key}`);
            createdCount++;
        }

        console.log(
            `[SEED] ✅ Website settings verified (${createdCount} new, ${skippedCount} existing)\n`
        );
    } catch (error) {
        console.error("[SEED] Error with settings:", error.message);
        throw error;
    }
}

/**
 * Check if database needs seeding
 * Returns true if any critical data is missing
 */
async function needsSeeding() {
    try {
        // Check if any admin exists
        const adminCount = await Admin.count();

        // Check if any products exist
        const productCount = await Product.count();

        // If no admins, definitely needs seeding
        if (adminCount === 0) {
            return true;
        }

        // If less than 3 products, might need seeding
        if (productCount < 3) {
            return true;
        }

        return false;
    } catch (error) {
        console.error(
            "[SEED] Error checking if seeding needed:",
            error.message
        );
        return true; // Assume it needs seeding if there's an error
    }
}

module.exports = {
    seedDatabase,
    needsSeeding,
    seedAdminUsers,
    seedProducts,
    seedDefaultUsers,
    seedFeatureFlags,
    seedWebsiteSettings,
};
