const express = require("express");
const router = express.Router();

const controller = require("../controllers/leave.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { requireAnyRole } = require("../middleware/roleAccess.middleware");
const validate = require("../middleware/validate.middleware");
const {
	createLeaveRequestValidation,
	updateLeaveRequestValidation,
	updateLeaveStatusValidation,
} = require("../validation/leave.validation");

router.get("/categories", authMiddleware, controller.getCategories);
router.post("/categories", authMiddleware, requireAnyRole(["hr"]), controller.createCategory);
router.put("/categories/:id", authMiddleware, requireAnyRole(["hr"]), controller.updateCategory);

router.get("/summary", authMiddleware, controller.getSummary);

router.get("/requests", authMiddleware, controller.getRequests);
router.get("/requests/:id", authMiddleware, controller.getRequestById);
router.post("/requests", authMiddleware, createLeaveRequestValidation, validate, controller.createRequest);
router.put("/requests/:id", authMiddleware, updateLeaveRequestValidation, validate, controller.updateRequest);
router.patch(
	"/requests/:id/status",
	authMiddleware,
	requireAnyRole(["hr", "manager"]),
	updateLeaveStatusValidation,
	validate,
	controller.updateRequestStatus
);
router.delete("/requests/:id", authMiddleware, controller.deleteRequest);

module.exports = router;
