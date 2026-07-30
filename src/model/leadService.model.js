module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        "LeadService",
        {
            leadId: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            serviceId: {
                type: DataTypes.INTEGER,
                primaryKey: true
            }
        },
        {
            tableName: "lead_services",
            timestamps: false
        }
    );
};