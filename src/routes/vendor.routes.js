const express = require("express");
const router = express.Router();

const vendorController = require("../controllers/vendor.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { requireAnyRole } = require("../middleware/roleAccess.middleware");

router.use(authMiddleware, requireAnyRole(["super_admin"]));

router.post("/", vendorController.create);
router.get("/", vendorController.getAll);
router.get("/:id", vendorController.getById);
router.put("/:id", vendorController.update);
router.delete("/:id", vendorController.delete);

module.exports = router;