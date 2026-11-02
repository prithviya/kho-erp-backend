"use strict";

const { QueryTypes } = require("sequelize");
const { normalizeEmployeeCode } = require("../src/helpers/employeeCode");

const referenceKeys = new Set([
    "employeeId",
    "employeeID",
    "employeeCode",
    "employeeRecord",
]);

function normalizeJsonReferences(value) {
    if (Array.isArray(value)) {
        return value.map((item) => normalizeJsonReferences(item));
    }
    if (!value || typeof value !== "object") {
        return value;
    }

    return Object.fromEntries(
        Object.entries(value).map(([key, item]) => {
            if (referenceKeys.has(key) && typeof item === "string") {
                return [key, normalizeEmployeeCode(item)];
            }
            return [key, normalizeJsonReferences(item)];
        })
    );
}

async function findDuplicates(sequelize, table, column, transaction) {
    return sequelize.query(
        `SELECT REPLACE(TRIM(${column}), '-', '') AS normalizedCode, COUNT(*) AS count
         FROM ${table}
         WHERE ${column} IS NOT NULL AND TRIM(${column}) <> ''
         GROUP BY REPLACE(TRIM(${column}), '-', '')
         HAVING COUNT(*) > 1`,
        { type: QueryTypes.SELECT, transaction }
    );
}

const employeeCodeColumns = [
    ["employees", "employeeCode"],
    ["onboarding_info", "employeeId"],
    ["users", "employeeRecord"],
    ["onboardings", "employeeCode"],
    ["leave_requests", "employeeCode"],
];

module.exports = {
    async up(queryInterface) {
        const { sequelize } = queryInterface;

        await sequelize.transaction(async (transaction) => {
            const duplicateGroups = (await findDuplicates(
                sequelize,
                "employees",
                "employeeCode",
                transaction
            )).map((row) => `employees.employeeCode=${row.normalizedCode}`);

            if (duplicateGroups.length > 0) {
                throw new Error(
                    `Employee ID normalization aborted; resolve duplicate normalized IDs first: ${duplicateGroups.join(", ")}`
                );
            }

            const mapping = new Map();
            for (const [table, column] of employeeCodeColumns) {
                const rows = await sequelize.query(
                    `SELECT ${column} AS employeeCode FROM ${table}
                     WHERE ${column} IS NOT NULL AND ${column} <> ''`,
                    { type: QueryTypes.SELECT, transaction }
                );
                for (const { employeeCode } of rows) {
                    mapping.set(employeeCode, normalizeEmployeeCode(employeeCode));
                }
            }

            for (const [table, column] of employeeCodeColumns) {
                for (const [oldCode, newCode] of mapping) {
                    if (oldCode !== newCode) {
                        await sequelize.query(
                            `UPDATE ${table} SET ${column} = :newCode WHERE ${column} = :oldCode`,
                            { replacements: { oldCode, newCode }, transaction }
                        );
                    }
                }
            }

            const records = await sequelize.query(
                "SELECT id, formData, experienceDetails, educationDetails FROM onboarding_records",
                { type: QueryTypes.SELECT, transaction }
            );
            for (const record of records) {
                const updates = {};
                for (const column of ["formData", "experienceDetails", "educationDetails"]) {
                    if (record[column] === null || record[column] === undefined) continue;
                    const parsed = typeof record[column] === "string"
                        ? JSON.parse(record[column])
                        : record[column];
                    const normalized = normalizeJsonReferences(parsed);
                    if (JSON.stringify(normalized) !== JSON.stringify(parsed)) {
                        updates[column] = JSON.stringify(normalized);
                    }
                }
                if (Object.keys(updates).length > 0) {
                    const assignments = Object.keys(updates)
                        .map((column) => `${column} = :${column}`)
                        .join(", ");
                    await sequelize.query(
                        `UPDATE onboarding_records SET ${assignments} WHERE id = :id`,
                        { replacements: { ...updates, id: record.id }, transaction }
                    );
                }
            }
        });
    },

    async down() {
        throw new Error("Employee ID normalization is irreversible; restore the pre-migration database backup.");
    },
};
