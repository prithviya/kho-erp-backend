module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define(
        "Role",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },
            code: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },

            description: {
                type: DataTypes.STRING(255),
            },

            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            tableName: "roles",
            timestamps: true,
            paranoid: true,
        }
    );

    return Role;
};