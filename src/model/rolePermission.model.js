module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "RolePermission",
        {
            roleId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            permissionId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "role_permissions",
            timestamps: false,
        }
    );
};