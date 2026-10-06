"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn("tasks", "assignedToId", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
        await queryInterface.addColumn("tasks", "assignedVendorId", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("tasks", "assignedVendorId");
        await queryInterface.changeColumn("tasks", "assignedToId", {
            type: Sequelize.INTEGER,
            allowNull: false,
        });
    },
};
