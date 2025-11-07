// Database Configuration for HuParfum
// Connects to MySQL using Sequelize ORM

const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        port: process.env.DB_PORT || 3306,
        logging: false, // Set to console.log for debugging
    }
);

// Test the connection
sequelize
    .authenticate()
    .then(() => console.log("[OK] Database connected successfully"))
    .catch((err) => console.error("[ERROR] Database connection error:", err));

module.exports = sequelize;
