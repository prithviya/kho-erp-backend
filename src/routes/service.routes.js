const router = require("express").Router();
const serviceController = require("../controllers/service.controller");

// Service CRUD operations
router.post("/services", serviceController.createService);
router.get("/services", serviceController.getServices);
router.get("/services/:id", serviceController.getServiceById);
router.get("/services/serviceid/:serviceid", serviceController.getServiceByServiceId);
router.get("/services/department/:departmentId", serviceController.getServicesByDepartment);
router.get("/services/active", serviceController.getActiveServices);
router.get("/services/category/:category", serviceController.getServicesByCategory);
router.put("/services/:id", serviceController.updateService);
router.patch("/services/:id/status", serviceController.updateServiceStatus);
router.delete("/services/:id", serviceController.deleteService);

module.exports = router;