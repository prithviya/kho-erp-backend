module.exports = (sequelize, DataTypes) => {
    const OnboardingExperience = sequelize.define(
        "OnboardingExperience",
        {
            oexid: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            cifid: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            company: {
                type: DataTypes.STRING(200),
                allowNull: true,
            },
            designation: {
                type: DataTypes.STRING(150),
                allowNull: true,
            },
            startDate: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            endDate: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            totalExp: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            reason: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            tableName: "onboarding_experience_details",
            timestamps: true,
            paranoid: true,
        }
    );

    return OnboardingExperience;
};