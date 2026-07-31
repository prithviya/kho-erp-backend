module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "Employee",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            employeeCode: {
                type: DataTypes.STRING(30),
                allowNull: false,
                unique: true
            },
            jobPosition: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            fullName: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true
            },
            phone: {
                type: DataTypes.STRING(30),
                allowNull: false
            },
            dateOfBirth: {
                type: DataTypes.DATEONLY,
                allowNull: true
            },
            city: {
                type: DataTypes.STRING(120),
                allowNull: true
            },
            pinCode: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            gender: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            portfolioLink: {
                type: DataTypes.STRING(500),
                allowNull: true
            },
            resumeOriginalName: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            resumeStoredName: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            resumeMimeType: {
                type: DataTypes.STRING(120),
                allowNull: true
            },
            resumeSize: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            education: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: []
            },
            workExperience: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: []
            },
            skills: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: []
            },
            softwareTools: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: []
            },
            languages: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: []
            },
            references: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: []
            },
            consent: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            status: {
                type: DataTypes.STRING(50),
                allowNull: false,
                defaultValue: "Onboarding"
            },
            createdBy: {
                type: DataTypes.INTEGER,
                allowNull: true
            }
        },
        {
            tableName: "employees",
            timestamps: true,
            paranoid: true
        }
    );
};