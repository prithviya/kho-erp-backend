"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        // Skip when the column is already AUTO_INCREMENT (schema created via sync).
        const [[idColumn]] = await queryInterface.sequelize.query(
            "SHOW COLUMNS FROM `project_onboards` LIKE 'id';"
        );
        if (String(idColumn?.Extra || "").toLowerCase().includes("auto_increment")) {
            return;
        }

        // The FK on projectOnboardId may carry any auto-generated name; look it up.
        const [[fk]] = await queryInterface.sequelize.query(
            "SELECT CONSTRAINT_NAME AS name FROM information_schema.KEY_COLUMN_USAGE " +
            "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'project_assignments' " +
            "AND COLUMN_NAME = 'projectOnboardId' AND REFERENCED_TABLE_NAME = 'project_onboards' LIMIT 1;"
        );
        const fkName = fk?.name || "project_assignments_ibfk_21";

        await queryInterface.sequelize.query(
            `ALTER TABLE \`project_assignments\` DROP FOREIGN KEY \`${fkName}\`;`
        );
        await queryInterface.sequelize.query(
            "ALTER TABLE `project_onboards` MODIFY COLUMN `id` INT NOT NULL AUTO_INCREMENT;"
        );
        await queryInterface.sequelize.query(
            `ALTER TABLE \`project_assignments\` ADD CONSTRAINT \`${fkName}\` FOREIGN KEY (\`projectOnboardId\`) REFERENCES \`project_onboards\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;`
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
