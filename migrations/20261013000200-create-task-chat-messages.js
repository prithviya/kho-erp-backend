"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("task_chat_messages", {
            id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
            taskId: { type: Sequelize.INTEGER, allowNull: false },
            senderId: { type: Sequelize.INTEGER, allowNull: false },
            message: { type: Sequelize.TEXT, allowNull: false },
            mentionedUserIds: { type: Sequelize.JSON, allowNull: false },
            createdAt: { type: Sequelize.DATE, allowNull: false },
            updatedAt: { type: Sequelize.DATE, allowNull: false },
            deletedAt: { type: Sequelize.DATE, allowNull: true }
        });

        await queryInterface.addIndex("task_chat_messages", ["taskId", "createdAt"], {
            name: "idx_task_chat_messages_task_created"
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("task_chat_messages");
    }
};
