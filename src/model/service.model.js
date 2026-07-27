module.exports = (sequelize, DataTypes) => {
    const Service = sequelize.define(
        "Service",
        {
            serviceid: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            servicename: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },

            categoryid: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "services",
            timestamps: true,
        }
    );

    Service.associate = (models) => {
        Service.belongsTo(models.ServiceCategory, {
            foreignKey: "categoryid",
            as: "category",
        });
    };

    return Service;
};