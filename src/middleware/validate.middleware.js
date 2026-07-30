const { validationResult } = require("express-validator");
const ApiResponse = require("../helpers/apiResponse");

module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formatted = errors.array().map(({ path, msg }) => ({ field: path, message: msg }));
        return ApiResponse.error(res, "Validation failed.", formatted, 422);
    }
    next();
};