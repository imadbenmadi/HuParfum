// Website Settings Model
// Stores website configuration as JSON for easy management
// Includes social media, Telegram links, homepage content, etc.

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const WebsiteSettings = sequelize.define(
    "WebsiteSettings",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            comment:
                "Settings key (e.g., 'social_media', 'homepage', 'contact')",
        },
        value: {
            type: DataTypes.JSON,
            defaultValue: {},
            comment: "Settings value stored as JSON",
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: "Description of what this setting controls",
        },
        category: {
            type: DataTypes.ENUM(
                "social_media",
                "contact",
                "homepage",
                "general",
                "branding"
            ),
            defaultValue: "general",
            comment: "Category for organizing settings",
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            onUpdate: DataTypes.NOW,
        },
    },
    {
        tableName: "website_settings",
        timestamps: false,
        underscored: true,
    }
);

module.exports = WebsiteSettings;
