require("dotenv").config();

const app = require("./index");
const logger = require("./src/helpers/logger");
const connectDatabase = require("./src/helpers/database.helper");
const requestLogger = require("./src/middleware/requestLogger");

const PORT = process.env.PORT || 5000;

app.use(requestLogger);

(async () => {
    try {
        await connectDatabase();
        logger.info("✅ Database Connected");

        app.listen(PORT, () => {
            logger.info("================================");
            logger.info(`🚀 ERP API Running on Port ${PORT}`);
            logger.info(`🌍 Environment : ${process.env.NODE_ENV}`);
            logger.info("================================");
        });
    } catch (error) {
        logger.error("❌ Failed to start application");
        logger.error(error);
    }
})();