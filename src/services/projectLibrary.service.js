const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");
const {
    ProjectOnboard,
    ProjectAssignment,
    ProjectLibraryFolder,
    ProjectLibraryFile,
    Task,
    TaskChatMessage
} = require("../model");

const LIBRARY_ROOT = path.resolve(
    process.env.PROJECT_LIBRARY_DIR || path.join(__dirname, "../../private/project-library")
);
const UPLOADS_ROOT = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, "../../uploads"));

function ids(value) {
    if (Array.isArray(value)) return value.map(Number).filter((id) => Number.isFinite(id) && id > 0);
    if (typeof value !== "string") return [];
    try {
        return ids(JSON.parse(value));
    } catch {
        return [];
    }
}

function projectMemberIds(project) {
    return [...new Set([
        ...ids(project.spocIds),
        ...ids(project.projectManagerIds),
        ...ids(project.assignedToIds),
        Number(project.reportingHeadId),
        ...(project.assignments || []).flatMap((assignment) => [
            Number(assignment.assignedToId),
            Number(assignment.reportingHeadId)
        ])
    ].filter((id) => Number.isFinite(id) && id > 0))];
}

function hasLibraryAdminAccess(actor) {
    return actor.isSuperAdmin
        || actor.roleSet?.has("manager")
        || actor.roleSet?.has("admin")
        || actor.roleSet?.has("administrator")
        || actor.roleSet?.has("systemadmin");
}

function fail(message, status = 400) {
    const error = new Error(message);
    error.status = status;
    throw error;
}

function parseAttachments(value) {
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") return [value];
    if (typeof value !== "string") return [];
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : parsed && typeof parsed === "object" ? [parsed] : [];
    } catch {
        return [];
    }
}

function safeFileName(value) {
    const name = path.basename(String(value || ""));
    if (!name || name === "." || name === "..") fail("Attachment path is invalid.", 404);
    return name;
}

class ProjectLibraryService {
    async getProject(projectId, actor) {
        const id = Number(projectId);
        if (!Number.isInteger(id) || id < 1) fail("Project id is invalid.");

        const project = await ProjectOnboard.findByPk(id, {
            include: [{
                model: ProjectAssignment,
                as: "assignments",
                required: false,
                attributes: ["assignedToId", "reportingHeadId"]
            }]
        });
        if (!project) fail("Project not found.", 404);

        const canAccess = hasLibraryAdminAccess(actor)
            || projectMemberIds(project).includes(Number(actor.id));
        if (!canAccess) fail("You do not have access to this project library.", 403);
        return project;
    }

    async list(projectId, actor) {
        await this.getProject(projectId, actor);
        const [folders, files, tasks] = await Promise.all([
            ProjectLibraryFolder.findAll({
                where: { projectOnboardId: Number(projectId) },
                order: [["name", "ASC"]]
            }),
            ProjectLibraryFile.findAll({
                where: { projectOnboardId: Number(projectId) },
                order: [["createdAt", "DESC"]]
            }),
            Task.findAll({
                where: { projectOnboardId: Number(projectId) },
                attributes: ["id"]
            })
        ]);
        const taskIds = tasks.map((task) => task.id);
        const messages = taskIds.length ? await TaskChatMessage.findAll({
            where: { taskId: { [Op.in]: taskIds } },
            attributes: ["id", "taskId", "senderId", "attachments", "createdAt"],
            order: [["createdAt", "DESC"]]
        }) : [];

        const chatFiles = messages.flatMap((message) => parseAttachments(message.attachments)
            .map((attachment, attachmentIndex) => ({
                type: "chat",
                id: `chat-${message.id}-${attachmentIndex}`,
                messageId: message.id,
                attachmentIndex,
                folderId: null,
                name: attachment.name || "Task chat attachment",
                mimeType: attachment.mimeType || "application/octet-stream",
                size: Number(attachment.size) || 0,
                createdAt: message.createdAt,
                deletable: actor.isSuperAdmin
                    || actor.roleSet?.has("manager")
                    || Number(message.senderId) === Number(actor.id)
            })));

        return {
            folders: folders.map((folder) => folder.toJSON()),
            files: [
                ...files.map((file) => ({
                    ...file.toJSON(),
                    type: "library",
                    name: file.originalName,
                    deletable: actor.isSuperAdmin
                        || actor.roleSet?.has("manager")
                        || Number(file.uploadedBy) === Number(actor.id)
                })),
                ...chatFiles
            ]
        };
    }

    async createFolder(projectId, name, actor) {
        await this.getProject(projectId, actor);
        const normalizedName = String(name || "").trim();
        if (!normalizedName || normalizedName.length > 120) {
            fail("Folder name must be between 1 and 120 characters.");
        }
        const existingFolders = await ProjectLibraryFolder.findAll({
            where: { projectOnboardId: Number(projectId) },
            attributes: ["name"]
        });
        if (existingFolders.some((folder) => folder.name.toLowerCase() === normalizedName.toLowerCase())) {
            fail("A folder with this name already exists.", 409);
        }
        return ProjectLibraryFolder.create({
            projectOnboardId: Number(projectId),
            name: normalizedName,
            createdBy: Number(actor.id)
        });
    }

