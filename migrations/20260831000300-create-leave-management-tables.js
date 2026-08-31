"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("leave_categories", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            code: {
                type: Sequelize.STRING(80),
                allowNull: false,
                unique: true,
            },
            name: {
                type: Sequelize.STRING(120),
                allowNull: false,
            },
            unit: {
                type: Sequelize.ENUM("DAY", "HOUR"),
                allowNull: false,
                defaultValue: "DAY",
            },
            allocatedValue: {
                type: Sequelize.DECIMAL(8, 2),
                allowNull: false,
                defaultValue: 0,
            },
            isActive: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
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

        await queryInterface.createTable("leave_requests", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
            },
            employeeCode: {
                type: Sequelize.STRING(40),
                allowNull: true,
            },
            employeeName: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            categoryId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "leave_categories",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
            },
            fromDate: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            toDate: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            durationType: {
                type: Sequelize.ENUM("FULL_DAY", "HALF_DAY", "QUARTER_DAY", "HOURS"),
                allowNull: false,
                defaultValue: "FULL_DAY",
            },
            session: {
                type: Sequelize.ENUM("MORNING", "NOON"),
                allowNull: true,
            },
            quarterSlot: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            startTime: {
                type: Sequelize.STRING(5),
                allowNull: true,
            },
            endTime: {
                type: Sequelize.STRING(5),
                allowNull: true,
            },
            requestedDays: {
                type: Sequelize.DECIMAL(8, 2),
                allowNull: false,
                defaultValue: 0,
            },
            requestedHours: {
                type: Sequelize.DECIMAL(8, 2),
                allowNull: false,
                defaultValue: 0,
            },
            reason: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM("PENDING", "APPROVED", "REJECTED", "CANCELLED"),
                allowNull: false,
                defaultValue: "PENDING",
            },
            approverId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: "users",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL",
            },
            approverRemarks: {
                type: Sequelize.STRING(500),
                allowNull: true,
            },
            approvedAt: {
                type: Sequelize.DATE,
                allowNull: true,
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

        await queryInterface.addIndex("leave_requests", ["userId", "fromDate", "status"], {
            name: "idx_leave_requests_user_date_status",
        });

        const now = new Date();
        await queryInterface.bulkInsert("leave_categories", [
            {
                code: "CASUAL_LEAVE",
                name: "Casual Leave",
                unit: "DAY",
                allocatedValue: 12,
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                code: "LEAVE_WITHOUT_PAY",
                name: "Leave Without Pay",
                unit: "DAY",
                allocatedValue: 12,
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                code: "PERMISSION",
                name: "Permission",
                unit: "HOUR",
                allocatedValue: 16,
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                code: "ON_THE_DUTY",
                name: "On The Duty",
                unit: "DAY",
                allocatedValue: 0,
                isActive: true,
                createdAt: now,
                updatedAt: now,
            },
        ]);
    },

    async down(queryInterface) {
        await queryInterface.removeIndex("leave_requests", "idx_leave_requests_user_date_status");
        await queryInterface.dropTable("leave_requests");
        await queryInterface.dropTable("leave_categories");
    },
};
