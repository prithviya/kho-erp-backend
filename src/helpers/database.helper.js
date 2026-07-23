const db = require("../model");
const logger = require("../helpers/logger");
const connectDatabase = async () => {
    try {

        await db.sequelize.authenticate();

        logger.info("MySQL Connected Successfully");
        await db.sequelize.sync({
            alter: true
            // force: true // Drops and recreates tables (Development only)
        });
    } catch (error) {

        logger.error("❌ Database Connection Failed");
        logger.error(error.message);

        process.exit(1);

    }
};

module.exports = connectDatabase;