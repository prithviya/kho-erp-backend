module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define(
        "Task",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            projectOnboardId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            serviceId: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            title: {
                type: DataTypes.STRING(200),
                allowNull: false
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            assignedToId: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            additionalAssigneeIds: {
                type: DataTypes.JSON,
                allowNull: true,
                get() {
                    const value = this.getDataValue("additionalAssigneeIds");
                    if (typeof value !== "string") return value;
                    try { return JSON.parse(value); } catch { return []; }
                }
            },
            assignedVendorId: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            reportingHeadId: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            priority: {
                type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH"),
                allowNull: false,
                defaultValue: "MEDIUM"
            },
            status: {
                type: DataTypes.ENUM("TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"),
                allowNull: false,
                defaultValue: "TODO"
            },
            dueDate: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            dueTime: {
                type: DataTypes.STRING(5),
                allowNull: true
            },
            reminderAt: {
                type: DataTypes.DATE,
                allowNull: true
            },
            completedAt: {
                type: DataTypes.DATE,
                allowNull: true
            },
            createdBy: {
                type: DataTypes.INTEGER,
                allowNull: true
            }
        },
        {
            tableName: "tasks",
            timestamps: true,
            paranoid: true
        }
    );

    return Task;
};
