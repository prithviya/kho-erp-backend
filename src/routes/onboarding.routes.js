const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const router = express.Router();

const controller = require("../controllers/onboarding.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { requireAnyRole } = require("../middleware/roleAccess.middleware");

const uploadDir = path.resolve(
	process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads"),
	"onboarding-documents"
);
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => cb(null, uploadDir),
	filename: (_req, file, cb) => {
		const extension = path.extname(file.originalname || "");
		const baseName = path
			.basename(file.originalname || "document", extension)
			.replace(/[^a-zA-Z0-9-_]/g, "-")
			.slice(0, 60);
		cb(null, `${Date.now()}-${baseName}${extension}`);
	},
});

const upload = multer({
	storage,
	limits: {
		fileSize: Number(process.env.MAX_FILE_SIZE || 5 * 1024 * 1024),
	},
});

router.post("/record", authMiddleware, requireAnyRole(["hr"]), controller.saveRecord);
router.put("/record/:cifid", authMiddleware, requireAnyRole(["hr"]), controller.updateRecordByCifId);
router.put("/record/candidate/:candidateId", authMiddleware, requireAnyRole(["hr"]), controller.updateRecordByCifId);
router.get("/record", authMiddleware, requireAnyRole(["hr"]), controller.getAllRecords);
router.get("/record/employee_code/:employeeCode", authMiddleware, requireAnyRole(["hr"]), controller.getRecordByEmployeeCode);
router.get("/record/employee-code/:employeeCode", authMiddleware, requireAnyRole(["hr"]), controller.getRecordByEmployeeCode);
router.get("/record/:cifid", authMiddleware, requireAnyRole(["hr"]), controller.getRecordByCifId);
router.get("/record/candidate/:candidateId", authMiddleware, requireAnyRole(["hr"]), controller.getRecordByCifId);
router.get("/next-employee-id", authMiddleware, requireAnyRole(["hr"]), controller.getNextEmployeeId);
router.post("/upload-document", authMiddleware, requireAnyRole(["hr"]), upload.single("document"), controller.uploadDocument);

router.post("/", authMiddleware, requireAnyRole(["hr"]), controller.create);
router.get("/", authMiddleware, requireAnyRole(["hr"]), controller.getAll);
router.get("/:id", authMiddleware, requireAnyRole(["hr"]), controller.getById);
router.put("/:id", authMiddleware, requireAnyRole(["hr"]), controller.update);
router.delete("/:id", authMiddleware, requireAnyRole(["hr"]), controller.delete);

module.exports = router;