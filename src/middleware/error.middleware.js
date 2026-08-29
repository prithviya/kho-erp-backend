const logger = require("../helpers/logger");
const ApiResponse = require("../helpers/apiResponse");

module.exports = (err, req, res, next) => {
    logger.error(err);

    // Sequelize validation / unique constraint errors
    if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
        const errors = err.errors.map((e) => ({ field: e.path, message: e.message }));
        return ApiResponse.error(res, "Database validation failed.", errors, 422);
    }

    // JWT errors
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        return ApiResponse.unauthorized(res, err.name === "TokenExpiredError" ? "Token expired." : "Invalid token.");
    }

    // Explicit application validation errors
    if (Number(err.status) >= 400 && Number(err.status) < 500) {
        return ApiResponse.error(res, err.message, err.errors || null, err.status);
    }

    // Operational errors thrown via AppError
    if (err.isOperational) {
        return ApiResponse.error(res, err.message, null, err.statusCode);
    }

    // Unexpected errors — hide details in production
    const message = process.env.NODE_ENV === "production" ? "Internal Server Error" : err.message;
    const extra = process.env.NODE_ENV !== "production" ? { stack: err.stack } : null;
    return ApiResponse.error(res, message, extra, 500);
};