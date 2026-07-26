const router = require("express").Router();

const authenticate = require("../middleware/auth.middleware");
const userRoleController = require("../controllers/userRole.controller");

router.post("/users/:userId/roles", authenticate, userRoleController.assignRoles);
router.get("/users/:userId/roles", authenticate, userRoleController.getRoles);
router.delete("/users/:userId/roles/:roleId", authenticate, userRoleController.removeRole);

module.exports = router;