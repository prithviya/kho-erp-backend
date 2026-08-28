const express = require("express");
const router = express.Router();

const controller = require("../controllers/onboarding.controller");

router.post("/record", controller.saveRecord);
router.put("/record/:cifid", controller.updateRecordByCifId);
router.get("/record", controller.getAllRecords);
router.get("/record/:cifid", controller.getRecordByCifId);
router.get("/next-employee-id", controller.getNextEmployeeId);

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;