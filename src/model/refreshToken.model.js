module.exports = (sequelize, DataTypes) => {

    return sequelize.define("RefreshToken", {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        token: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        deviceId: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        deviceName: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        browser: {
            type: DataTypes.STRING(100),
            allowNull: true
        },

        os: {
            type: DataTypes.STRING(100),
            allowNull: true
        },

        ipAddress: {
            type: DataTypes.STRING(50),
            allowNull: true
        },

        userAgent: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        rotatedFromTokenId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        lastUsedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },

        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        },

        isRevoked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }

    }, {

        tableName: "refresh_tokens",

        timestamps: true,

        indexes: [
            {
                fields: ["userId"]
            },
            {
                fields: ["token"]
            },
            {
                fields: ["isRevoked"]
            },
            {
                fields: ["expiresAt"]
            }
        ]

    });

};