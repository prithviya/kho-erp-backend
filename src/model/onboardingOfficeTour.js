module.exports = (sequelize, DataTypes) => {
    const OfficeTour = sequelize.define(
        "OfficeTour",
        {
            otid: {
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

            reception: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            workstationSheet: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            meetingRoom: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            cafeteria: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            hrCabin: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            tableName: "officeTours",
            timestamps: true,
            paranoid: true,
        }
    );

    return OfficeTour;
};