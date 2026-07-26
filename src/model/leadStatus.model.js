module.exports = (sequelize, DataTypes) => {
    const LeadStatus = sequelize.define(
        "LeadStatus",
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
            color: {
                type: DataTypes.STRING(20)
            },
            sequence: {
                type: DataTypes.INTEGER,
                defaultValue: 1
            },
            isDefault: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            isClosed: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
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
            tableName: "lead_statuses",
            timestamps: true,
            paranoid: true
        }
    );
    return LeadStatus;
};