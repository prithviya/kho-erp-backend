const router = require("express").Router();

router.use("/auth", require("./auth.routes"));
router.use("/roles", require("./role.routes"));
router.use("/permissions", require("./permission.routes"));
router.use("/modules", require("./module.routes"));

module.exports = router; 