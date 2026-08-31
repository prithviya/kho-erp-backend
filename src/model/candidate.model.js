module.exports = (sequelize, DataTypes) => {
    const Candidate = sequelize.define(
        "Candidate",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            fullName: {
                type: DataTypes.STRING(150),
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING(150),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            phoneNumber: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            dob: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            DOB: {
                type: DataTypes.DATEONLY,
                allowNull: true,
                field: "dob",
            },
            gender: {
                type: DataTypes.ENUM("Male", "Female", "Other"),
                allowNull: true,
            },
            maritalStatus: {
                type: DataTypes.ENUM("Single", "Married", "Divorced", "Widowed"),
                allowNull: true,
            },
            currentAddress: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            address: {
                type: DataTypes.STRING(255),
                allowNull: true,
                field: "currentAddress",
            },
            currentCity: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            city: {
                type: DataTypes.STRING(100),
                allowNull: true,
                field: "currentCity",
            },
            currentState: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            state: {
                type: DataTypes.STRING(100),
                allowNull: true,
                field: "currentState",
            },
            currentPincode: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            pinCode: {
                type: DataTypes.STRING(20),
                allowNull: true,
                field: "currentPincode",
            },
            permanentAddress: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            permanentCity: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            permanentState: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            permanentPincode: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            portfolioLink: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            resumeUrl: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            appliedPosition: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: "openings",
                    key: "jobid",
                },
            },
        },
        {
            tableName: "candidates",
            timestamps: true,
            paranoid: true,
        }
    );

    return Candidate;
};
