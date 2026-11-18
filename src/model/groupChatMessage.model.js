module.exports = (sequelize, DataTypes) => sequelize.define(
    "GroupChatMessage",
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        groupId: { type: DataTypes.INTEGER, allowNull: false },
        senderId: { type: DataTypes.INTEGER, allowNull: true },
        message: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
        isSystem: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        isPinned: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        mentionedUserIds: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
        attachments: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
    },
    { tableName: "group_chat_messages", timestamps: true, paranoid: true }
);
