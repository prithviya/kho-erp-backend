module.exports = (sequelize, DataTypes) => {
    const LeadSource = sequelize.define(
        "LeadSource",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true
            },
            code: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true
            },
            description: {
                type: DataTypes.STRING(255)
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            },
            displayOrder: {
                type: DataTypes.INTEGER,
                defaultValue: 1
            }
        },
        {
            tableName: "lead_sources",
            timestamps: true,
            paranoid: true
        }
    );
    return LeadSource;
};