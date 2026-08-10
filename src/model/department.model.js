module.exports = (sequelize, DataTypes) => {
    const Department = sequelize.define(
        "department",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },

            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true
            },

            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            }
        },
        {
            tableName: "departments",
            timestamps: true,
            paranoid: true
        }
    );

    return Department;
};