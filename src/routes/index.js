const router = require("express").Router();

router.use("/auth", require("./auth.routes"));
router.use("/roles", require("./role.routes"));
router.use("/permissions", require("./permission.routes"));
router.use("/modules", require("./module.routes"));
router.use("/users", require("./user.routes"));
router.use("/user-roles", require("./userRole.routes"));

module.exports = router; 