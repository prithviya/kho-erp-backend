module.exports = (sequelize, DataTypes) => sequelize.define(
    "ActivityLog",
    {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        actorId: { type: DataTypes.INTEGER, allowNull: true },
        actorName: { type: DataTypes.STRING(255), allowNull: false, defaultValue: "System" },
        projectId: { type: DataTypes.INTEGER, allowNull: true },
        projectName: { type: DataTypes.STRING(255), allowNull: true },
        module: { type: DataTypes.STRING(64), allowNull: false },
        action: { type: DataTypes.STRING(32), allowNull: false },
        entityType: { type: DataTypes.STRING(64), allowNull: true },
        entityId: { type: DataTypes.STRING(64), allowNull: true },
        description: { type: DataTypes.STRING(500), allowNull: false },
        method: { type: DataTypes.STRING(10), allowNull: true },
        route: { type: DataTypes.STRING(255), allowNull: true },
        statusCode: { type: DataTypes.INTEGER, allowNull: true },
        ipAddress: { type: DataTypes.STRING(64), allowNull: true },
        metadata: { type: DataTypes.JSON, allowNull: true }
    },
    {
        tableName: "activity_logs",
        timestamps: true,
        updatedAt: false,
        indexes: [
            { fields: ["createdAt"] },
            { fields: ["projectId", "createdAt"] },
            { fields: ["actorId", "createdAt"] }
        ]
    }
);
