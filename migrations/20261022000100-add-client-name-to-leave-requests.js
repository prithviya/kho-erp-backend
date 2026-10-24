"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("leave_requests", "clientName", {
            type: Sequelize.STRING(200),
            allowNull: true,
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn("leave_requests", "clientName");
    },
};
