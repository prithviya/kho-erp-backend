const router = require("express").Router();
const leadController = require("../controllers/lead.controller");
const authMiddleware = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const { createLeadValidation, updateLeadValidation } = require("../validation/lead.validation");

router.get("/", authMiddleware, leadController.getLeads);
router.get("/:id", authMiddleware, leadController.getLeadById);
router.post("/", authMiddleware, createLeadValidation, validate, leadController.createLead);

module.exports = router;