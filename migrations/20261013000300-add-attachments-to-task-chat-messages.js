"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("task_chat_messages", "attachments", {
            type: Sequelize.JSON,
            allowNull: false,
            defaultValue: []
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn("task_chat_messages", "attachments");
    }
};