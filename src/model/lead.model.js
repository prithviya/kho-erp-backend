module.exports = (sequelize, DataTypes) => {
    const Lead = sequelize.define(
        "Lead",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            companyName: {
                type: DataTypes.STRING(150),
                allowNull: false
            },
            contactPerson: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            phone: {
                type: DataTypes.STRING(20),
                allowNull: false
            },
            email: {
                type: DataTypes.STRING(100)
            },
            requirement: {
                type: DataTypes.TEXT
            },
            budget: {
                type: DataTypes.DECIMAL(12,2)
            },
            leadSourceId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            leadStatusId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            assignedTo: {
                type: DataTypes.INTEGER
            },
            referralName: {
                type: DataTypes.STRING(255)
            },
            notes: {
                type: DataTypes.TEXT
            },
            nextFollowupDate: {
                type: DataTypes.DATEONLY
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true
            }
        },
        {
            tableName: "leads",
            timestamps: true,
            paranoid: true
        }
    );
    return Lead;
};