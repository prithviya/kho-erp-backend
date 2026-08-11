module.exports = (sequelize, DataTypes) => {
    const Induction = sequelize.define(
        "Induction",
        {
            iid: {
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

            companyIntroduction: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            hrPolicies: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            attendanceRules: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            leavePolicy: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            securityGuidelines: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },

            teamIntroduction: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        {
            tableName: "inductions",
            timestamps: true,
            paranoid: true,
        }
    );

    return Induction;
};