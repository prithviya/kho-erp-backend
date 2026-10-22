"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("task_activities", {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
            taskId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "tasks", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE"
            },
            actorId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: { model: "users", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "SET NULL"
            },
            actorName: { type: Sequelize.STRING(255), allowNull: false },
            action: { type: Sequelize.STRING(32), allowNull: false },
            previousValue: { type: Sequelize.STRING(255), allowNull: true },
            newValue: { type: Sequelize.STRING(255), allowNull: false },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false }
        });

        await queryInterface.addIndex("task_activities", ["taskId", "createdAt"], {
            name: "idx_task_activities_task_created"
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("task_activities");
    }
};
