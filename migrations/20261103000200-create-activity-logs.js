"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("activity_logs", {
            id: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true, allowNull: false },
            actorId: { type: Sequelize.INTEGER, allowNull: true },
            actorName: { type: Sequelize.STRING(255), allowNull: false, defaultValue: "System" },
            projectId: { type: Sequelize.INTEGER, allowNull: true },
            projectName: { type: Sequelize.STRING(255), allowNull: true },
            module: { type: Sequelize.STRING(64), allowNull: false },
            action: { type: Sequelize.STRING(32), allowNull: false },
            entityType: { type: Sequelize.STRING(64), allowNull: true },
            entityId: { type: Sequelize.STRING(64), allowNull: true },
            description: { type: Sequelize.STRING(500), allowNull: false },
            method: { type: Sequelize.STRING(10), allowNull: true },
            route: { type: Sequelize.STRING(255), allowNull: true },
            statusCode: { type: Sequelize.INTEGER, allowNull: true },
            ipAddress: { type: Sequelize.STRING(64), allowNull: true },
            metadata: { type: Sequelize.JSON, allowNull: true },
            createdAt: { type: Sequelize.DATE, allowNull: false }
        });
        await queryInterface.addIndex("activity_logs", ["createdAt"], { name: "activity_logs_created_at" });
        await queryInterface.addIndex("activity_logs", ["projectId", "createdAt"], { name: "activity_logs_project_created" });
        await queryInterface.addIndex("activity_logs", ["actorId", "createdAt"], { name: "activity_logs_actor_created" });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("activity_logs");
    }
};
