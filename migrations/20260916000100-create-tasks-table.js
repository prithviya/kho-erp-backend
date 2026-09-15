"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("tasks", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            projectOnboardId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "project_onboards",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
            },
            serviceId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "services",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            title: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            assignedToId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
            },
            reportingHeadId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "users",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            priority: {
                type: Sequelize.ENUM("LOW", "MEDIUM", "HIGH"),
                allowNull: false,
                defaultValue: "MEDIUM",
            },
            status: {
                type: Sequelize.ENUM("TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"),
                allowNull: false,
                defaultValue: "TODO",
            },
            dueDate: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            completedAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            createdBy: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "users",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            deletedAt: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });

        await queryInterface.addIndex("tasks", ["assignedToId", "status"], {
            name: "idx_tasks_assignee_status",
        });
        await queryInterface.addIndex("tasks", ["reportingHeadId"], {
            name: "idx_tasks_reporting_head",
        });
        await queryInterface.addIndex("tasks", ["projectOnboardId"], {
            name: "idx_tasks_project",
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable("tasks");
    },
};
