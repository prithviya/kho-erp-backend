require("dotenv").config();
const app = require("./index");
const http = require("http");
const logger = require("./src/helpers/logger");
const connectDatabase = require("./src/helpers/database.helper");
const { initializeSocket } = require("./src/realtime/socket");
const seedStaticData = require("./seed");
const requestLogger = require("./src/middleware/requestLogger");
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
initializeSocket(server);
app.use(requestLogger);
(async () => {
    try {
        await connectDatabase();
        logger.info("✅ Database Connected");

        const seeded = await seedStaticData();
        if (seeded) {
            logger.info("✅ Static seed data ensured");
        }

        const activityLogService = require("./src/services/activityLog.service");
        activityLogService.purgeExpired().catch((error) => logger.error(`Activity log cleanup failed: ${error.message}`));
        setInterval(() => {
            activityLogService.purgeExpired().catch((error) => logger.error(`Activity log cleanup failed: ${error.message}`));
        }, 24 * 60 * 60 * 1000).unref();

        server.listen(PORT, () => {
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