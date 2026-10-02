"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const columns = await queryInterface.describeTable("users");
        if (!columns.canDelete) {
            await queryInterface.addColumn("users", "canDelete", {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            });
        }
    },

    async down(queryInterface) {
        await queryInterface.removeColumn("users", "canDelete");
    },
};
