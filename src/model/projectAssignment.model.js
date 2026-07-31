module.exports = (sequelize, DataTypes) => {
    const ProjectAssignment = sequelize.define(
        "ProjectAssignment",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            projectOnboardId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            assignedToId: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            reportingHeadId: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            status: {
                type: DataTypes.STRING(50),
                allowNull: false,
                defaultValue: "In Progress"
            },
            assignedBy: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            assignedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        },
        {
            tableName: "project_assignments",
            timestamps: true,
            paranoid: true
        }
    );

    return ProjectAssignment;
};