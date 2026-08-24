const router = require("express").Router();
const roleController = require("../controllers/role.controller");
const authMiddleware = require("../middleware/auth.middleware");
const superAdminMiddleware = require("../middleware/superAdmin.middleware");

router.post("/",   roleController.createRole);
router.get("/", authMiddleware, superAdminMiddleware, roleController.getRoles);
router.put("/:id", authMiddleware, superAdminMiddleware, roleController.updateRole);
router.delete("/:id", authMiddleware, superAdminMiddleware, roleController.deleteRole);
module.exports = router;