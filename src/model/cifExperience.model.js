module.exports = (sequelize, DataTypes) => {
    const CifExperience = sequelize.define(
        "cifExperience",
        {   
            eid: {
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
            companyName: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            location:{
                type: DataTypes.STRING(100),
                allowNull: false
            },
            role: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            startDate: {
                type: DataTypes.DATEONLY,
                allowNull: false
            },
            endDate: {
                type: DataTypes.DATEONLY,   
                allowNull: true
            },
            totalExperience: {
                type: DataTypes.FLOAT,
                allowNull: false
            },
            reasonForLeaving: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
        },
        {   
            tableName: "cif_experiences",    
            timestamps: true,
            paranoid: true
        }
    );
    return CifExperience;
}