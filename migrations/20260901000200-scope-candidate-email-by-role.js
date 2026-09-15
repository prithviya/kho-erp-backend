"use strict";

module.exports = {
    async up(queryInterface) {
        const indexes = await queryInterface.showIndex("candidates");
        const indexNames = new Set(indexes.map((index) => index.name));

        if (indexNames.has("email")) {
            await queryInterface.removeIndex("candidates", "email");
        }
        if (!indexNames.has("candidates_email_applied_position_unique")) {
            await queryInterface.addIndex("candidates", ["email", "appliedPosition"], {
                unique: true,
                name: "candidates_email_applied_position_unique",
            });
        }
    },

    async down(queryInterface) {
        await queryInterface.removeIndex("candidates", "candidates_email_applied_position_unique");
        await queryInterface.addIndex("candidates", ["email"], {
            unique: true,
            name: "email",
        });
    },
};
