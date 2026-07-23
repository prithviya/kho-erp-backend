const winston = require("winston");
require("winston-daily-rotate-file");

const logFormat = winston.format.combine(
    winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss"
    }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
        return `${timestamp} [${level.toUpperCase()}] ${stack || message}`;
    })
);

const applicationTransport = new winston.transports.DailyRotateFile({
    filename: "src/logs/application/application-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    maxFiles: "30d"
});

const errorTransport = new winston.transports.DailyRotateFile({
    filename: "src/logs/error/error-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    level: "error",
    maxFiles: "30d"
});

const logger = winston.createLogger({

    level: "info",

    format: logFormat,

    transports: [

        applicationTransport,

        errorTransport,

        new winston.transports.Console()

    ]

});

module.exports = logger;