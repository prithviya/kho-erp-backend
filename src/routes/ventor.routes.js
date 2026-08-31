const express = require("express");
const router = express.Router();

const ventorController = require("../controllers/ventor.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { requireAnyRole } = require("../middleware/roleAccess.middleware");

// Create
router.post("/", authMiddleware, requireAnyRole(["manager"]), ventorController.create);

// Get all
router.get("/", authMiddleware, requireAnyRole(["manager"]), ventorController.getAll);

// Get by ID
router.get("/:vid", authMiddleware, requireAnyRole(["manager"]), ventorController.getById);

// Update
router.put("/:vid", authMiddleware, requireAnyRole(["manager"]), ventorController.update);

// Delete
router.delete("/:vid", authMiddleware, requireAnyRole(["manager"]), ventorController.remove);

module.exports = router;