module.exports = (sequelize, DataTypes) => {
    const LeadSource = sequelize.define(
        "LeadSource",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true
            },
            code: {
                type: DataTypes.STRING(50),
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
            createdBy: {
                type: DataTypes.INTEGER
            },
            updatedBy: {
                type: DataTypes.INTEGER
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