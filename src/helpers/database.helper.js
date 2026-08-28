const db = require("../model");
const logger = require("../helpers/logger");

const connectDatabase = async () => {
    try {
        await db.sequelize.authenticate();
        logger.info("MySQL Connected Successfully");

        try {
            await db.sequelize.sync({ alter: true });
            logger.info("Database schema sync completed");
        } catch (syncError) {
            logger.warn("⚠️ Database schema sync skipped:", syncError.message);
        }
    } catch (error) {
        logger.error("❌ Database Connection Failed");
        logger.error(error.message);
        process.exit(1);
    }
};

module.exports = connectDatabase;