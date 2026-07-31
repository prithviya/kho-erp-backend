module.exports = (sequelize, DataTypes) => {
    const ProjectOnboard = sequelize.define(
        "ProjectOnboard",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            leadId: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            projectName: {
                type: DataTypes.STRING(200),
                allowNull: false
            },
            companyName: {
                type: DataTypes.STRING(200),
                allowNull: false
            },
            projectManagerIds: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: []
            },
            spocIds: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: []
            },
            serviceIds: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: []
            },
            serviceDetails: {
                type: DataTypes.JSON,
                allowNull: true,
                defaultValue: {}
            },
            assignedToIds: {
                type: DataTypes.JSON,
                allowNull: false,
                defaultValue: []
            },
            reportingHeadId: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            status: {
                type: DataTypes.STRING(50),
                allowNull: false,
                defaultValue: "Pending"
            },
            createdBy: {
                type: DataTypes.INTEGER,
                allowNull: true
            }
        },
        {
            tableName: "project_onboards",
            timestamps: true,
            paranoid: true
        }
    );

    return ProjectOnboard;
};