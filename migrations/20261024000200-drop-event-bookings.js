"use strict";

module.exports = {
    async up(queryInterface) {
        const tables = await queryInterface.showAllTables();
        const existingTables = new Set(tables.map((table) => (
            String(typeof table === "object" ? table.tableName || table.name : table).toLowerCase()
        )));

        for (const table of ["event_application_reviews", "event_applications", "event_schedules"]) {
            if (existingTables.has(table)) {
                await queryInterface.dropTable(table);
            }
        }
    },

    async down() {
        throw new Error("Event booking tables were permanently dropped; this migration cannot restore deleted data.");
    },
};
