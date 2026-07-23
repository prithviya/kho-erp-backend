const logger = require("../helpers/logger");

module.exports = (err, req, res, next) => {
    logger.error(err);
    return res.status(500).json({
        success: false,
        message: err.message
    });
};