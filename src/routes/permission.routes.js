const router = require("express").Router();
const permissionController = require("../controllers/permission.controller");
const authMiddleware = require("../middleware/auth.middleware");
const superAdminMiddleware = require("../middleware/superAdmin.middleware");

router.post("/", authMiddleware, superAdminMiddleware, permissionController.createPermission);
router.get("/", authMiddleware, superAdminMiddleware, permissionController.getPermissions);
router.get("/:id", authMiddleware, superAdminMiddleware, permissionController.getPermission);
router.put("/:id", authMiddleware, superAdminMiddleware, permissionController.updatePermission);
router.delete("/:id", authMiddleware, superAdminMiddleware, permissionController.deletePermission);
module.exports = router;