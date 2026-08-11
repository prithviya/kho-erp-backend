const { ta } = require("zod/locales")

module.exports = (sequelize, DataTypes) => {
    const CifSkill = sequelize.define(
        "cifSkill",
        {
            skillid: {
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
            skillName: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            skillLevel: {
                type: DataTypes.ENUM("Beginner", "Intermediate", "Advanced", "Expert"),
                allowNull: false
            },
            year:{
                type: DataTypes.DATE,
                allowNull: false
            },
            provider: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
        },
        {
            tableName: "cif_skills",
            timestamps: true,
            paranoid: true
        }
    );
    return CifSkill;
}