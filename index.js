const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
const fs = require("fs");

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
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
    })
);

app.use(morgan("dev"));

/**
 * Body Parser
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use("/api/users", require("./src/routes/user.routes"));
// app.use("/api/auth", require("./src/routes/auth.routes"));
// app.use("/api/leads", require("./src/routes/lead.routes"));

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

if (fs.existsSync(buildPath)) {
    console.log("✅ React build detected");

    app.use(express.static(buildPath));

    app.get(/^\/(?!api|health).*/, (req, res) => {
        res.sendFile(path.join(buildPath, "index.html"));
    });
} else {
    console.log("⚠️ React build not found. Running Backend Only.");
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