module.exports = (sequelize, DataTypes) => {
    const OnboardingDocument = sequelize.define(
        "OnboardingDocument",
        {
            did: {
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

            documentType: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },

            fileName: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            fileUrl: {
                type: DataTypes.STRING(512),
                allowNull: true,
                field: "file_url",
            },
            bid: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "onboarding_banks",
                    key: "bid"
                }
            }
        },
        {
            tableName: "onboarding_documents",
            timestamps: true,
            paranoid: true,
        }
    );

    return OnboardingDocument;
};