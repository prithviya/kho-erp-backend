module.exports = (sequelize, DataTypes) => {
    const CifPersonal = sequelize.define(
        "cifPersonal",
        {
            cifid: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            fullName: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true   
                }
            },
            phoneNumber: {
                type: DataTypes.STRING(15),
                allowNull: false,  
            },
            DOB: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            address:{
                type: DataTypes.STRING(255),
                allowNull: false
            },
            city: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            state: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            pinCode: {
                type: DataTypes.STRING(10),
                allowNull: false
            },
            gender: {
                type: DataTypes.ENUM("Male", "Female"),
                allowNull: false
            },
            maritalStatus: {    
                type: DataTypes.ENUM("Single", "Married"),
                allowNull: false
            },
            portfolioLink: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            resume: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            appiledPosition: {
                type: DataTypes.STRING(100),
                allowNull: false,
                references: {
                    model: "Openings",
                    key: "jobid"
                }
            }
        },
        {
            tableName: "cif_personals",
            timestamps: true,
            paranoid: true
        }
    );  
    return CifPersonal;
};