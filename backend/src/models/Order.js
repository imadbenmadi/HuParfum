// Order Model for HuParfum
// Stores customer orders with status tracking and Telegram linking

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Product = require("./Product");

const Order = sequelize.define(
    "Order",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Product,
                key: "id",
            },
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        // Status values: requested, under_discussion, payed, delivering, delivered_successfully
        status: {
            type: DataTypes.ENUM(
                "requested",
                "under_discussion",
                "payed",
                "delivering",
                "delivered_successfully"
            ),
            defaultValue: "requested",
        },
        delivery_agency: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        telegram_linked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        timestamps: true,
        underscored: true,
    }
);

// Associations
Order.belongsTo(User, { foreignKey: "user_id" });
Order.belongsTo(Product, { foreignKey: "product_id" });
User.hasMany(Order, { foreignKey: "user_id" });
Product.hasMany(Order, { foreignKey: "product_id" });

module.exports = Order;
