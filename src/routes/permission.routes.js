const router = require("express").Router();

const permissionController = require("../controllers/permission.controller");

router.post("/", permissionController.createPermission);
router.get("/", permissionController.getPermissions);
router.get("/:id", permissionController.getPermission);
router.put("/:id", permissionController.updatePermission);
router.delete("/:id", permissionController.deletePermission);

module.exports = router;