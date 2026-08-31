const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
const fs = require("fs");
const logger = require("./src/helpers/logger");
require("dotenv").config();
const app = express();
/**
 * Trust Proxy
 */
if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}
/**
 * Security Middleware
 */
app.use(helmet());
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    })
);
app.use(morgan("dev"));
/**
 * Body Parser
 */
app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
/**
 * Rate Limiter
 */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api", limiter);
/**
 * Routes
 */ 
const routes = require("./src/routes");
app.use("/api", routes);
/**
 * Health Check
 */
app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "API Running",
        timestamp: new Date(),
    });
});
/**
 * Root API
 */
app.get("/", (req, res, next) => {
    const buildPath = path.join(__dirname, "build");
    if (fs.existsSync(buildPath)) {
        return next();
    }
    return res.json({
        success: true,
        message: "ERP Backend API Running",
    });
});
/**
 * Serve React Build (Only if build folder exists)
 */
const buildPath = path.join(__dirname, "build");
const uploadsPath = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, "uploads"));
if (fs.existsSync(uploadsPath)) {
    app.use("/uploads", express.static(uploadsPath));
}
const assetsPath = path.join(__dirname, "assets");
if (fs.existsSync(assetsPath)) {
    app.use("/assets", express.static(assetsPath));
}
if (fs.existsSync(buildPath)) {
    logger.info("✅ React build detected");
    app.use(express.static(buildPath));
    app.get(/^\/(?!api|health).*/, (req, res) => {
        res.sendFile(path.join(buildPath, "index.html"));
    });
} else {
    logger.info("⚠️ React build not found. Running Backend Only.");
}
/**
 * 404 Handler
 */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route Not Found",
    });
});
/**
 * Global Error Handler
 */
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        ...(process.env.NODE_ENV === "development" && {
            stack: err.stack,
        }),
    });
});
module.exports = app;