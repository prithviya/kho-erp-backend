const express = require("express");
const controller = require("../controllers/cifSubmission.controller");

const router = express.Router();

// Routes
router.post("/", controller.create);
router.get("/", controller.getAllSubmissions);
router.get("/:cifid", controller.getSubmissionById);
router.patch("/:cifid/status", controller.updateSubmissionStatus);

module.exports = router;