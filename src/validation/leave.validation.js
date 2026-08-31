const { body, param } = require("express-validator");

const DURATION_TYPES = ["FULL_DAY", "HALF_DAY", "QUARTER_DAY", "HOURS"];
const STATUS_TYPES = ["APPROVED", "REJECTED"];

const leaveIdParamValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid leave request id."),
];

const baseLeaveRequestValidation = [
    body("categoryId")
        .optional()
        .isInt({ min: 1 })
        .withMessage("categoryId must be a positive integer."),

    body("fromDate")
        .optional()
        .isISO8601()
        .withMessage("fromDate must be a valid date (YYYY-MM-DD)."),

    body("toDate")
        .optional()
        .isISO8601()
        .withMessage("toDate must be a valid date (YYYY-MM-DD)."),

    body("durationType")
        .optional()
        .isIn(DURATION_TYPES)
        .withMessage("durationType must be one of FULL_DAY, HALF_DAY, QUARTER_DAY, HOURS."),

    body("session")
        .optional({ nullable: true })
        .isIn(["MORNING", "NOON"])
        .withMessage("session must be MORNING or NOON."),

    body("quarterSlot")
        .optional({ nullable: true })
        .isInt({ min: 1, max: 4 })
        .withMessage("quarterSlot must be between 1 and 4."),

    body("startTime")
        .optional({ nullable: true })
        .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
        .withMessage("startTime must be in HH:mm format."),

    body("endTime")
        .optional({ nullable: true })
        .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
        .withMessage("endTime must be in HH:mm format."),

    body("reason")
        .optional({ nullable: true })
        .isLength({ max: 1000 })
        .withMessage("reason must not exceed 1000 characters."),

    body().custom((payload) => {
        const fromDate = payload?.fromDate;
        const toDate = payload?.toDate;
        if (fromDate && toDate && String(toDate) < String(fromDate)) {
            throw new Error("toDate must be greater than or equal to fromDate.");
        }

        if (payload?.durationType === "HALF_DAY" && !payload?.session) {
            throw new Error("session is required for HALF_DAY leave.");
        }

        if (payload?.durationType === "QUARTER_DAY" && !payload?.quarterSlot) {
            throw new Error("quarterSlot is required for QUARTER_DAY leave.");
        }

        if (payload?.durationType === "HOURS" && (!payload?.startTime || !payload?.endTime)) {
            throw new Error("startTime and endTime are required for HOURS leave.");
        }

        return true;
    }),
];

exports.createLeaveRequestValidation = [
    body("categoryId")
        .notEmpty()
        .withMessage("categoryId is required.")
        .isInt({ min: 1 })
        .withMessage("categoryId must be a positive integer."),

    body("fromDate")
        .notEmpty()
        .withMessage("fromDate is required.")
        .isISO8601()
        .withMessage("fromDate must be a valid date (YYYY-MM-DD)."),

    body("toDate")
        .optional()
        .isISO8601()
        .withMessage("toDate must be a valid date (YYYY-MM-DD)."),

    ...baseLeaveRequestValidation,
];

exports.updateLeaveRequestValidation = [
    ...leaveIdParamValidation,
    ...baseLeaveRequestValidation,
];

exports.updateLeaveStatusValidation = [
    ...leaveIdParamValidation,

    body("status")
        .notEmpty()
        .withMessage("status is required.")
        .isIn(STATUS_TYPES)
        .withMessage("status must be APPROVED or REJECTED."),

    body("approverRemarks")
        .optional({ nullable: true })
        .isLength({ max: 500 })
        .withMessage("approverRemarks must not exceed 500 characters."),

    body().custom((payload) => {
        if (payload?.status === "REJECTED") {
            const remarks = String(payload?.approverRemarks || "").trim();
            if (!remarks) {
                throw new Error("approverRemarks is required when rejecting a leave request.");
            }
        }

        return true;
    }),
];
