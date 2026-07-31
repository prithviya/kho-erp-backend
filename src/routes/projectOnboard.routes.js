const router = require("express").Router();
const controller = require("../controllers/projectOnboard.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, controller.getProjectOnboards);
router.get("/:id", authMiddleware, controller.getProjectOnboardById);
router.post("/", authMiddleware, controller.createProjectOnboard);
router.put("/:id", authMiddleware, controller.updateProjectOnboard);
router.patch("/:id/assign", authMiddleware, controller.assignProjectOnboard);

module.exports = router;
