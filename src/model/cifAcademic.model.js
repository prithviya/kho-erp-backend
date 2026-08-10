module.exports = (sequelize, DataTypes) => {
    const cifAcademic = sequelize.define(
        "cifAcademic",
        {
            academicid: {
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
            degree: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            university: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            graduationYear: {
                type: DataTypes.INTEGER,
                allowNull: false   
            },
            grade: {
                type: DataTypes.STRING(10),
                allowNull: false
            },
            city: { 
                type: DataTypes.STRING(100),
                allowNull: false
            },
        },
        {   
            tableName: "cifAcademics",
            timestamps: true,
            paranoid: true
        }
    );
    return cifAcademic;
};