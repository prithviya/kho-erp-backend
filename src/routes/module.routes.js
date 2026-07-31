const router = require("express").Router();
const moduleController = require("../controllers/module.controller");
const authMiddleware = require("../middleware/auth.middleware");
const superAdminMiddleware = require("../middleware/superAdmin.middleware");

router.post("/", authMiddleware, superAdminMiddleware, moduleController.createModule);
router.get("/", authMiddleware, superAdminMiddleware, moduleController.getModules);
router.get("/:id", authMiddleware, superAdminMiddleware, moduleController.getModule);
router.put("/:id", authMiddleware, superAdminMiddleware, moduleController.updateModule);
router.delete("/:id", authMiddleware, superAdminMiddleware, moduleController.deleteModule);
module.exports = router;