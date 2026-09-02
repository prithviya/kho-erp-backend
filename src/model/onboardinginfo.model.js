module.exports = (sequelize, DataTypes) => {
    const OnboardingInfo = sequelize.define(
        "OnboardingInfo",
        {
            onboardinginfoid: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            cifid: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            officialemail: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            officialphone: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            doj: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            emptype: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            erprole: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            hiresource: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            department: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            designation: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            reportHead: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            uanno: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            aadharno: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            panno: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            salary: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            eid: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            academicid: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            employeeId: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
            firstName: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            lastName: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            nickName: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            personalEmail: {
                type: DataTypes.STRING(150),
                allowNull: true,
            },
            personalPhone: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
            gender: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            maritalStatus: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            dateOfBirth: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            manager: {
                type: DataTypes.STRING(120),
                allowNull: true,
            },
            referral: {
                type: DataTypes.STRING(120),
                allowNull: true,
            },
            permanent: {
                type: DataTypes.STRING(120),
                allowNull: true,
            },
            systemAdmin: {
                type: DataTypes.STRING(120),
                allowNull: true,
            },
            superAdmin: {
                type: DataTypes.STRING(120),
                allowNull: true,
            },
            currentAddressLine1: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            currentAddressLine2: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            currentCity: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            currentState: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            currentPincode: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            permanentAddressLine1: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            permanentAddressLine2: {
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
            favoriteCake: {
                type: DataTypes.STRING(120),
                allowNull: true,
            },
            favoriteColor: {
                type: DataTypes.STRING(120),
                allowNull: true,
            },
            favoriteSong: {
                type: DataTypes.STRING(120),
                allowNull: true,
            },
            favoriteMovie: {
                type: DataTypes.STRING(120),
                allowNull: true,
            },
            favoriteFood: {
                type: DataTypes.STRING(120),
                allowNull: true,
            },
            favoriteActor: {
                type: DataTypes.STRING(120),
                allowNull: true,
            },
            dreamVacation: {
                type: DataTypes.STRING(120),
                allowNull: true,
            },
            weekendActivity: {
                type: DataTypes.STRING(120),
                allowNull: true,
            },
            coffeeOrTea: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            favoriteSports: {
                type: DataTypes.STRING(120),
                allowNull: true,
            },
        },
        {
            tableName: "onboarding_info",
            timestamps: true,
            paranoid: true,
        }
    );

    return OnboardingInfo;
};