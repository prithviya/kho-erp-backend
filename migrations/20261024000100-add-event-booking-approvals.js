"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const applicationColumns = await queryInterface.describeTable("event_applications");
        for (const field of ["reportingHeadId", "managerId"]) {
            if (applicationColumns[field]) continue;
            await queryInterface.addColumn("event_applications", field, {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: { model: "users", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            });
        }

        const tables = await queryInterface.showAllTables();
        const hasReviewTable = tables.some((table) => (
            String(typeof table === "object" ? table.tableName || table.name : table)
                .toLowerCase() === "event_application_reviews"
        ));
        if (!hasReviewTable) {
            await queryInterface.createTable("event_application_reviews", {
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                    allowNull: false,
                },
                eventApplicationId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: { model: "event_applications", key: "id" },
                    onUpdate: "CASCADE",
                    onDelete: "CASCADE",
                },
                reviewerRole: {
                    type: Sequelize.ENUM("REPORTING_HEAD", "MANAGER", "HR"),
                    allowNull: false,
                },
                assignedReviewerId: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    references: { model: "users", key: "id" },
                    onUpdate: "CASCADE",
                    onDelete: "SET NULL",
                },
                actionBy: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    references: { model: "users", key: "id" },
                    onUpdate: "CASCADE",
                    onDelete: "SET NULL",
                },
                status: {
                    type: Sequelize.ENUM("PENDING", "APPROVED", "REJECTED"),
                    allowNull: false,
                    defaultValue: "PENDING",
                },
                remarks: {
                    type: Sequelize.TEXT,
                    allowNull: true,
                },
                reviewedAt: {
                    type: Sequelize.DATE,
                    allowNull: true,
                },
                reminderSentAt: {
                    type: Sequelize.DATE,
                    allowNull: true,
                },
                createdAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                },
                updatedAt: {
                    type: Sequelize.DATE,
                    allowNull: false,
                    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
                },
            });
        }

        const indexes = await queryInterface.showIndex("event_application_reviews");
        if (!indexes.some((index) => index.fields?.map((field) => field.attribute || field.name).join(",") === "eventApplicationId,reviewerRole")) {
            await queryInterface.addIndex("event_application_reviews", ["eventApplicationId", "reviewerRole"], {
                unique: true,
                name: "event_application_reviews_role_unique",
            });
        }
        if (!indexes.some((index) => index.fields?.map((field) => field.attribute || field.name).join(",") === "assignedReviewerId,status")) {
            await queryInterface.addIndex("event_application_reviews", ["assignedReviewerId", "status"], {
                name: "event_application_reviews_assignee_status",
            });
        }
    },

    async down(queryInterface) {
        await queryInterface.dropTable("event_application_reviews");
        await queryInterface.removeColumn("event_applications", "managerId");
        await queryInterface.removeColumn("event_applications", "reportingHeadId");
    },
};
