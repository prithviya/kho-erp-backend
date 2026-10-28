const router = require("express").Router();
const roleController = require("../controllers/role.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { requireAnyRole } = require("../middleware/roleAccess.middleware");
const requireModulePermission = require("../middleware/modulePermission.middleware");

router.get(
    "/",
    authMiddleware,
    requireModulePermission(["user_management", "onboarding"]),
    roleController.getRoles
);
router.get(
    "/manage",
    authMiddleware,
    requireAnyRole(["super_admin"]),
    roleController.getRolesWithAccess
);
router.get(
    "/permission-catalog",
    authMiddleware,
    requireAnyRole(["super_admin"]),
    roleController.getPermissionCatalog
);
router.post(
    "/permission-catalog/initialize",
    authMiddleware,
    requireAnyRole(["super_admin"]),
    roleController.initializePermissionCatalog
);
router.post(
    "/backfill-legacy",
    authMiddleware,
    requireAnyRole(["super_admin"]),
    roleController.backfillLegacyRoles
);
router.get(
    "/:id/permission-matrix",
    authMiddleware,
    requireAnyRole(["super_admin"]),
    roleController.getPermissionMatrix
);
router.post("/", authMiddleware, requireAnyRole(["super_admin"]), roleController.createRole);
router.put("/:id", authMiddleware, requireAnyRole(["super_admin"]), roleController.updateRole);
router.delete("/:id", authMiddleware, requireAnyRole(["super_admin"]), roleController.deleteRole);
module.exports = router;