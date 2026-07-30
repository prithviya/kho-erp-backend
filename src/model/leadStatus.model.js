module.exports = (sequelize, DataTypes) => {
    const LeadStatus = sequelize.define(
        "LeadStatus",
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
            color: {
                type: DataTypes.STRING(30)
            },
            description: {
                type: DataTypes.STRING(255)
            },
            isDefault: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            isClosed: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            displayOrder: {
                type: DataTypes.INTEGER,
                defaultValue: 1
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            }
        },
        {
            tableName: "lead_statuses",
            timestamps: true,
            paranoid: true
        }
    );
    return LeadStatus;
};