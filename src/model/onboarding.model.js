module.exports = (sequelize, DataTypes) => {
    const Onboarding = sequelize.define(
        "Onboarding",
        {
            onboardingid: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            candidateId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "candidateId",
                references: {
                    model: "candidates",
                    key: "id",
                },
            },
            cifid: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "cifid",
                references: {
                    model: "cif_personals",
                    key: "cifid",
                },
            },
            onboardinginfoid: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "onboardinginfoid",
                references: {
                    model: "onboarding_info",
                    key: "onboardinginfoid",
                },
            },
            jobApplicationId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                field: "jobApplicationId",
                references: {
                    model: "job_applications",
                    key: "id",
                },
            },
            status: {
                type: DataTypes.ENUM("DRAFT", "READY_FOR_VERIFICATION", "IN_PROGRESS", "COMPLETED", "REJECTED"),
                allowNull: false,
                defaultValue: "DRAFT",
            },
            officialEmail: {
                type: DataTypes.STRING(150),
                allowNull: true,
            },
            officialPhone: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            doj: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            employeeType: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            employeeRole: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            hireSource: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            departmentId: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "departments",
                    key: "id",
                },
            },
            designation: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            reportingManager: {
                type: DataTypes.STRING(150),
                allowNull: true,
            },
            photoUrl: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            uanno: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            aadharNo: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            panNo: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            salary: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            employeeCode: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
        },
        {
            tableName: "onboardings",
            timestamps: true,
            paranoid: true,
        }
    );
    return Onboarding;
};