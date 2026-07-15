require("dotenv").config();

const app = require("./index");

const connectDatabase = require("./src/helpers/database.helper");

const PORT = process.env.PORT || 5000;

(async () => {
    try {
        await connectDatabase();
        console.log("✅ Database Connected");

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