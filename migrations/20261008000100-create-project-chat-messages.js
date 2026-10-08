"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("project_chat_messages", {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
            projectOnboardId: { type: Sequelize.INTEGER, allowNull: false },
            senderId: { type: Sequelize.INTEGER, allowNull: false },
            message: { type: Sequelize.TEXT, allowNull: false },
            mentionedUserIds: { type: Sequelize.JSON, allowNull: false, defaultValue: [] },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false },
            deletedAt: { type: Sequelize.DATE, allowNull: true }
        });
        await queryInterface.addIndex("project_chat_messages", ["projectOnboardId", "createdAt"]);
    },
    async down(queryInterface) {
        await queryInterface.dropTable("project_chat_messages");
    }
};
