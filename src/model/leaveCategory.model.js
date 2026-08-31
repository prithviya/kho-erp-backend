module.exports = (sequelize, DataTypes) => {
    const LeaveCategory = sequelize.define(
        "LeaveCategory",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            code: {
                type: DataTypes.STRING(80),
                allowNull: false,
                unique: true,
            },
            name: {
                type: DataTypes.STRING(120),
                allowNull: false,
            },
            unit: {
                type: DataTypes.ENUM("DAY", "HOUR"),
                allowNull: false,
                defaultValue: "DAY",
            },
            allocatedValue: {
                type: DataTypes.DECIMAL(8, 2),
                allowNull: false,
                defaultValue: 0,
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        },
        {
            tableName: "leave_categories",
            timestamps: true,
            paranoid: true,
        }
    );

    return LeaveCategory;
};
