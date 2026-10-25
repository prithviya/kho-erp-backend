const express = require("express");
const router = express.Router();

const departmentController = require("../controllers/department.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { requireAnyRole, requireDeleteAccess } = require("../middleware/roleAccess.middleware");

// Reading the department list is needed by HR/manager pickers (job openings,
// onboarding); only mutating the master data stays super-admin-only.
router.get("/", authMiddleware, departmentController.getAll);
router.get("/:id", authMiddleware, departmentController.getById);
router.post("/", authMiddleware, requireAnyRole(["super_admin"]), departmentController.create);
router.put("/:id", authMiddleware, requireAnyRole(["super_admin"]), departmentController.update);
router.delete("/:id", authMiddleware, requireAnyRole(["super_admin"]), requireDeleteAccess, departmentController.delete);

module.exports = router;