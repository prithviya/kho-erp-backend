"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.removeColumn("project_onboards", "status");
        await queryInterface.removeColumn("project_assignments", "status");

        const foreignKeys = await queryInterface.getForeignKeyReferencesForTable("project_assignments");
        const assignedToForeignKey = foreignKeys.find((foreignKey) => (
            foreignKey.columnName === "assignedToId"
        ));

        if (assignedToForeignKey) {
            await queryInterface.removeConstraint(
                "project_assignments",
                assignedToForeignKey.constraintName
            );
        }

        await queryInterface.addConstraint("project_assignments", {
            fields: ["assignedToId"],
            type: "foreign key",
            name: "project_assignments_assignedToId_employees_fk",
            references: {
                table: "employees",
                field: "id"
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT"
        });
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
