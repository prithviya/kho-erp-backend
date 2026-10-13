const router = require("express").Router();
const controller = require("../controllers/notification.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.use(authMiddleware);
router.get("/", controller.list);
router.patch("/read-all", controller.markAllRead);
router.patch("/:id/read", controller.markRead);

module.exports = router;
