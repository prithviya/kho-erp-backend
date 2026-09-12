"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("leads", "salutation", {
            type: Sequelize.STRING(10),
            allowNull: true,
        });

        await queryInterface.addColumn("leads", "phoneCountryCode", {
            type: Sequelize.STRING(8),
            allowNull: true,
        });
    },

    async down(queryInterface) {
        await queryInterface.removeColumn("leads", "phoneCountryCode");
        await queryInterface.removeColumn("leads", "salutation");
    },
};