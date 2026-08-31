const router = require("express").Router();
const controller = require("../controllers/projectOnboard.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { requireAnyRole } = require("../middleware/roleAccess.middleware");

router.get("/", authMiddleware, requireAnyRole(["manager"]), controller.getProjectOnboards);
router.get("/:id", authMiddleware, requireAnyRole(["manager"]), controller.getProjectOnboardById);
router.post("/", authMiddleware, requireAnyRole(["manager"]), controller.createProjectOnboard);
router.put("/:id", authMiddleware, requireAnyRole(["manager"]), controller.updateProjectOnboard);
router.patch("/:id/assign", authMiddleware, requireAnyRole(["manager"]), controller.assignProjectOnboard);

module.exports = router;
