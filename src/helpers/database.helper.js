const db = require("../model");
const logger = require("../helpers/logger");

const ensureMySqlPacketLimit = async () => {
    const maxAllowedPacket = Number(
        process.env.MAX_ALLOWED_PACKET || 256 * 1024 * 1024
    );

    if (process.env.DB_TYPE !== "mysql" || !Number.isInteger(maxAllowedPacket)) {
        return;
    }

    try {
        await db.sequelize.query(
            `SET GLOBAL max_allowed_packet = ${maxAllowedPacket}`
        );
        logger.info(`MySQL max_allowed_packet set to ${maxAllowedPacket} bytes.`);
    } catch (error) {
        logger.warn(
            `Unable to set MySQL max_allowed_packet automatically: ${error?.message || String(error)}`
        );
        logger.warn(
            `Set max_allowed_packet to at least ${maxAllowedPacket} on the MySQL server configuration and restart MySQL.`
        );
    }
};

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

const ensureUserCompatibilityColumns = async () => {
    const tableName = "users";
    const [columns] = await db.sequelize.query(
        `SHOW COLUMNS FROM \`${tableName}\``
    );
    const fieldNames = new Set(columns.map((col) => col.Field));

    if (!fieldNames.has("canDelete")) {
        await db.sequelize.query(
            `ALTER TABLE \`${tableName}\` ADD COLUMN \`canDelete\` TINYINT(1) NOT NULL DEFAULT 1`
        );
        logger.info("Added missing users.canDelete compatibility column.");
    }
};

const ensureProjectOnboardCompatibilityColumns = async () => {
    const tableName = "project_onboards";
    const queryInterface = db.sequelize.getQueryInterface();
    const columns = await queryInterface.describeTable(tableName);

    if (!columns.assignedVendorIds) {
        await queryInterface.addColumn(tableName, "assignedVendorIds", {
            type: db.Sequelize.JSON,
            allowNull: false,
            defaultValue: [],
        });
        logger.info("Added missing project_onboards.assignedVendorIds compatibility column.");
    }
};

const ensureTaskCompatibilityColumns = async () => {
    const tableName = "tasks";
    const queryInterface = db.sequelize.getQueryInterface();
    const columns = await queryInterface.describeTable(tableName);

    if (!columns.assignedVendorId) {
        await queryInterface.addColumn(tableName, "assignedVendorId", {
            type: db.Sequelize.INTEGER,
            allowNull: true,
        });
        logger.info("Added missing tasks.assignedVendorId compatibility column.");
    }

    if (!columns.dueTime) {
        await queryInterface.addColumn(tableName, "dueTime", {
            type: db.Sequelize.STRING(5),
            allowNull: true,
        });
        logger.info("Added missing tasks.dueTime compatibility column.");
    }

    if (!columns.additionalAssigneeIds) {
        await queryInterface.addColumn(tableName, "additionalAssigneeIds", {
            type: db.Sequelize.JSON,
            allowNull: true,
        });
        logger.info("Added missing tasks.additionalAssigneeIds compatibility column.");
    }

    if (!columns.reminderAt) {
        await queryInterface.addColumn(tableName, "reminderAt", {
            type: db.Sequelize.DATE,
            allowNull: true,
        });
        logger.info("Added missing tasks.reminderAt compatibility column.");
    }
};

const ensureTaskChatCompatibilityColumns = async () => {
    const tableName = "task_chat_messages";
    const queryInterface = db.sequelize.getQueryInterface();
    const columns = await queryInterface.describeTable(tableName);

    if (!columns.editedAt) {
        await queryInterface.addColumn(tableName, "editedAt", {
            type: db.Sequelize.DATE,
            allowNull: true,
        });
        logger.info("Added missing task_chat_messages.editedAt compatibility column.");
    }
};

const ensureLeaveRequestCompatibilityColumns = async () => {
    const tableName = "leave_requests";
    const queryInterface = db.sequelize.getQueryInterface();
    const columns = await queryInterface.describeTable(tableName);

    if (!columns.clientName) {
        await queryInterface.addColumn(tableName, "clientName", {
            type: db.Sequelize.STRING(200),
            allowNull: true,
        });
        logger.info("Added missing leave_requests.clientName compatibility column.");
    }

    if (!columns.designatedApproverId) {
        await queryInterface.addColumn(tableName, "designatedApproverId", {
            type: db.Sequelize.INTEGER,
            allowNull: true,
        });
        logger.info("Added missing leave_requests.designatedApproverId compatibility column.");
    }
};

const ensureRolePermissionConfigurationColumn = async () => {
    const tableName = "roles";
    const queryInterface = db.sequelize.getQueryInterface();
    const columns = await queryInterface.describeTable(tableName);

    if (!columns.permissionsConfigured) {
        await queryInterface.addColumn(tableName, "permissionsConfigured", {
            type: db.Sequelize.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        });
        logger.info("Added missing roles.permissionsConfigured compatibility column.");
    }
};

const connectDatabase = async () => {
    try {
        await db.sequelize.authenticate();
        logger.info("MySQL Connected Successfully");
        await ensureMySqlPacketLimit();

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
            await ensureUserCompatibilityColumns();
            await ensureProjectOnboardCompatibilityColumns();
            await ensureTaskCompatibilityColumns();
            await db.sequelize.sync(alterSyncEnabled ? { alter: true } : undefined);
            await ensureLeaveRequestCompatibilityColumns();
            await ensureTaskChatCompatibilityColumns();
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

        if (process.env.DB_AUTO_SYNC !== "false") {
            await ensureRolePermissionConfigurationColumn();
            try {
                // Additive: only creates missing standard menus and actions; never changes existing rows.
                const roleService = require("../services/role.service");
                const result = await roleService.initializePermissionCatalog();
                if (result.createdModules || result.createdPermissions) {
                    logger.info(`Permission catalog initialized: ${result.createdModules} menus, ${result.createdPermissions} permissions added.`);
                }
            } catch (catalogError) {
                logger.warn(`Permission catalog initialization skipped: ${catalogError.message}`);
            }
        }
    } catch (error) {
        logger.error("❌ Database Connection Failed");
        logger.error(error?.stack || error?.message || String(error));
        process.exit(1);
    }
};

module.exports = connectDatabase;