module.exports = (sequelize, DataTypes) => {
    const ServiceCategory = sequelize.define(
        "ServiceCategory",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true
            },
            code: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true
            },
            color: {
                type: DataTypes.STRING(30)
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
            tableName: "service_categories",
            timestamps: true,
            paranoid: true
        }
    );
    return ServiceCategory;
};
