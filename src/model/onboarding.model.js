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
                    model: "cifPersonals",
                    key: "cifid"
                }
            },
            onboardinginfoid: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "onboardinfo",
                    key: "onboardinfoid"
                }
            },
            hid: {
                type: DataTypes.INTEGER,
                allowNull:  false,
                references: {
                    model: "onboardingHealth",
                    key: "hid"
                }
            },
            did: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "onboardingDocuments",
                    key: "did"
                }
            },
            otid: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "officeTours",
                    key: "otid"
                }
            },
            iid:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "onboardInduction",
                    key:"iid"
                }
            },
            eqid:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Equipment",
                    key: "eqid"
                }
            }

        },
        {
            tableName: "onboardings",
            timestamps: true,
            paranoid: true
        }
    );
    return Onboarding;
}