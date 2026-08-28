module.exports = (sequelize, DataTypes) => {
    const OnboardingEducation = sequelize.define(
        "OnboardingEducation",
        {
            oeid: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            cifid: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "onboarding_records",
                    key: "cifid",
                },
            },
            qualification: {
                type: DataTypes.STRING(150),
                allowNull: true,
            },
            institution: {
                type: DataTypes.STRING(200),
                allowNull: true,
            },
            board: {
                type: DataTypes.STRING(200),
                allowNull: true,
            },
            year: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            percentage: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
        },
        {
            tableName: "onboarding_education_details",
            timestamps: true,
            paranoid: true,
        }
    );

    return OnboardingEducation;
};
