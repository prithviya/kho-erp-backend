"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const columns = await queryInterface.describeTable("leave_requests");
        if (!columns.designatedApproverId) {
            await queryInterface.addColumn("leave_requests", "designatedApproverId", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
    },

    async down(queryInterface) {
        const columns = await queryInterface.describeTable("leave_requests");
        if (columns.designatedApproverId) {
            await queryInterface.removeColumn("leave_requests", "designatedApproverId");
        }
    },
};