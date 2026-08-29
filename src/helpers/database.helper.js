const db = require("../model");
const logger = require("../helpers/logger");

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

            await db.sequelize.sync(alterSyncEnabled ? { alter: true } : undefined);
            logger.info(
                alterSyncEnabled
                    ? "Database schema sync completed with alter=true"
                    : "Database schema sync completed"
            );
        } catch (syncError) {
            logger.error("⚠️ Database schema sync failed. See stack trace below:");
            logger.error(syncError?.stack || syncError?.message || String(syncError));
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