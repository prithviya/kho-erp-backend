module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "RolePermission",
        {
            roleId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },

            permissionId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
        },
        {
            tableName: "role_permissions",
            timestamps: false,
        }
    );
};