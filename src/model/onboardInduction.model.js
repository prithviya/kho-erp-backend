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
            },

            onboardinginfoid: {
                type: DataTypes.INTEGER,
                allowNull: false,
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