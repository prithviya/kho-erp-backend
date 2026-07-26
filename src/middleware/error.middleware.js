const logger = require("../helpers/logger");
module.exports = (err, req, res, next) => {
    logger.error(err);
    const status = err.statusCode || 500;
    const response = {
        success: false,
        message: err.message || "Internal Server Error"
    };
    if (process.env.NODE_ENV === "development") {
        response.stack = err.stack;
    }
    return res.status(status).json(response);
};