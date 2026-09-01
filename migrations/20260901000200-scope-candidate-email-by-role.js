"use strict";

module.exports = {
    async up(queryInterface) {
        await queryInterface.removeIndex("candidates", "email");
        await queryInterface.addIndex("candidates", ["email", "appliedPosition"], {
            unique: true,
            name: "candidates_email_applied_position_unique",
        });
    },

    async down(queryInterface) {
        await queryInterface.removeIndex("candidates", "candidates_email_applied_position_unique");
        await queryInterface.addIndex("candidates", ["email"], {
            unique: true,
            name: "email",
        });
    },
};
