const router = require("express").Router();
const controller = require("../controllers/commonWall.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/announcement-count", authMiddleware, controller.getAnnouncementCount);
router.get("/", authMiddleware, controller.getOverview);

module.exports = router;
