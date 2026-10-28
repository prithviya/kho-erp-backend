module.exports = (sequelize, DataTypes) => sequelize.define(
    "TaskChatMessage",
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        taskId: { type: DataTypes.INTEGER, allowNull: false },
        senderId: { type: DataTypes.INTEGER, allowNull: false },
        message: { type: DataTypes.TEXT, allowNull: false },
        mentionedUserIds: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
        attachments: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
        editedAt: { type: DataTypes.DATE, allowNull: true }
    },
    { tableName: "task_chat_messages", timestamps: true, paranoid: true }
);
