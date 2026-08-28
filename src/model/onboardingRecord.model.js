module.exports = (sequelize, DataTypes) => {
    const OnboardingRecord = sequelize.define(
        "OnboardingRecord",
        {
            onboardingrecordid: {
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
            formData: {
                type: DataTypes.JSON,
                allowNull: false,
            },
        },
        {
            tableName: "onboarding_records",
            timestamps: true,
        }
    );

    return OnboardingRecord;
};
