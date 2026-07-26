// Auth validation rules for change password and update profile
const { body } = require("express-validator");

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