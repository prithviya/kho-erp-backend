const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const asyncHandler = require("../helpers/asyncHandler");
const ApiResponse = require("../helpers/apiResponse");
const projectLibraryService = require("../services/projectLibrary.service");

exports.list = asyncHandler(async (req, res) => {
    const library = await projectLibraryService.list(req.params.projectId, req.user);
    return ApiResponse.success(res, "Project library fetched successfully.", library);
});

exports.createFolder = asyncHandler(async (req, res) => {
    const folder = await projectLibraryService.createFolder(
        req.params.projectId,
        req.body?.name,
        req.user
    );
    return ApiResponse.created(res, "Folder created successfully.", folder);
});

exports.renameFolder = asyncHandler(async (req, res) => {
    const folder = await projectLibraryService.renameFolder(
        req.params.projectId,
        req.params.folderId,
        req.body?.name,
        req.user
    );
    return ApiResponse.success(res, "Folder updated successfully.", folder);
});

exports.deleteFolder = asyncHandler(async (req, res) => {
    await projectLibraryService.deleteFolder(req.params.projectId, req.params.folderId, req.user);
    return ApiResponse.success(res, "Folder deleted successfully.");
});

exports.upload = asyncHandler(async (req, res) => {
    try {
        const files = await projectLibraryService.createFiles(
            req.params.projectId,
            req.body?.folderId,
            req.files || [],
            req.user
        );
        return ApiResponse.created(res, "Files uploaded successfully.", files);
    } catch (error) {
        await Promise.all((req.files || []).map((file) => fs.promises.unlink(file.path).catch((unlinkError) => {
            if (unlinkError.code !== "ENOENT") throw unlinkError;
        })));
        throw error;
    }
});

async function sendContent(res, next, content, asDownload = false) {
    try {
        await fs.promises.access(content.path, fs.constants.R_OK);
    } catch (error) {
        if (error.code === "ENOENT") {
            const notFound = new Error("The requested file is no longer available.");
            notFound.status = 404;
            return next(notFound);
        }
        return next(error);
    }
    res.setHeader("Content-Type", content.mimeType || "application/octet-stream");
    res.setHeader(
        "Content-Disposition",
        `${asDownload ? "attachment" : "inline"}; filename*=UTF-8''${encodeURIComponent(path.basename(content.name))}`
    );
    return res.sendFile(content.path, (error) => {
        if (error && !res.headersSent) next(error);
        else if (error) res.destroy(error);
    });
}

exports.downloadLibraryFile = asyncHandler(async (req, res, next) => {
    const content = await projectLibraryService.getLibraryFile(
        req.params.projectId,
        req.params.fileId,
        req.user
    );
    return sendContent(res, next, content, req.query.download === "1");
});

exports.downloadChatFile = asyncHandler(async (req, res, next) => {
    const content = await projectLibraryService.getChatFile(
        req.params.projectId,
        req.params.messageId,
        req.params.attachmentIndex,
        req.user
    );
    return sendContent(res, next, content, req.query.download === "1");
});

exports.deleteFiles = asyncHandler(async (req, res) => {
    const deletedCount = await projectLibraryService.deleteFiles(
        req.params.projectId,
        req.body?.ids,
        req.user,
        req.body?.chatFiles
    );
    return ApiResponse.success(res, `${deletedCount} file(s) deleted successfully.`, { deletedCount });
});

exports.archiveFiles = asyncHandler(async (req, res, next) => {
    const files = await projectLibraryService.archiveFiles(
        req.params.projectId,
        req.body?.files,
        req.user
    );
    const maxArchiveSize = Number(process.env.PROJECT_LIBRARY_MAX_ARCHIVE_SIZE || 1024 * 1024 * 1024);
    const fileStats = await Promise.all(files.map(async (file) => {
        try {
            return await fs.promises.stat(file.path);
        } catch (error) {
            if (error.code === "ENOENT") {
                const notFound = new Error("One or more selected files are no longer available.");
                notFound.status = 404;
                throw notFound;
            }
            throw error;
        }
    }));
    if (fileStats.reduce((total, stats) => total + stats.size, 0) > maxArchiveSize) {
        const error = new Error("The selected files exceed the maximum ZIP download size.");
        error.status = 413;
        throw error;
    }
    const archive = archiver("zip", { zlib: { level: 6 } });
    const usedNames = new Map();
    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
        "Content-Disposition",
        `attachment; filename="project-${Number(req.params.projectId)}-library.zip"`
    );
    archive.on("error", (error) => {
        if (!res.headersSent) next(error);
        else res.destroy(error);
    });
    archive.pipe(res);
    for (const file of files) {
        const safeName = path.basename(String(file.name || "file")).replace(/[\\/:]/g, "_") || "file";
        const key = safeName.toLowerCase();
        const count = usedNames.get(key) || 0;
        usedNames.set(key, count + 1);
        const extension = path.extname(safeName);
        const basename = path.basename(safeName, extension);
        const archiveName = count ? `${basename} (${count + 1})${extension}` : safeName;
        archive.file(file.path, { name: archiveName });
    }
    await archive.finalize();
});
