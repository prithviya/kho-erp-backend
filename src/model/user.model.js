module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            uuid: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },

            firstName: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            lastName: {
                type: DataTypes.STRING,
            },

            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },

            phone: {
                type: DataTypes.STRING(20),
            },

            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },

            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            tableName: "users",
            timestamps: true,
            paranoid: true,
        }
    );

    return User;
};