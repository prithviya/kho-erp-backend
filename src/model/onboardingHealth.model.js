module.exports = (sequelize, DataTypes) => {
    const HealthEmergency = sequelize.define(
        "healthEmergency",
        {
            hid: {
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


            takingTablets: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            healthIssues: {
                type: DataTypes.TEXT,
                allowNull: true,
            },

            bloodGroup: {
                type: DataTypes.STRING(10),
                allowNull: true,
            },

            medicalAssistanceNeeded: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            emergencyContactName: {
                type: DataTypes.STRING(150),
                allowNull: true,
            },

            emergencyContactNumber: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
        },
        {
            tableName: "onboarding_health",
            timestamps: true,
            paranoid: true,
        }
    );

    return HealthEmergency;
};