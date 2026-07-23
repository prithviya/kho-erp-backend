const logger = require("./logger");

exports.audit = (userId, module, action, message) => {
    logger.info(
        `[AUDIT] User:${userId} Module:${module} Action:${action} ${message}`
    );
};