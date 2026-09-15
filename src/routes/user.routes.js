const router = require("express").Router();
const controller = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { requireAnyRole, requireDeleteAccess } = require("../middleware/roleAccess.middleware");

router.get("/", authMiddleware, requireAnyRole(["super_admin"]), controller.getUsers);
router.get("/directory", authMiddleware, requireAnyRole(["manager"]), controller.getDirectory);
router.post("/", authMiddleware, requireAnyRole(["super_admin"]), controller.createUser);
router.put("/:id", authMiddleware, requireAnyRole(["super_admin"]), controller.updateUser);
router.patch("/:id/status", authMiddleware, requireAnyRole(["super_admin"]), controller.updateUserStatus);
router.delete("/:id", authMiddleware, requireAnyRole(["super_admin"]), requireDeleteAccess, controller.deleteUser);

module.exports = router;