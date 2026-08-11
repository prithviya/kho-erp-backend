module.exports = (sequelize, DataTypes) => {
    const OnboardingBank = sequelize.define(
        "OnboardingBank",
        {
            bid: {
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
                    key: "onboardinfoid",
                },
            },

            accountHolderName: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },

            accountNumber: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },

            ifscCode: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },

            bankName: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },

            branchName: {
                type: DataTypes.STRING(150),
                allowNull: true,
            },
        },
        {
            tableName: "onboarding_banks",
            timestamps: true,
            paranoid: true,
        }
    );

    return OnboardingBank;
};