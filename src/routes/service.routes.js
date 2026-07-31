const router = require("express").Router();
const controller = require("../controllers/service.controller");
const authMiddleware = require("../middleware/auth.middleware");
const superAdminMiddleware = require("../middleware/superAdmin.middleware");

router.post("/", authMiddleware, superAdminMiddleware, controller.create);
router.get("/", authMiddleware, controller.getAll);
router.get("/:id", authMiddleware, controller.getById);
router.get("/category/:categoryId", authMiddleware, controller.getByCategory);
router.put("/:id", authMiddleware, superAdminMiddleware, controller.update);
router.delete("/:id", authMiddleware, superAdminMiddleware, controller.delete);
module.exports = router;