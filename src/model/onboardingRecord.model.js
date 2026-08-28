module.exports = (sequelize, DataTypes) => {
    const OnboardingRecord = sequelize.define(
        "onboardingRecord",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            cifid: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
                references: {
                    model: "cif_personals",
                    key: "cifid",
                },
            },
            status: {
                type: DataTypes.ENUM("DRAFT", "FINAL"),
                allowNull: false,
                defaultValue: "DRAFT",
            },
            experienceDetails: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: [],
            },
            educationDetails: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: [],
            }
        },
        {
            tableName: "onboarding_records",
            timestamps: true,
            paranoid: true,
        }
    );

    return OnboardingRecord;
};