module.exports = (sequelize, DataTypes) => {
    const Onboarding = sequelize.define(
        "Onboarding",
        {
            onboardingid: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            cifid: {    
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "cif_personals",
                    key: "cifid"
                }
            },
            onboardinginfoid: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "onboard_info",
                    key: "onboardinginfoid"
                }
            },
        },
        {
            tableName: "onboardings",
            timestamps: true,
            paranoid: true
        }
    );
    return Onboarding;
}