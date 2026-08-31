"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("payrolls", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            employeeId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "employees",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "RESTRICT",
            },
            month: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            year: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            grossSalary: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false,
                defaultValue: 0,
            },
            lopDays: {
                type: Sequelize.DECIMAL(8, 2),
                allowNull: false,
                defaultValue: 0,
            },
            workingDays: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 30,
            },
            netSalary: {
                type: Sequelize.DECIMAL(12, 2),
                allowNull: false,
                defaultValue: 0,
            },
            status: {
                type: Sequelize.STRING(30),
                allowNull: false,
                defaultValue: "Draft",
            },
            paidAt: {
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

        await queryInterface.addIndex("payrolls", ["employeeId", "month", "year"], {
            name: "uniq_payroll_employee_month_year",
            unique: true,
        });

        await queryInterface.addIndex("payrolls", ["year", "month"], {
            name: "idx_payroll_year_month",
        });
    },

    async down(queryInterface) {
        await queryInterface.removeIndex("payrolls", "idx_payroll_year_month");
        await queryInterface.removeIndex("payrolls", "uniq_payroll_employee_month_year");
        await queryInterface.dropTable("payrolls");
    },
};
