module.exports = (sequelize, DataTypes) => sequelize.define(
    "ProjectChatMessage",
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        projectOnboardId: { type: DataTypes.INTEGER, allowNull: false },
        senderId: { type: DataTypes.INTEGER, allowNull: false },
        message: { type: DataTypes.TEXT, allowNull: false },
        mentionedUserIds: { type: DataTypes.JSON, allowNull: false, defaultValue: [] }
    },
    { tableName: "project_chat_messages", timestamps: true, paranoid: true }
);
