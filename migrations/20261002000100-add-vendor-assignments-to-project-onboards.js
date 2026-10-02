"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("project_onboards", "assignedVendorIds", {
            type: Sequelize.JSON,
            allowNull: false,
            defaultValue: [],
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn("project_onboards", "assignedVendorIds");
    },
};
