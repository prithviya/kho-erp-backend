const router = require("express").Router();
const roleController = require("../controllers/role.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { requireAnyRole } = require("../middleware/roleAccess.middleware");

// Reading the role list is needed by HR's onboarding wizard; only mutating
// roles stays super-admin-only.
router.get("/", authMiddleware, roleController.getRoles);
router.post("/", authMiddleware, requireAnyRole(["super_admin"]), roleController.createRole);
router.put("/:id", authMiddleware, requireAnyRole(["super_admin"]), roleController.updateRole);
router.delete("/:id", authMiddleware, requireAnyRole(["super_admin"]), roleController.deleteRole);
module.exports = router;