const { validationResult } = require("express-validator");

module.exports = (req, res, next) => {

    console.log("===== VALIDATE MIDDLEWARE =====");
    console.log("Body:", req.body);

    const errors = validationResult(req);
    console.log("Errors:", errors.array());

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors: errors.array()
        });
    }

    next();
};