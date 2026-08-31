const express = require("express");
const router = express.Router();

const departmentController = require("../controllers/department.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { requireAnyRole } = require("../middleware/roleAccess.middleware");

router.use(authMiddleware, requireAnyRole(["super_admin"]));

router.post("/", departmentController.create);
router.get("/", departmentController.getAll);
router.get("/:id", departmentController.getById);
router.put("/:id", departmentController.update);
router.delete("/:id", departmentController.delete);

module.exports = router;