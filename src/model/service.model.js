module.exports = (sequelize, DataTypes) => {
    const Service = sequelize.define(
        "Service",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            serviceCategoryId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            code: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true
            },
            displayOrder: {
                type: DataTypes.INTEGER,
                defaultValue: 1
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            }
        },
        {
            tableName: "services",
            timestamps: true,
            paranoid: true
        }
    );
    return Service;
};