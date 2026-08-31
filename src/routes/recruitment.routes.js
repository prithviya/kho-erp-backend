const express = require("express");
const router = express.Router();
const controller = require("../controllers/recruitment.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { requireAnyRole } = require("../middleware/roleAccess.middleware");

router.post("/", authMiddleware, requireAnyRole(["hr"]), controller.create);
router.get("/", authMiddleware, requireAnyRole(["hr"]), controller.getAll);
router.get("/cif/:cifid", authMiddleware, requireAnyRole(["hr"]), controller.getByCifId);
router.get("/:id", authMiddleware, requireAnyRole(["hr"]), controller.getById);
router.put("/:id", authMiddleware, requireAnyRole(["hr"]), controller.update);
router.delete("/:id", authMiddleware, requireAnyRole(["hr"]), controller.delete);

module.exports = router;
