const router = require("express").Router();
const roleController = require("../controllers/role.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { requireAnyRole } = require("../middleware/roleAccess.middleware");

router.post("/", authMiddleware, requireAnyRole(["super_admin"]), roleController.createRole);
router.get("/", authMiddleware, requireAnyRole(["super_admin"]), roleController.getRoles);
router.put("/:id", authMiddleware, requireAnyRole(["super_admin"]), roleController.updateRole);
router.delete("/:id", authMiddleware, requireAnyRole(["super_admin"]), roleController.deleteRole);
module.exports = router;