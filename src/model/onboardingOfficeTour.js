module.exports = (sequelize, DataTypes) => {
    const OnboardingOffice = sequelize.define(
        "OnboardingOffice",
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
                    model: "cif_personals",
                    key: "cifid",
                },
            },
            onboardinginfoid: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "onboard_info",
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
            tableName: "office_tours",
            timestamps: true,
            paranoid: true,
        }
    );

    return OnboardingOffice;
};
