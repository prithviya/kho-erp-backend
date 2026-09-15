const express = require("express");
const router = express.Router();

const controller = require("../controllers/task.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { requireAnyRole, requireDeleteAccess } = require("../middleware/roleAccess.middleware");
const validate = require("../middleware/validate.middleware");
const {
    taskIdParamValidation,
    createTaskValidation,
    updateTaskValidation,
    updateTaskStatusValidation,
} = require("../validation/task.validation");

// Listing is open to every logged-in user; the service scopes results by role.
router.get("/", authMiddleware, controller.getTasks);
router.get("/:id", authMiddleware, taskIdParamValidation, validate, controller.getTaskById);

// Only managers (and super admins) allocate work.
router.post("/", authMiddleware, requireAnyRole(["manager"]), createTaskValidation, validate, controller.createTask);
router.put("/:id", authMiddleware, requireAnyRole(["manager"]), updateTaskValidation, validate, controller.updateTask);

// Assignee, reporting head, or super admin may move a task along.
router.patch("/:id/status", authMiddleware, updateTaskStatusValidation, validate, controller.updateTaskStatus);

router.delete("/:id", authMiddleware, requireAnyRole(["super_admin"]), requireDeleteAccess, taskIdParamValidation, validate, controller.deleteTask);

module.exports = router;