    async renameFolder(projectId, folderId, name, actor) {
        await this.getProject(projectId, actor);
        const folder = await ProjectLibraryFolder.findOne({
            where: { id: Number(folderId), projectOnboardId: Number(projectId) }
        });
        if (!folder) fail("Folder not found.", 404);
        const normalizedName = String(name || "").trim();
        if (!normalizedName || normalizedName.length > 120) {
            fail("Folder name must be between 1 and 120 characters.");
        }
        const existing = await ProjectLibraryFolder.findAll({
            where: { projectOnboardId: Number(projectId), id: { [Op.ne]: folder.id } },
            attributes: ["name"]
        });
        if (existing.some((item) => item.name.toLowerCase() === normalizedName.toLowerCase())) {
            fail("A folder with this name already exists.", 409);
        }
        folder.name = normalizedName;
        await folder.save();
        return folder;
    }

    async deleteFolder(projectId, folderId, actor) {
        await this.getProject(projectId, actor);
        const folder = await ProjectLibraryFolder.findOne({
            where: { id: Number(folderId), projectOnboardId: Number(projectId) }
        });
        if (!folder) fail("Folder not found.", 404);
        const fileCount = await ProjectLibraryFile.count({ where: { folderId: folder.id } });
        if (fileCount) fail("Move or delete this folder's files before deleting the folder.", 409);
        await folder.destroy();
    }

    async createFiles(projectId, folderId, files, actor) {
        await this.getProject(projectId, actor);
        const normalizedFolderId = folderId ? Number(folderId) : null;
        if (normalizedFolderId) {
            const folder = await ProjectLibraryFolder.findOne({
                where: { id: normalizedFolderId, projectOnboardId: Number(projectId) }
            });
            if (!folder) fail("Selected folder does not belong to this project.", 400);
        }
        if (!files.length) fail("Select at least one file to upload.");

        return ProjectLibraryFile.bulkCreate(files.map((file) => ({
            projectOnboardId: Number(projectId),
            folderId: normalizedFolderId,
            originalName: path.basename(file.originalname).slice(0, 255),
            storedName: file.filename,
            mimeType: file.mimetype,
            size: file.size,
            uploadedBy: Number(actor.id)
        })));
    }

    libraryFilePath(projectId, storedName) {
        const fileName = safeFileName(storedName);
        return path.join(LIBRARY_ROOT, String(Number(projectId)), fileName);
    }

    async getLibraryFile(projectId, fileId, actor) {
        await this.getProject(projectId, actor);
        const file = await ProjectLibraryFile.findOne({
            where: { id: Number(fileId), projectOnboardId: Number(projectId) }
        });
        if (!file) fail("Library file not found.", 404);
        return {
            path: this.libraryFilePath(projectId, file.storedName),
            name: file.originalName,
            mimeType: file.mimeType
        };
    }

    async getChatFile(projectId, messageId, attachmentIndex, actor) {
        await this.getProject(projectId, actor);
        const tasks = await Task.findAll({
            where: { projectOnboardId: Number(projectId) },
            attributes: ["id"]
        });
        if (!tasks.length) fail("Attachment not found.", 404);
        const message = await TaskChatMessage.findOne({
            where: {
                id: Number(messageId),
                taskId: { [Op.in]: tasks.map((task) => task.id) }
            },
            attributes: ["id", "attachments"]
        });
        const attachment = parseAttachments(message?.attachments)[Number(attachmentIndex)];
        if (!attachment?.url) fail("Attachment not found.", 404);
        const pathname = new URL(attachment.url, "http://localhost").pathname;
        if (!pathname.startsWith("/uploads/task-chat/")) fail("Attachment path is invalid.", 404);
        const pathParts = pathname.slice("/uploads/task-chat/".length).split("/");
        const projectScopedPath = pathParts.length === 2
            && Number(pathParts[0]) === Number(projectId);
        if (pathParts.length !== 1 && !projectScopedPath) fail("Attachment path is invalid.", 404);
        const fileName = safeFileName(projectScopedPath ? pathParts[1] : pathParts[0]);
        const roots = [...new Set([
            UPLOADS_ROOT,
            path.resolve(__dirname, "../../uploads"),
            path.resolve(process.cwd(), "uploads")
        ])];
        const candidates = roots.flatMap((root) => [
            ...(projectScopedPath ? [path.join(root, "task-chat", String(Number(projectId)), fileName)] : []),
            path.join(root, "task-chat", fileName)
        ]);
        const resolvedPath = candidates.find((candidate) => fs.existsSync(candidate)) || candidates[0];
        return {
            path: resolvedPath,
            name: attachment.name || "Task chat attachment",
            mimeType: attachment.mimeType || "application/octet-stream",
            size: Number(attachment.size) || 0
        };
    }

