const router = require("express").Router();
const authenticate = require("../middleware/auth.middleware");
const userRoleController = require("../controllers/userRole.controller");
const { requireAnyRole } = require("../middleware/roleAccess.middleware");

router.post("/users/:userId/roles", authenticate, requireAnyRole(["super_admin"]), userRoleController.assignRoles);
router.get("/users/:userId/roles", authenticate, requireAnyRole(["super_admin"]), userRoleController.getRoles);
router.delete("/users/:userId/roles/:roleId", authenticate, requireAnyRole(["super_admin"]), userRoleController.removeRole);
module.exports = router;