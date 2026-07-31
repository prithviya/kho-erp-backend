// Auth validation rules for change password and update profile
const { body } = require("express-validator");

exports.registerValidation = [
    body("firstName")
        .notEmpty()
        .withMessage("First name is required."),
    body("email")
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Invalid email.")
        .normalizeEmail(),
    body("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters."),
    body("roleIds")
        .optional()
        .isArray()
        .withMessage("roleIds must be an array.")
        .custom((ids) => ids.every((id) => Number.isInteger(id) && id > 0))
        .withMessage("Each role ID must be a positive integer."),
];

exports.loginValidation = [
    body("email")
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Invalid email.")
        .normalizeEmail(),
    body("password")
        .notEmpty()
        .withMessage("Password is required."),
];

exports.refreshTokenValidation = [
    body("refreshToken")
        .optional()
        .isString()
        .withMessage("Refresh token must be a string.")
        .custom((value, { req }) => {
            if (value || req.cookies?.erp_refresh_token) {
                return true;
            }
            throw new Error("Refresh token is required.");
        }),
];

exports.forgotPasswordValidation = [
    body("email")
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Invalid email.")
        .normalizeEmail(),
];

exports.resetPasswordValidation = [
    body("token")
        .notEmpty()
        .withMessage("Reset token is required."),
    body("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters."),
];

exports.changePasswordValidation = [
    body("oldPassword")
        .notEmpty()
        .withMessage("Old password is required."),
    body("newPassword")
        .notEmpty()
        .withMessage("New password is required.")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters."),
    body("confirmPassword")
        .notEmpty()
        .withMessage("Confirm password is required.")
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error("Passwords do not match.");
            }
            return true;
        })
];
exports.updateProfileValidation = [
    body("firstName")
        .notEmpty()
        .withMessage("First name is required."),
    body("lastName")
        .notEmpty()
        .withMessage("Last name is required."),
    body("email")
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Invalid email."),
    body("phone")
        .notEmpty()
        .withMessage("Phone number is required.")
        .isLength({ min: 10, max: 10 })
        .withMessage("Phone number must be 10 digits.")
];