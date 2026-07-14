require("dotenv").config();

const app = require("./index");
const db = require("./src/model");

const PORT = process.env.PORT || 5000;

(async () => {
    try {
        await db.sequelize.authenticate();
        console.log("✅ Database Connected");

        await db.sequelize.sync({ alter: true });
        console.log("✅ Database Synced");

        app.listen(PORT, () => {
            console.log("================================");
            console.log(`🚀 ERP API Running on Port ${PORT}`);
            console.log(`🌍 Environment : ${process.env.NODE_ENV}`);
            console.log("================================");
        });
    } catch (error) {
        console.error("❌ Failed to start application");
        console.error(error);
    }
})();