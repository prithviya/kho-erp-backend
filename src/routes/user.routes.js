const router = require("express").Router();
const controller = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { requireAnyRole, requireDeleteAccess } = require("../middleware/roleAccess.middleware");
const requireModulePermission = require("../middleware/modulePermission.middleware");

router.get("/", authMiddleware, requireModulePermission("user_management"), controller.getUsers);
router.get(
    "/directory",
    authMiddleware,
    requireModulePermission(["employee", "onboarding", "project_onboard", "project_details", "tasks", "task_board", "task_schedule", "assign_board", "lead_management", "leave"]),
    controller.getDirectory
);
router.post("/", authMiddleware, requireAnyRole(["super_admin"]), controller.createUser);
router.put("/:id", authMiddleware, requireAnyRole(["super_admin"]), controller.updateUser);
router.patch("/:id/status", authMiddleware, requireAnyRole(["super_admin"]), controller.updateUserStatus);
router.delete("/:id", authMiddleware, requireAnyRole(["super_admin"]), requireDeleteAccess, controller.deleteUser);

module.exports = router;