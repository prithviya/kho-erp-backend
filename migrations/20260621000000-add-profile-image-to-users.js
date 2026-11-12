"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const columns = await queryInterface.describeTable("users");
        if (!columns.profileImage) {
            await queryInterface.addColumn("users", "profileImage", {
                type: Sequelize.STRING(512),
                allowNull: true,
            });
        }
    },

    async down(queryInterface) {
        const columns = await queryInterface.describeTable("users");
        if (columns.profileImage) {
            await queryInterface.removeColumn("users", "profileImage");
        }
    },
};
