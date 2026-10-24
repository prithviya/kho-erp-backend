"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        const tables = await queryInterface.showAllTables();
        const existingTables = new Set(tables.map((table) => (
            String(typeof table === "object" ? table.tableName || table.name : table).toLowerCase()
        )));
        if (existingTables.has("event_schedules") && existingTables.has("event_applications")) return;

        await queryInterface.createTable("event_schedules", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            eventName: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            clientName: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },
            eventDate: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM("OPEN", "CLOSED", "CANCELLED"),
                allowNull: false,
                defaultValue: "OPEN",
            },
            createdBy: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "users", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
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

        await queryInterface.createTable("event_applications", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            eventScheduleId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "event_schedules", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: "users", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
            },
            departmentId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: { model: "departments", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            designatedApproverId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: { model: "users", key: "id" },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            status: {
                type: Sequelize.ENUM("PENDING", "APPROVED", "REJECTED", "CANCELLED"),
                allowNull: false,
                defaultValue: "PENDING",
            },
            message: {
                type: Sequelize.TEXT,
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

        await queryInterface.addIndex("event_applications", ["eventScheduleId", "userId"], {
            unique: true,
            name: "event_applications_schedule_user_unique",
        });
        await queryInterface.addIndex("event_applications", ["userId"], {
            name: "event_applications_user_id",
        });
        await queryInterface.addIndex("event_applications", ["designatedApproverId"], {
            name: "event_applications_designated_approver_id",
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("event_applications");
        await queryInterface.dropTable("event_schedules");
    },
};
