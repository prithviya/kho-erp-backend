const router = require("express").Router();
const controller = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const superAdminMiddleware = require("../middleware/superAdmin.middleware");

router.get("/", authMiddleware, controller.getUsers);
router.post("/", authMiddleware, superAdminMiddleware, controller.createUser);
router.put("/:id", authMiddleware, superAdminMiddleware, controller.updateUser);
router.patch("/:id/status", authMiddleware, superAdminMiddleware, controller.updateUserStatus);
router.delete("/:id", authMiddleware, superAdminMiddleware, controller.deleteUser);

module.exports = router;