module.exports = (sequelize, DataTypes) => {
    const Payroll = sequelize.define(
        "Payroll",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            employeeId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            month: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            year: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            grossSalary: {
                type: DataTypes.DECIMAL(12, 2),
                allowNull: false,
                defaultValue: 0,
            },
            lopDays: {
                type: DataTypes.DECIMAL(8, 2),
                allowNull: false,
                defaultValue: 0,
            },
            workingDays: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 30,
            },
            netSalary: {
                type: DataTypes.DECIMAL(12, 2),
                allowNull: false,
                defaultValue: 0,
            },
            status: {
                type: DataTypes.STRING(30),
                allowNull: false,
                defaultValue: "Draft",
            },
            paidAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            createdBy: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            tableName: "payrolls",
            timestamps: true,
            paranoid: true,
        }
    );

    return Payroll;
};
