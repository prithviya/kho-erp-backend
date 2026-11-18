module.exports = (sequelize, DataTypes) => sequelize.define(
    "GroupChat",
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING(100), allowNull: false },
        profileImage: { type: DataTypes.STRING(512), allowNull: true },
        createdBy: { type: DataTypes.INTEGER, allowNull: false },
    },
    { tableName: "group_chats", timestamps: true, paranoid: true }
);
