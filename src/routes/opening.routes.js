const express = require("express");
const router = express.Router();
const openingController = require("../controllers/opening.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { requireAnyRole } = require("../middleware/roleAccess.middleware");

router.post("/", authMiddleware, requireAnyRole(["hr"]), openingController.create);
router.get("/", authMiddleware, requireAnyRole(["hr"]), openingController.getAll);
router.get("/:id", authMiddleware, requireAnyRole(["hr"]), openingController.getById);
router.put("/:id", authMiddleware, requireAnyRole(["hr"]), openingController.update);
router.patch("/:id/status", authMiddleware, requireAnyRole(["hr"]), openingController.updateStatus);
router.delete("/:id", authMiddleware, requireAnyRole(["hr"]), openingController.delete);

module.exports = router;