module.exports = (sequelize, DataTypes) => {

    const Permission = sequelize.define(
        "Permission",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },

            moduleId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            action: {
                type: DataTypes.STRING(100),
                allowNull: false
            },

            permissionKey: {
                type: DataTypes.STRING(150),
                allowNull: false,
                unique: true
            },

            description: {
                type: DataTypes.STRING(255)
            },

            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            }
        },
        {
            tableName: "permissions",
            timestamps: true,
            paranoid: true
        }
    );

    return Permission;
};