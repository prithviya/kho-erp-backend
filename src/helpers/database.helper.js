const db = require("../model");
const logger = require("../helpers/logger");

const ensureOnboardingCompatibilityColumns = async () => {
    try {
        const tableName = "onboardings";
        const [columns] = await db.sequelize.query(
            `SHOW COLUMNS FROM \`${tableName}\``
        );
        const fieldNames = new Set(columns.map((col) => col.Field));

        const addColumnIfMissing = async (columnName, definitionSql) => {
            if (fieldNames.has(columnName)) {
                return;
            }

            await db.sequelize.query(
                `ALTER TABLE \`${tableName}\` ADD COLUMN \`${columnName}\` ${definitionSql}`
            );
            fieldNames.add(columnName);
        };

        const columnDefinitions = [
            ["candidateId", "INT NULL"],
            ["jobApplicationId", "INT NULL"],
            ["status", "ENUM('DRAFT','READY_FOR_VERIFICATION','IN_PROGRESS','COMPLETED','REJECTED') NOT NULL DEFAULT 'DRAFT'"],
            ["officialEmail", "VARCHAR(150) NULL"],
            ["officialPhone", "VARCHAR(20) NULL"],
            ["doj", "DATE NULL"],
            ["employeeType", "VARCHAR(100) NULL"],
            ["employeeRole", "VARCHAR(100) NULL"],
            ["hireSource", "VARCHAR(100) NULL"],
            ["departmentId", "INT NULL"],
            ["designation", "VARCHAR(100) NULL"],
            ["reportingManager", "VARCHAR(150) NULL"],
            ["photoUrl", "VARCHAR(255) NULL"],
            ["uanno", "VARCHAR(50) NULL"],
            ["aadharNo", "VARCHAR(50) NULL"],
            ["panNo", "VARCHAR(50) NULL"],
            ["salary", "VARCHAR(50) NULL"],
            ["employeeCode", "VARCHAR(50) NULL"],
        ];

        for (const [columnName, definitionSql] of columnDefinitions) {
            await addColumnIfMissing(columnName, definitionSql);
        }

        const [rows] = await db.sequelize.query(
            `SELECT \`cifid\`, \`candidateId\` FROM \`${tableName}\` WHERE \`candidateId\` IS NULL OR \`candidateId\` = 0 LIMIT 1`
        );

        if (rows && rows.length > 0) {
            await db.sequelize.query(
                `UPDATE \`${tableName}\` SET \`candidateId\` = \`cifid\` WHERE \`candidateId\` IS NULL OR \`candidateId\` = 0`
            );
        }

        logger.info("Onboarding compatibility columns ensured for legacy + normalized schema.");
    } catch (error) {
        logger.warn(
            `Onboarding compatibility check skipped: ${error?.message || String(error)}`
        );
    }
};

const connectDatabase = async () => {
    try {
        await db.sequelize.authenticate();
        logger.info("MySQL Connected Successfully");

        try {
            const autoSyncEnabled = process.env.DB_AUTO_SYNC !== "false";
            const alterSyncEnabled = process.env.DB_SYNC_ALTER === "true";

            if (!autoSyncEnabled) {
                logger.info("Database schema sync disabled (DB_AUTO_SYNC=false)");
                return;
            }

            if (alterSyncEnabled) {
                logger.warn(
                    "DB_SYNC_ALTER=true is enabled. This can trigger MySQL key-limit issues on large existing schemas. Proceeding with caution."
                );
            }

            await ensureOnboardingCompatibilityColumns();
            await db.sequelize.sync(alterSyncEnabled ? { alter: true } : undefined);
            logger.info(
                alterSyncEnabled
                    ? "Database schema sync completed with alter=true"
                    : "Database schema sync completed"
            );
        } catch (syncError) {
            const isTooManyKeysError =
                syncError?.parent?.code === "ER_TOO_MANY_KEYS" ||
                syncError?.parent?.errno === 1069 ||
                String(syncError?.message || "").includes("Too many keys specified");

            if (isTooManyKeysError) {
                logger.warn(
                    "MySQL key limit reached during ALTER sync. Automatic alter sync is unsafe for this schema; set DB_SYNC_ALTER=false to avoid repeated index churn."
                );
                return;
            }

            logger.error("❌ Database schema sync failed");
            logger.error(`Error Name: ${syncError?.name || "Unknown"}`);
            logger.error(`Error Message: ${syncError?.message || "Unknown"}`);

            if (syncError?.parent) {
                logger.error(`MySQL Error: ${syncError.parent.message || "Unknown"}`);
                logger.error(`MySQL Code: ${syncError.parent.code || "Unknown"}`);
                logger.error(`MySQL Errno: ${syncError.parent.errno || "Unknown"}`);
                logger.error(`MySQL SQL: ${syncError.parent.sql || "Unknown"}`);
            }

            if (syncError?.original) {
                logger.error(
                    `Original Error: ${syncError.original.message || "Unknown"}`
                );
            }

            if (syncError?.sql) {
                logger.error(`Generated SQL: ${syncError.sql}`);
            }

            logger.error("Stack Trace:");
            logger.error(syncError?.stack || String(syncError));

            logger.warn(
                "Database schema sync skipped. Review the DB schema and model definitions for mismatches."
            );
        }
    } catch (error) {
        logger.error("❌ Database Connection Failed");
        logger.error(error?.stack || error?.message || String(error));
        process.exit(1);
    }
};

module.exports = connectDatabase;