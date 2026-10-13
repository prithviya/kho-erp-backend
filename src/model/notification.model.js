module.exports = (sequelize, DataTypes) => sequelize.define(
    "Notification",
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        userId: { type: DataTypes.INTEGER, allowNull: false },
        type: { type: DataTypes.STRING(50), allowNull: false, defaultValue: "PROJECT_MENTION" },
        projectOnboardId: { type: DataTypes.INTEGER, allowNull: true },
        message: { type: DataTypes.TEXT, allowNull: false },
        metadata: { type: DataTypes.JSON, allowNull: false, defaultValue: {} },
        readAt: { type: DataTypes.DATE, allowNull: true }
    },
    { tableName: "notifications", timestamps: true }
);
