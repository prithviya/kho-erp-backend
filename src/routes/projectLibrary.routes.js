const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const router = require("express").Router();
const asyncHandler = require("../helpers/asyncHandler");
const authMiddleware = require("../middleware/auth.middleware");
const projectLibraryService = require("../services/projectLibrary.service");
const controller = require("../controllers/projectLibrary.controller");

const libraryRoot = path.resolve(
    process.env.PROJECT_LIBRARY_DIR || path.join(__dirname, "../../private/project-library")
);
const maxFileSize = Number(process.env.PROJECT_LIBRARY_MAX_FILE_SIZE || 100 * 1024 * 1024);
const allowedFile = (file) => file.mimetype === "application/pdf"
    || (file.mimetype.startsWith("image/") && file.mimetype !== "image/svg+xml")
    || file.mimetype.startsWith("video/");

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, _file, callback) => {
            const destination = path.join(libraryRoot, String(Number(req.params.projectId)));
            fs.mkdir(destination, { recursive: true }, (error) => callback(error, destination));
        },
        filename: (_req, file, callback) => {
            const extension = path.extname(file.originalname || "").toLowerCase().slice(0, 12);
            callback(null, `${crypto.randomUUID()}${extension}`);
        }
    }),
    fileFilter: (_req, file, callback) => {
        if (!allowedFile(file)) return callback(new Error("Only images, videos, and PDF files are supported."));
        return callback(null, true);
    },
    limits: { files: 10, fileSize: maxFileSize }
});

const authorizeProjectUpload = asyncHandler(async (req, _res, next) => {
    await projectLibraryService.getProject(req.params.projectId, req.user);
    next();
});

router.get("/:projectId", authMiddleware, controller.list);
router.post("/:projectId/folders", authMiddleware, controller.createFolder);
router.put("/:projectId/folders/:folderId", authMiddleware, controller.renameFolder);
router.delete("/:projectId/folders/:folderId", authMiddleware, controller.deleteFolder);
router.post(
    "/:projectId/files",
    authMiddleware,
    authorizeProjectUpload,
    upload.array("files", 10),
    controller.upload
);
router.get("/:projectId/files/:fileId/content", authMiddleware, controller.downloadLibraryFile);
router.get(
    "/:projectId/chat-files/:messageId/:attachmentIndex/content",
    authMiddleware,
    controller.downloadChatFile
);
router.post("/:projectId/files/archive", authMiddleware, controller.archiveFiles);
router.delete("/:projectId/files", authMiddleware, controller.deleteFiles);

module.exports = router;
