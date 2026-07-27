module.exports = (sequelize, DataTypes) => {
    const ServiceCategory = sequelize.define(
        "ServiceCategory",
        {
            categoryid: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            categoryname: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },
        },
        {
            tableName: "service_categories",
            timestamps: true,
        }
    );

    ServiceCategory.associate = (models) => {
        ServiceCategory.hasMany(models.Service, {
            foreignKey: "categoryid",
            as: "services",
        });
    };

    return ServiceCategory;
};