    async deleteChatFiles(projectId, chatFiles, actor) {
        const tasks = await Task.findAll({
            where: { projectOnboardId: Number(projectId) },
            attributes: ["id"]
        });
        const taskIds = tasks.map((task) => task.id);
        const byMessage = new Map();
        for (const item of chatFiles) {
            const messageId = Number(item?.messageId);
            const index = Number(item?.attachmentIndex);
            if (!Number.isInteger(messageId) || !Number.isInteger(index) || index < 0) fail("Invalid attachment selected.");
            if (!byMessage.has(messageId)) byMessage.set(messageId, new Set());
            byMessage.get(messageId).add(index);
        }
        let deleted = 0;
        for (const [messageId, indexes] of byMessage) {
            const message = taskIds.length ? await TaskChatMessage.findOne({
                where: { id: messageId, taskId: { [Op.in]: taskIds } }
            }) : null;
            if (!message) fail("Attachment not found.", 404);
            const allowed = actor.isSuperAdmin
                || actor.roleSet?.has("manager")
                || Number(message.senderId) === Number(actor.id);
            if (!allowed) fail("You can only delete attachments you uploaded.", 403);
            const attachments = parseAttachments(message.attachments);
            const removed = attachments.filter((_, index) => indexes.has(index));
            if (removed.length !== indexes.size) fail("Attachment not found.", 404);
            message.attachments = attachments.filter((_, index) => !indexes.has(index));
            await message.save();
            for (const attachment of removed) {
                try {
                    const pathname = new URL(attachment.url, "http://localhost").pathname;
                    if (!pathname.startsWith("/uploads/task-chat/")) continue;
                    const parts = pathname.slice("/uploads/task-chat/".length).split("/");
                    const fileName = safeFileName(parts[parts.length - 1]);
                    const scoped = parts.length === 2 && Number(parts[0]) === Number(projectId);
                    if (parts.length !== 1 && !scoped) continue;
                    const target = scoped
                        ? path.join(UPLOADS_ROOT, "task-chat", String(Number(projectId)), fileName)
                        : path.join(UPLOADS_ROOT, "task-chat", fileName);
                    await fs.promises.unlink(target);
                } catch (error) {
                    if (error.code !== "ENOENT") console.error("Chat attachment cleanup failed:", error.message);
                }
                deleted += 1;
            }
        }
        return deleted;
    }

    async deleteFiles(projectId, fileIds, actor, chatFiles = []) {
        await this.getProject(projectId, actor);
        const chatList = Array.isArray(chatFiles) ? chatFiles : [];
        const idsToDelete = [...new Set((Array.isArray(fileIds) ? fileIds : []).map(Number))];
        if ((!idsToDelete.length && !chatList.length) || idsToDelete.some((id) => !Number.isInteger(id) || id < 1)) {
            fail("Select one or more valid library files.");
        }
        if (idsToDelete.length + chatList.length > 100) fail("You can delete at most 100 files at a time.");
        const chatDeleted = chatList.length ? await this.deleteChatFiles(projectId, chatList, actor) : 0;
        if (!idsToDelete.length) return chatDeleted;
        const files = await ProjectLibraryFile.findAll({
            where: { id: { [Op.in]: idsToDelete }, projectOnboardId: Number(projectId) }
        });
        if (files.length !== idsToDelete.length) fail("One or more selected library files were not found.", 404);
        const canDeleteAll = files.every((file) => actor.isSuperAdmin
            || actor.roleSet?.has("manager")
            || Number(file.uploadedBy) === Number(actor.id));
        if (!canDeleteAll) fail("You can only delete files you uploaded.", 403);

        for (const file of files) {
            try {
                await fs.promises.unlink(this.libraryFilePath(projectId, file.storedName));
            } catch (error) {
                if (error.code !== "ENOENT") throw error;
            }
            await file.destroy();
        }
        return files.length + chatDeleted;
    }

    async archiveFiles(projectId, selections, actor) {
        await this.getProject(projectId, actor);
        if (!Array.isArray(selections) || !selections.length || selections.length > 100) {
            fail("Select between 1 and 100 files to download.");
        }
        const result = [];
        for (const selection of selections) {
            let file;
            if (selection?.type === "library") {
                file = await ProjectLibraryFile.findOne({
                    where: { id: Number(selection.id), projectOnboardId: Number(projectId) }
                });
                if (!file) fail("One or more selected library files were not found.", 404);
                result.push({
                    path: this.libraryFilePath(projectId, file.storedName),
                    name: file.originalName,
                    size: Number(file.size) || 0
                });
            } else if (selection?.type === "chat") {
                const content = await this.getChatFile(
                    projectId,
                    selection.messageId,
                    selection.attachmentIndex,
                    actor
                );
                result.push(content);
            } else {
                fail("A selected file type is invalid.");
            }
        }
        return result;
    }
}

module.exports = new ProjectLibraryService();
