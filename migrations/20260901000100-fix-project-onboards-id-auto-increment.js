"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(
            "ALTER TABLE `project_assignments` DROP FOREIGN KEY `project_assignments_ibfk_21`;"
        );
        await queryInterface.sequelize.query(
            "ALTER TABLE `project_onboards` MODIFY COLUMN `id` INT NOT NULL AUTO_INCREMENT;"
        );
        await queryInterface.sequelize.query(
            "ALTER TABLE `project_assignments` ADD CONSTRAINT `project_assignments_ibfk_21` FOREIGN KEY (`projectOnboardId`) REFERENCES `project_onboards` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;"
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.query(
            "ALTER TABLE `project_assignments` DROP FOREIGN KEY `project_assignments_ibfk_21`;"
        );
        await queryInterface.sequelize.query(
            "ALTER TABLE `project_onboards` MODIFY COLUMN `id` INT NOT NULL;"
        );
        await queryInterface.sequelize.query(
            "ALTER TABLE `project_assignments` ADD CONSTRAINT `project_assignments_ibfk_21` FOREIGN KEY (`projectOnboardId`) REFERENCES `project_onboards` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;"
        );
    },
};
