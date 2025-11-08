// Seed script to populate initial data
const sequelize = require("./src/config/database");
const User = require("./src/models/User");
const Product = require("./src/models/Product");
const Admin = require("./src/models/Admin");

async function seedDatabase() {
    try {
        console.log("[INFO] Starting database seeding...");

        // Sync database
        await sequelize.sync({ force: false });
        console.log("[OK] Database synchronized");

        // Check if data already exists
        const existingProducts = await Product.count();
        if (existingProducts > 0) {
            console.log("[INFO] Products already exist, skipping seeding");
            process.exit(0);
        }

        // Create sample products with images
        const products = await Product.bulkCreate([
            {
                name: "عطر جميل",
                description: "عطر فاخر بروائح زهرية رقيقة من الجزائر",
                category: "عطور نسائية",
                price: 2500,
                stock: 50,
                image_url: "https://via.placeholder.com/300x400?text=عطر+جميل",
            },
            {
                name: "عطر رجالي عصري",
                description: "عطر ذكوري قوي بروائح خشبية وتابع",
                category: "عطور رجالية",
                price: 3000,
                stock: 40,
                image_url: "https://via.placeholder.com/300x400?text=عطر+رجالي",
            },
            {
                name: "عطر الورد الفاخر",
                description: "عطر مرموق برائحة الورد الطبيعي الجزائري",
                category: "عطور نسائية",
                price: 3500,
                stock: 30,
                image_url: "https://via.placeholder.com/300x400?text=عطر+ورد",
            },
            {
                name: "شمعة عطرية - المسك الملكي",
                description:
                    "شمعة فاخرة برائحة المسك والعنبر، تحترق لمدة 40 ساعة",
                category: "شموع عطرية",
                price: 1800,
                stock: 45,
                image_url: "https://via.placeholder.com/300x400?text=شمعة+مسك",
            },
            {
                name: "شمعة عطرية - الورد الدمشقي",
                description:
                    "شمعة بيضاء وصفراء برائحة الورد الدمشقي الجزائري الفاخر",
                category: "شموع عطرية",
                price: 1600,
                stock: 55,
                image_url: "https://via.placeholder.com/300x400?text=شمعة+ورد",
            },
            {
                name: "بخور فاخر - العود الأسود",
                description: "بخور طبيعي من العود الأسود، رائحة قوية وفاخرة",
                category: "بخور",
                price: 2200,
                stock: 35,
                image_url: "https://via.placeholder.com/300x400?text=بخور+عود",
            },
            {
                name: "مزيج شموع عطرية - الجزائرية",
                description:
                    "مجموعة شموع بألوان أبيض وأصفر برائح جزائرية تقليدية",
                category: "شموع عطرية",
                price: 4500,
                stock: 20,
                image_url: "https://via.placeholder.com/300x400?text=مزيج+شموع",
            },
            {
                name: "عطر مسك ملكي",
                description: "عطر ملكي برائحة المسك والعنبر الفاخرة",
                category: "عطور فاخرة",
                price: 5000,
                stock: 20,
                image_url: "https://via.placeholder.com/300x400?text=مسك+ملكي",
            },
        ]);
        console.log(`[OK] Created ${products.length} sample products`);

        // Create test admin account
        const admin = await Admin.create({
            name: "المدير",
            email: "admin@huparfum.com",
            password: "admin123", // Will be hashed by beforeCreate hook
            role: "super_admin",
        });
        console.log(
            "[OK] Created admin account (admin@huparfum.com / admin123)"
        );

        console.log("[OK] Database seeding completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("[ERROR] Seeding error:", err);
        process.exit(1);
    }
}

seedDatabase();
