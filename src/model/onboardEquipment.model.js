module.exports = (sequelize, DataTypes) => {
    const Equipment = sequelize.define(
        "Equipment",
        {
            eqid: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },

            cifid: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "cifPersonals",
                    key: "cifid",
                },
            },

            onboardinginfoid: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "onboardinfo",
                    key: "onboardinginfoid",
                },
            },

            laptop: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            mouse: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            keyboard: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            entryCardRecognition: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            headset: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            welcomeKit: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            tableName: "onboardingEquipments",
            timestamps: true,
            paranoid: true,
        }
    );

    return Equipment;
};