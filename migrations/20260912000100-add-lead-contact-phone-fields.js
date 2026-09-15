"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const columns = await queryInterface.describeTable("leads");

        if (!columns.salutation) {
            await queryInterface.addColumn("leads", "salutation", {
                type: Sequelize.STRING(10),
                allowNull: true,
            });
        }

        if (!columns.phoneCountryCode) {
            await queryInterface.addColumn("leads", "phoneCountryCode", {
                type: Sequelize.STRING(8),
                allowNull: true,
            });
        }
    },

    async down(queryInterface) {
        await queryInterface.removeColumn("leads", "phoneCountryCode");
        await queryInterface.removeColumn("leads", "salutation");
    },
};