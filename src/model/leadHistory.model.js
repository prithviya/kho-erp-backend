module.exports = (sequelize, DataTypes) => {
    const LeadHistory = sequelize.define(
        "LeadHistory",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            leadId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            oldStatusId: {
                type: DataTypes.INTEGER
            },
            newStatusId: {
                type: DataTypes.INTEGER
            },
            oldFollowupDate: {
                type: DataTypes.DATEONLY
            },
            newFollowupDate: {
                type: DataTypes.DATEONLY
            },
            notes: {
                type: DataTypes.TEXT
            },
            changedBy: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            tableName: "lead_history",
            timestamps: true,
            updatedAt: false
        }
    );
    return LeadHistory;
};