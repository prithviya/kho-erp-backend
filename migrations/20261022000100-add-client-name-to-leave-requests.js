"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const columns = await queryInterface.describeTable("leave_requests");
        if (!columns.clientName) {
            await queryInterface.addColumn("leave_requests", "clientName", {
                type: Sequelize.STRING(200),
                allowNull: true,
            });
        }
    },

    async down(queryInterface) {
        const columns = await queryInterface.describeTable("leave_requests");
        if (columns.clientName) {
            await queryInterface.removeColumn("leave_requests", "clientName");
        }
    },
};
