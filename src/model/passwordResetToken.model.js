module.exports = (sequelize, DataTypes) => {

    return sequelize.define(
        "PasswordResetToken",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },

            userId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },

            token: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true
            },

            expiresAt: {
                type: DataTypes.DATE,
                allowNull: false
            },

            isUsed: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        },
        {
            tableName: "password_reset_tokens",
            timestamps: true
        }
    );

};