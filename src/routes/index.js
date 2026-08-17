const router = require("express").Router();
router.use("/auth", require("./auth.routes"));
router.use("/roles", require("./role.routes"));
router.use("/permissions", require("./permission.routes"));

router.use("/modules", require("./module.routes"));
router.use("/users", require("./user.routes"));
router.use("/user-roles", require("./userRole.routes"));
router.use("/lead-sources", require("./leadSource.routes"));
router.use("/lead-statuses", require("./leadStatus.routes"));

router.use("/services", require("./service.routes"));
router.use("/departments", require("./department.routes"));
router.use("/service-categories", require("./serviceCategory.routes"));

router.use("/lead",require("./lead.routes"));

router.use("/openings", require ("./opening.routes"));
router.use("/cif-personals", require("./cifPersonal.routes"));
router.use("/cif-academics", require("./cifAcademic.routes"));
router.use("/cif-experiences", require("./cifExperience.routes"));
router.use("/cif-languages", require("./cifLanguage.routes"));
router.use("/cif-references", require("./cifReference.routes"));
router.use("/cif-skills",require("./cifSkill.routes"));
router.use("/cif-software",require("./cifSoftware.routes"));
router.use("/cif-submissions", require("./cifSubmission.routes"));

router.use("/project-onboards", require("./projectOnboard.routes"));
router.use("/dashboard", require("./dashboard.routes"));
router.use("/employees", require("./employee.routes"));

router.use("/onboardings", require("./onboarding.routes"));
module.exports = router; 
