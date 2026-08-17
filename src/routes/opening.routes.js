const express = require("express");
const router = express.Router();
const openingController = require("../controllers/opening.controller");

router.post("/", openingController.create);
router.get("/", openingController.getAll);
router.get("/:id", openingController.getById);
router.put("/:id", openingController.update);
router.patch("/:id/status", openingController.updateStatus); // ✅ ADD THIS ROUTE
router.delete("/:id", openingController.delete);

module.exports = router;