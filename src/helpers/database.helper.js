const db = require("../model");

const connectDatabase = async () => {
    try {

        await db.sequelize.authenticate();

        console.log("✅ MySQL Connected Successfully");
        await db.sequelize.sync({
            alter: true
            // force: true // Drops and recreates tables (Development only)
        });
    } catch (error) {

        console.error("❌ Database Connection Failed");

        console.error(error.message);

        process.exit(1);

    }
};

module.exports = connectDatabase;