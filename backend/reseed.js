// Reseed script - clears and populates with new candle products
const sequelize = require("./src/config/database");
const Product = require("./src/models/Product");

async function reseedDatabase() {
    try {
        console.log("[INFO] Starting database reseed...");

        // Sync database
        await sequelize.sync({ force: false });
        console.log("[OK] Database synchronized");

        // Delete all existing products
        const deletedCount = await Product.destroy({ where: {} });
        console.log(`[OK] Deleted ${deletedCount} existing products`);

        // Create new sample products with candles
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
                    "شمعة فاخرة برائحة المسك والعنبر، تحترق لمدة 40 ساعة. بيضاء وصفراء فاخرة",
                category: "شموع عطرية",
                price: 1800,
                stock: 45,
                image_url: "https://via.placeholder.com/300x400?text=شمعة+مسك",
            },
            {
                name: "شمعة عطرية - الورد الدمشقي",
                description:
                    "شمعة بيضاء وصفراء برائحة الورد الدمشقي الجزائري الفاخر، تحترق لمدة 50 ساعة",
                category: "شموع عطرية",
                price: 1600,
                stock: 55,
                image_url: "https://via.placeholder.com/300x400?text=شمعة+ورد",
            },
            {
                name: "بخور فاخر - العود الأسود",
                description:
                    "بخور طبيعي من العود الأسود، رائحة قوية وفاخرة جزائرية أصلية",
                category: "بخور",
                price: 2200,
                stock: 35,
                image_url: "https://via.placeholder.com/300x400?text=بخور+عود",
            },
            {
                name: "مزيج شموع عطرية - الجزائرية",
                description:
                    "مجموعة شموع بألوان أبيض وأصفر برائح جزائرية تقليدية فاخرة، كل شمعة تحترق لمدة 35 ساعة",
                category: "شموع عطرية",
                price: 4500,
                stock: 20,
                image_url: "https://via.placeholder.com/300x400?text=مزيج+شموع",
            },
            {
                name: "عطر مسك ملكي",
                description: "عطر ملكي برائحة المسك والعنبر الفاخرة الجزائرية",
                category: "عطور فاخرة",
                price: 5000,
                stock: 20,
                image_url: "https://via.placeholder.com/300x400?text=مسك+ملكي",
            },
        ]);
        console.log(
            `[OK] Created ${products.length} new products with candles`
        );

        console.log("[OK] Database reseeding completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("[ERROR] Reseeding error:", err);
        process.exit(1);
    }
}

reseedDatabase();
