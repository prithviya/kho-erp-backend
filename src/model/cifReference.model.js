module.exports = (sequelize, DataTypes) => {
    const CifReference = sequelize.define(
        "CifReference",
        {
            referenceid: {
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
            referenceName: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            referenceEmail: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            referencePhone: {   
                type: DataTypes.STRING(15),
                allowNull: false
            },
            consentConfirmed: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        },
        {
            tableName: "cif_references",
            timestamps: true,
            paranoid: true
        }
    );
    return CifReference;
}