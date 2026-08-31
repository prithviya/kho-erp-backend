const fs = require("fs");
const path = require("path");
const multer = require("multer");
const router = require("express").Router();
const controller = require("../controllers/employee.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { requireAnyRole } = require("../middleware/roleAccess.middleware");

const uploadDir = path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads"));
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
        const extension = path.extname(file.originalname || "");
        const baseName = path.basename(file.originalname || "resume", extension)
            .replace(/[^a-zA-Z0-9-_]/g, "-")
            .slice(0, 40);
        cb(null, `${Date.now()}-${baseName}${extension}`);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: Number(process.env.MAX_FILE_SIZE || 5 * 1024 * 1024)
    }
});

router.get("/", authMiddleware, requireAnyRole(["hr"]), controller.getEmployees);
router.get("/:id", authMiddleware, requireAnyRole(["hr"]), controller.getEmployeeById);
router.post("/", authMiddleware, requireAnyRole(["hr"]), upload.single("resume"), controller.createEmployee);
router.put("/:id", authMiddleware, requireAnyRole(["hr"]), upload.single("resume"), controller.updateEmployee);

module.exports = router;