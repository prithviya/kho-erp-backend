"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("notifications", {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
            userId: { type: Sequelize.INTEGER, allowNull: false },
            type: { type: Sequelize.STRING(50), allowNull: false, defaultValue: "PROJECT_MENTION" },
            projectOnboardId: { type: Sequelize.INTEGER, allowNull: true },
            message: { type: Sequelize.TEXT, allowNull: false },
            metadata: { type: Sequelize.JSON, allowNull: false },
            readAt: { type: Sequelize.DATE, allowNull: true },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false }
        });

        await queryInterface.addIndex("notifications", ["userId", "readAt"], {
            name: "idx_notifications_user_unread"
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("notifications");
    }
};
