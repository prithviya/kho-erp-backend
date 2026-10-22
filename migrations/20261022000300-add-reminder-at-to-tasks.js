"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("tasks", "reminderAt", {
            type: Sequelize.DATE,
            allowNull: true
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn("tasks", "reminderAt");
    }
};
