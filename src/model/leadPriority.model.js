module.exports = (sequelize, DataTypes) => {
    const LeadPriority = sequelize.define(
        "LeadPriority",
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
            tableName: "lead_priorities",
            timestamps: true,
            paranoid: true
        }
    );
    return LeadPriority;
};