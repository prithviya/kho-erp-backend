module.exports = (sequelize, DataTypes) => {

    return sequelize.define(
        "RefreshToken",
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
                type: DataTypes.TEXT,
                allowNull: false
            },

            expiresAt: {
                type: DataTypes.DATE,
                allowNull: false
            },

            isRevoked: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        },
        {
            tableName: "refresh_tokens",
            timestamps: true
        }
    );

};