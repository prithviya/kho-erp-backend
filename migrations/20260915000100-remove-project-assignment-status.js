"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const projectColumns = await queryInterface.describeTable("project_onboards");
        const assignmentColumns = await queryInterface.describeTable("project_assignments");

        if (projectColumns.status) await queryInterface.removeColumn("project_onboards", "status");
        if (assignmentColumns.status) await queryInterface.removeColumn("project_assignments", "status");
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeConstraint(
            "project_assignments",
            "project_assignments_assignedToId_employees_fk"
        );
        await queryInterface.addConstraint("project_assignments", {
            fields: ["assignedToId"],
            type: "foreign key",
            name: "project_assignments_assignedToId_users_fk",
            references: {
                table: "users",
                field: "id"
            },
            onUpdate: "CASCADE"
        });
        await queryInterface.addColumn("project_onboards", "status", {
            type: Sequelize.STRING(50),
            allowNull: false,
            defaultValue: "Pending"
        });
        await queryInterface.addColumn("project_assignments", "status", {
            type: Sequelize.STRING(50),
            allowNull: false,
            defaultValue: "In Progress"
        });
    }
};
