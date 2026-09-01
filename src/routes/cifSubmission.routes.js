const express = require("express");
const controller = require("../controllers/cifSubmission.controller");
const cifResumeUpload = require("../middleware/cifResumeUpload");
const authMiddleware = require("../middleware/auth.middleware");
const { requireAnyRole } = require("../middleware/roleAccess.middleware");

const router = express.Router();

// Routes
router.post("/", cifResumeUpload, controller.create);

router.get("/", authMiddleware, requireAnyRole(["hr"]), controller.getAllSubmissions);
router.get("/:cifid", authMiddleware, requireAnyRole(["hr"]), controller.getSubmissionById);
router.patch("/:cifid/status", authMiddleware, requireAnyRole(["hr"]), controller.updateSubmissionStatus);

module.exports = router;