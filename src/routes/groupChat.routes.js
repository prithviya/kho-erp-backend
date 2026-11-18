const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const router = require("express").Router();
const controller = require("../controllers/groupChat.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { requireAnyRole } = require("../middleware/roleAccess.middleware");
const asyncHandler = require("../helpers/asyncHandler");
const groupChatService = require("../services/groupChat.service");

const uploadsRoot = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, "../../uploads"));
const imageDirectory = path.join(uploadsRoot, "group-chat", "images");
const attachmentExtension = /\.(jpe?g|png|webp|docx?|pdf)$/i;
const imageExtension = /\.(jpe?g|png|webp)$/i;
const allowedMimeTypes = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/pdf",
    "application/octet-stream",
]);

const storage = multer.diskStorage({
    destination: (req, _file, callback) => {
        const directory = req.params.groupId
            ? path.join(uploadsRoot, "group-chat", String(Number(req.params.groupId)))
            : imageDirectory;
        fs.mkdir(directory, { recursive: true }, (error) => callback(error, directory));
    },
    filename: (_req, file, callback) => {
        const extension = path.extname(file.originalname || "").toLowerCase();
        callback(null, `${crypto.randomUUID()}${extension}`);
    },
});
const upload = multer({
    storage,
    limits: {
        files: 5,
        fileSize: Number(process.env.GROUP_CHAT_MAX_FILE_SIZE || 10 * 1024 * 1024),
    },
    fileFilter: (_req, file, callback) => {
        if (!attachmentExtension.test(file.originalname || "") || !allowedMimeTypes.has(file.mimetype)) {
            const error = new Error("Only JPG, PNG, WEBP, DOC, DOCX, and PDF files are allowed.");
            error.status = 400;
            return callback(error);
        }
        return callback(null, true);
    },
});
const uploadImage = multer({
    storage,
    limits: { files: 1, fileSize: Number(process.env.GROUP_CHAT_IMAGE_MAX_FILE_SIZE || 5 * 1024 * 1024) },
    fileFilter: (_req, file, callback) => {
        if (!imageExtension.test(file.originalname || "") || !["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
            const error = new Error("Group images must be JPG, PNG, or WEBP files.");
            error.status = 400;
            return callback(error);
        }
        return callback(null, true);
    },
});

const handleUpload = (handler) => (req, res, next) => {
    handler(req, res, (error) => {
        if (error instanceof multer.MulterError) {
            error.status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
        }
        next(error);
    });
};

const authorizeGroupAccess = asyncHandler(async (req, _res, next) => {
    await groupChatService.requireAccess(req.params.groupId, req.user);
    next();
});

router.get("/", authMiddleware, controller.listGroups);
router.get("/member-options", authMiddleware, requireAnyRole(["manager"]), controller.listMemberOptions);
router.post("/", authMiddleware, requireAnyRole(["manager"]), handleUpload(uploadImage.single("profileImage")), controller.createGroup);
router.get("/:groupId/messages", authMiddleware, authorizeGroupAccess, controller.listMessages);
router.post("/:groupId/messages", authMiddleware, authorizeGroupAccess, handleUpload(upload.array("attachments", 5)), controller.createMessage);
router.get("/:groupId/attachments/:fileName", authMiddleware, authorizeGroupAccess, controller.downloadAttachment);
router.post("/:groupId/members", authMiddleware, requireAnyRole(["manager"]), authorizeGroupAccess, controller.addMembers);
router.delete("/:groupId/members/:userId", authMiddleware, requireAnyRole(["manager"]), authorizeGroupAccess, controller.removeMember);
router.put("/:groupId/profile-image", authMiddleware, requireAnyRole(["manager"]), authorizeGroupAccess, handleUpload(uploadImage.single("profileImage")), controller.updateProfileImage);
router.delete("/:groupId", authMiddleware, requireAnyRole(["manager"]), authorizeGroupAccess, controller.deleteGroup);

module.exports = router;
