const router = require("express").Router();
const authMiddleware = require("../middleware/auth.middleware");
const { requireAnyRole } = require("../middleware/roleAccess.middleware");
const controller = require("../controllers/activityLog.controller");

router.use(authMiddleware, requireAnyRole(["manager"]));
router.get("/", controller.list);
router.get("/filters", controller.filterOptions);
router.get("/export", controller.exportExcel);

module.exports = router;
