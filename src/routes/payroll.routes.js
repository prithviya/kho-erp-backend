const express = require("express");
const router = express.Router();

const controller = require("../controllers/payroll.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { requireAnyRole } = require("../middleware/roleAccess.middleware");

router.get("/", authMiddleware, requireAnyRole(["hr", "manager"]), controller.getAll);
router.get("/:id", authMiddleware, requireAnyRole(["hr", "manager"]), controller.getById);
router.post("/", authMiddleware, requireAnyRole(["hr", "manager"]), controller.create);
router.put("/:id", authMiddleware, requireAnyRole(["hr", "manager"]), controller.update);
router.delete("/:id", authMiddleware, requireAnyRole(["hr", "manager"]), controller.delete);

module.exports = router;
