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
            },

            onboardinginfoid: {
                type: DataTypes.INTEGER,
                allowNull: false,
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