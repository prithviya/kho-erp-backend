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
router.use("/lead",require("./lead.routes"))
router.use("/project-onboards", require("./projectOnboard.routes"));
router.use("/dashboard", require("./dashboard.routes"));
router.use("/employees", require("./employee.routes"));
module.exports = router; 