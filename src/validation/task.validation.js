const { body, param } = require("express-validator");

const TASK_STATUSES = ["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"];
const TASK_PRIORITIES = ["LOW", "MEDIUM", "HIGH"];

const taskIdParamValidation = [
    param("id").isInt({ min: 1 }).withMessage("Invalid task id."),
];

const baseTaskValidation = [
    body("serviceId")
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage("serviceId must be a positive integer."),
    body("description")
        .optional({ nullable: true })
        .isString()
        .withMessage("description must be text."),
    body("reportingHeadId")
        .optional({ nullable: true })
        .isInt({ min: 1 })
        .withMessage("reportingHeadId must be a positive integer."),
    body("priority")
        .optional()
        .isIn(TASK_PRIORITIES)
        .withMessage(`priority must be one of ${TASK_PRIORITIES.join(", ")}.`),
    body("dueDate")
        .optional({ nullable: true })
        .isISO8601()
        .withMessage("dueDate must be a valid date (YYYY-MM-DD)."),
];

const createTaskValidation = [
    body("projectOnboardId").isInt({ min: 1 }).withMessage("projectOnboardId is required."),
    body("title").trim().notEmpty().withMessage("title is required.").isLength({ max: 200 }),
    body("assignedToId").isInt({ min: 1 }).withMessage("assignedToId is required."),
    ...baseTaskValidation,
];

const updateTaskValidation = [
    ...taskIdParamValidation,
    body("projectOnboardId").optional().isInt({ min: 1 }).withMessage("projectOnboardId must be a positive integer."),
    body("title").optional().trim().notEmpty().withMessage("title cannot be empty.").isLength({ max: 200 }),
    body("assignedToId").optional().isInt({ min: 1 }).withMessage("assignedToId must be a positive integer."),
    ...baseTaskValidation,
];

const updateTaskStatusValidation = [
    ...taskIdParamValidation,
    body("status").isIn(TASK_STATUSES).withMessage(`status must be one of ${TASK_STATUSES.join(", ")}.`),
];

module.exports = {
    taskIdParamValidation,
    createTaskValidation,
    updateTaskValidation,
    updateTaskStatusValidation,
};
