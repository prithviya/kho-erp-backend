const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const router = require("express").Router();
const controller = require("../controllers/taskChat.controller");
const authMiddleware = require("../middleware/auth.middleware");
const asyncHandler = require("../helpers/asyncHandler");
const taskChatService = require("../services/taskChat.service");

const uploadsRoot = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, "../../uploads"));
const authorizeTaskChat = asyncHandler(async (req, _res, next) => {
	const task = await taskChatService.getTask(req.params.taskId, req.user);
	req.taskProjectId = Number(task.projectOnboardId);
	next();
});
const upload = multer({
	storage: multer.diskStorage({
		destination: (req, _file, callback) => {
			const uploadDir = path.join(uploadsRoot, "task-chat", String(req.taskProjectId));
			fs.mkdir(uploadDir, { recursive: true }, (error) => callback(error, uploadDir));
		},
		filename: (_req, file, callback) => {
			const extension = path.extname(file.originalname || "");
			const baseName = path.basename(file.originalname || "attachment", extension)
				.replace(/[^a-zA-Z0-9-_]/g, "-").slice(0, 40);
			callback(null, `${crypto.randomUUID()}-${baseName}${extension}`);
		}
	}),
	limits: { files: 5, fileSize: Number(process.env.MAX_FILE_SIZE || 5 * 1024 * 1024) }
});

router.get("/:taskId", authMiddleware, controller.listMessages);
router.post("/:taskId", authMiddleware, authorizeTaskChat, upload.array("attachments", 5), controller.createMessage);
router.put("/:taskId/messages/:messageId", authMiddleware, authorizeTaskChat, upload.array("attachments", 5), controller.updateMessage);
router.delete("/:taskId/messages/:messageId", authMiddleware, controller.deleteMessage);

module.exports = router;
