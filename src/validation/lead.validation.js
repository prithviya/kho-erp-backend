const { body } = require("express-validator");

exports.createLeadValidation = [
    body("companyName")
        .notEmpty().withMessage("Company name is required.")
        .isLength({ max: 255 }).withMessage("Company name must not exceed 255 characters."),

    body("contactPerson")
        .notEmpty().withMessage("Contact person is required.")
        .isLength({ max: 255 }).withMessage("Contact person must not exceed 255 characters."),

    body("phone")
        .notEmpty().withMessage("Phone number is required.")
        .matches(/^\d{10}$/).withMessage("Phone number must contain exactly 10 digits."),

    body("email")
        .notEmpty().withMessage("Email is required.")
        .isEmail().withMessage("Invalid email address.")
        .normalizeEmail(),

    body("leadSourceId")
        .notEmpty().withMessage("Lead source is required.")
        .isInt({ min: 1 }).withMessage("Invalid lead source."),

    body("budget")
        .optional()
        .isFloat({ min: 0 }).withMessage("Budget must be a positive number."),

    body("serviceIds")
        .optional()
        .isArray().withMessage("Services must be an array.")
        .custom((ids) => ids.every((id) => Number.isInteger(id) && id > 0))
        .withMessage("Each service ID must be a positive integer."),

    body("assignedTo")
        .optional()
        .isInt({ min: 1 }).withMessage("Invalid assigned user."),

    body("nextFollowupDate")
        .optional()
        .isISO8601().withMessage("Next follow-up date must be a valid date.")
        .toDate(),

    body("notes")
        .optional()
        .isLength({ max: 1000 }).withMessage("Notes must not exceed 1000 characters."),
];

exports.updateLeadValidation = [
    body("companyName")
        .optional()
        .isLength({ max: 255 }).withMessage("Company name must not exceed 255 characters."),

    body("contactPerson")
        .optional()
        .isLength({ max: 255 }).withMessage("Contact person must not exceed 255 characters."),

    body("phone")
        .optional()
        .matches(/^\d{10}$/).withMessage("Phone number must contain exactly 10 digits."),

    body("email")
        .optional()
        .isEmail().withMessage("Invalid email address.")
        .normalizeEmail(),

    body("leadSourceId")
        .optional()
        .isInt({ min: 1 }).withMessage("Invalid lead source."),

    body("leadStatusId")
        .optional()
        .isInt({ min: 1 }).withMessage("Invalid lead status."),

    body("budget")
        .optional()
        .isFloat({ min: 0 }).withMessage("Budget must be a positive number."),

    body("serviceIds")
        .optional()
        .isArray().withMessage("Services must be an array.")
        .custom((ids) => ids.every((id) => Number.isInteger(id) && id > 0))
        .withMessage("Each service ID must be a positive integer."),

    body("nextFollowupDate")
        .optional()
        .isISO8601().withMessage("Next follow-up date must be a valid date.")
        .toDate(),

    body("notes")
        .optional()
        .isLength({ max: 1000 }).withMessage("Notes must not exceed 1000 characters."),
];
