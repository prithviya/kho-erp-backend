module.exports = (sequelize, DataTypes) => sequelize.define(
    "TaskActivity",
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        taskId: { type: DataTypes.INTEGER, allowNull: false },
        actorId: { type: DataTypes.INTEGER, allowNull: true },
        actorName: { type: DataTypes.STRING(255), allowNull: false },
        action: { type: DataTypes.STRING(32), allowNull: false },
        previousValue: { type: DataTypes.STRING(255), allowNull: true },
        newValue: { type: DataTypes.STRING(255), allowNull: false }
    },
    { tableName: "task_activities", timestamps: true }
);
