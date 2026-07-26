const winston = require("winston");
const path = require("path");

const sqlLogger = winston.createLogger({

    level: "info",

    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, message }) => {
            return `${timestamp} ${message}`;
        })
    ),

    transports: [
        new winston.transports.File({
            filename: path.join("logs", "sql.log")
        })
    ]

});

module.exports = sqlLogger;