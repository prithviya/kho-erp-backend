const router = require("express").Router();
const departmentController = require("../controllers/department.controller");

// Department CRUD operations
router.post("/departments", departmentController.createDepartment);
router.get("/departments", departmentController.getDepartments);
router.get("/departments/:id", departmentController.getDepartmentById);
router.get("/departments/departid/:departid", departmentController.getDepartmentByDepartId);
router.put("/departments/:id", departmentController.updateDepartment);
router.delete("/departments/:id", departmentController.deleteDepartment);

module.exports = router;