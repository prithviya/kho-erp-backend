"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("lead_history", "oldFollowupDate", {
            type: Sequelize.DATEONLY,
            allowNull: true,
        });
        await queryInterface.addColumn("lead_history", "newFollowupDate", {
            type: Sequelize.DATEONLY,
            allowNull: true,
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn("lead_history", "newFollowupDate");
        await queryInterface.removeColumn("lead_history", "oldFollowupDate");
    },
};