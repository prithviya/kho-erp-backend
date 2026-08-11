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
                    key: "onboardinfoid"
                }
            },
            hid: {
                type: DataTypes.INTEGER,
                allowNull:  false,
                references: {
                    model: "onboarding_health",
                    key: "hid"
                }
            },
            did: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "onboarding_documents",
                    key: "did"
                }
            },
            otid: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "office_tours",
                    key: "otid"
                }
            },
            iid:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "inductions",
                    key:"iid"
                }
            },
            eqid:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "onboarding_equipments",
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