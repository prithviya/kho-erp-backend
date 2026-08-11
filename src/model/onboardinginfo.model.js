const { allow } = require("joi");

module.exports= (sequelize, DataTypes) => {
    const OnboardingInfo = sequelize.define(
        "OnboardingInfo",
        {
            onboardinginfoid: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            officialemail: {    
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            officialphone: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
           doj: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            emptype: { 
                type: DataTypes.ENUM("Trainee", "Permanent"), 
                allowNull: false, 
            }, 
            erprole: { 
                type: DataTypes.ENUM("Admin", "Superadmin", "Manager", "Team Member"), 
                allowNull: false, 
            },
            hiresource:{
                type: DataTypes.ENUM("Website", "Direct","Referal"),
                 allowNull: false,
            },
            department: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Departments",
                    key: "id",
                },
            },

            designation: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },

            reportHead: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            photo: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            uanno: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            aadharno:{
                type: DataTypes.INTEGER,
                allowNull: false,            
            },
            panno:{
                type: DataTypes.STRING(50),
                allowNull: false,   
            },
            salary:{
                type: DataTypes.INTEGER,
                allowNull: false, 
            },
            eid: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model:  "cif_experience",
                    key: "eid"
                }
            },
            academicid: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "cif_academic",
                    key: "cifAcademic"
                }       
            },
            
        },
        {
            tablename: "onboard_info",
            timestamps: true,
            paranoid: true
        }
    );
    return OnboardingInfo;
};