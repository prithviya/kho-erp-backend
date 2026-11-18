module.exports = (sequelize, DataTypes) => sequelize.define(
    "GroupChatMember",
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        groupId: { type: DataTypes.INTEGER, allowNull: false },
        userId: { type: DataTypes.INTEGER, allowNull: false },
        addedBy: { type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: "group_chat_members", timestamps: true }
);
