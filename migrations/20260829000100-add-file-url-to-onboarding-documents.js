"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const table = await queryInterface.describeTable("onboarding_documents");

        if (!table.file_url) {
            await queryInterface.addColumn("onboarding_documents", "file_url", {
                type: Sequelize.STRING(512),
                allowNull: true,
            });
        }
    },

    async down(queryInterface) {
        const table = await queryInterface.describeTable("onboarding_documents");

        if (table.file_url) {
            await queryInterface.removeColumn("onboarding_documents", "file_url");
        }
    },
};
