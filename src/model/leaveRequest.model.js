module.exports = (sequelize, DataTypes) => {
    const LeaveRequest = sequelize.define(
        "LeaveRequest",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            employeeCode: {
                type: DataTypes.STRING(40),
                allowNull: true,
            },
            employeeName: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            categoryId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            fromDate: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            toDate: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            durationType: {
                type: DataTypes.ENUM("FULL_DAY", "HALF_DAY", "QUARTER_DAY", "HOURS"),
                allowNull: false,
                defaultValue: "FULL_DAY",
            },
            session: {
                type: DataTypes.ENUM("MORNING", "NOON"),
                allowNull: true,
            },
            quarterSlot: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            startTime: {
                type: DataTypes.STRING(5),
                allowNull: true,
            },
            endTime: {
                type: DataTypes.STRING(5),
                allowNull: true,
            },
            requestedDays: {
                type: DataTypes.DECIMAL(8, 2),
                allowNull: false,
                defaultValue: 0,
            },
            requestedHours: {
                type: DataTypes.DECIMAL(8, 2),
                allowNull: false,
                defaultValue: 0,
            },
            reason: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED", "CANCELLED"),
                allowNull: false,
                defaultValue: "PENDING",
            },
            approverId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            approverRemarks: {
                type: DataTypes.STRING(500),
                allowNull: true,
            },
            approvedAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            tableName: "leave_requests",
            timestamps: true,
            paranoid: true,
        }
    );

    return LeaveRequest;
};
