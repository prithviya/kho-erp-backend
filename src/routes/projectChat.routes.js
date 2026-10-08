const router = require("express").Router();
const controller = require("../controllers/projectChat.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/:projectId", authMiddleware, controller.listMessages);
router.post("/:projectId", authMiddleware, controller.createMessage);

module.exports = router;
