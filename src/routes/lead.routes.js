const router = require("express").Router();
const leadController = require("../controllers/lead.controller");
const authMiddleware = require("../middleware/auth.middleware");
const superAdminMiddleware = require("../middleware/superAdmin.middleware");
const validate = require("../middleware/validate.middleware");
const { createLeadValidation, updateLeadValidation } = require("../validation/lead.validation");

router.get("/", authMiddleware, leadController.getLeads);
router.get("/:id", authMiddleware, leadController.getLeadById);
router.post("/", authMiddleware, createLeadValidation, validate, leadController.createLead);
router.put("/:id", authMiddleware, updateLeadValidation, validate, leadController.updateLead);
router.delete("/:id", authMiddleware, superAdminMiddleware, leadController.deleteLead);

module.exports = router;