"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const table = await queryInterface.describeTable("onboarding_records");

        if (!table.formData) {
            await queryInterface.addColumn("onboarding_records", "formData", {
                type: Sequelize.JSON,
                allowNull: false,
                defaultValue: {},
            });
        }
    },

    async down(queryInterface) {
        const table = await queryInterface.describeTable("onboarding_records");

        if (table.formData) {
            await queryInterface.removeColumn("onboarding_records", "formData");
        }
    },
};
