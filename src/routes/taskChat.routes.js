const fs = require("fs");
const path = require("path");
const multer = require("multer");
const router = require("express").Router();
const controller = require("../controllers/taskChat.controller");
const authMiddleware = require("../middleware/auth.middleware");

const uploadDir = path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads"), "task-chat");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({
	storage: multer.diskStorage({
		destination: (_req, _file, callback) => callback(null, uploadDir),
		filename: (_req, file, callback) => {
			const extension = path.extname(file.originalname || "");
			const baseName = path.basename(file.originalname || "attachment", extension)
				.replace(/[^a-zA-Z0-9-_]/g, "-").slice(0, 40);
			callback(null, `${Date.now()}-${baseName}${extension}`);
		}
	}),
	limits: { files: 5, fileSize: Number(process.env.MAX_FILE_SIZE || 5 * 1024 * 1024) }
});

router.get("/:taskId", authMiddleware, controller.listMessages);
router.post("/:taskId", authMiddleware, upload.array("attachments", 5), controller.createMessage);
router.put("/:taskId/messages/:messageId", authMiddleware, upload.array("attachments", 5), controller.updateMessage);
router.delete("/:taskId/messages/:messageId", authMiddleware, controller.deleteMessage);

module.exports = router;
