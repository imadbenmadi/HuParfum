// Feature Flag Model
// Manages system-wide feature toggles and settings

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const FeatureFlag = sequelize.define(
    "FeatureFlag",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        feature_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            comment: "Unique feature identifier (e.g., email_verification)",
        },
        status: {
            type: DataTypes.ENUM("required", "optional", "disabled"),
            defaultValue: "optional",
            comment:
                "required: Must verify, optional: Show popup, disabled: Skip",
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: "Feature description",
        },
        config: {
            type: DataTypes.JSON,
            defaultValue: {},
            comment:
                "Feature-specific configuration (e.g., email service, provider)",
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
        tableName: "feature_flags",
        timestamps: false,
    }
);

module.exports = FeatureFlag;
