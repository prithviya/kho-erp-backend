"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const columns = await queryInterface.describeTable("tasks");
        if (!columns.sortOrder) {
            await queryInterface.addColumn("tasks", "sortOrder", {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0
            });
        }
    },

    async down(queryInterface) {
        const columns = await queryInterface.describeTable("tasks");
        if (columns.sortOrder) {
            await queryInterface.removeColumn("tasks", "sortOrder");
        }
    }
};
