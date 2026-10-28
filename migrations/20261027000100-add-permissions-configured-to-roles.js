"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const columns = await queryInterface.describeTable("roles");
        if (!columns.permissionsConfigured) {
            await queryInterface.addColumn("roles", "permissionsConfigured", {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: false,
            });
        }
    },

    async down(queryInterface) {
        const columns = await queryInterface.describeTable("roles");
        if (columns.permissionsConfigured) {
            await queryInterface.removeColumn("roles", "permissionsConfigured");
        }
    },
};
