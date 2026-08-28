const express = require("express");
const router = express.Router();

const ventorController = require("../controllers/ventor.controller");

// Create
router.post("/", ventorController.create);

// Get all
router.get("/", ventorController.getAll);

// Get by ID
router.get("/:vid", ventorController.getById);

// Update
router.put("/:vid", ventorController.update);

// Delete
router.delete("/:vid", ventorController.remove);

module.exports = router;