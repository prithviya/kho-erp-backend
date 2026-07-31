const router = require("express").Router();
const controller = require("../controllers/dashboard.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.get("/overview", authMiddleware, controller.getDashboardOverview);

module.exports = router;
