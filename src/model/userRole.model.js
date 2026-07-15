module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "UserRole",
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            roleId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            tableName: "user_roles",
            timestamps: false,
        }
    );
};