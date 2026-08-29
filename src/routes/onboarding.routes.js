const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const router = express.Router();

const controller = require("../controllers/onboarding.controller");

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

router.post("/record", controller.saveRecord);
router.put("/record/:cifid", controller.updateRecordByCifId);
router.get("/record", controller.getAllRecords);
router.get("/record/:cifid", controller.getRecordByCifId);
router.get("/next-employee-id", controller.getNextEmployeeId);
router.post("/upload-document", upload.single("document"), controller.uploadDocument);

router.post("/", controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;