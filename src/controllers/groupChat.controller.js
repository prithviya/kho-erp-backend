const fs = require("fs");
const asyncHandler = require("../helpers/asyncHandler");
const ApiResponse = require("../helpers/apiResponse");
const groupChatService = require("../services/groupChat.service");

function parseMemberIds(value) {
    if (typeof value !== "string") return value;
    try {
        return JSON.parse(value);
    } catch {
        const error = new Error("Member IDs must be a JSON array.");
        error.status = 400;
        throw error;
    }
}

async function removeUploadedFiles(files = []) {
    await Promise.all(files.map((file) => fs.promises.unlink(file.path).catch((error) => {
        if (error.code !== "ENOENT") throw error;
    })));
}

exports.listGroups = asyncHandler(async (req, res) => {
    const groups = await groupChatService.listGroups(req.user);
    return ApiResponse.success(res, "Group chats fetched successfully.", groups);
});

exports.listMemberOptions = asyncHandler(async (req, res) => {
    const users = await groupChatService.listMemberOptions(req.user);
    return ApiResponse.success(res, "Group member options fetched successfully.", users);
});

exports.createGroup = asyncHandler(async (req, res) => {
    try {
        const group = await groupChatService.createGroup({
            ...req.body,
            memberIds: parseMemberIds(req.body?.memberIds),
            profileImage: req.file ? `/uploads/group-chat/images/${req.file.filename}` : null,
        }, req.user);
        return ApiResponse.created(res, "Group created successfully.", group);
    } catch (error) {
        await removeUploadedFiles(req.file ? [req.file] : []);
        throw error;
    }
});

exports.listMessages = asyncHandler(async (req, res) => {
    const messages = await groupChatService.listMessages(req.params.groupId, req.user);
    return ApiResponse.success(res, "Group chat messages fetched successfully.", messages);
});

exports.createMessage = asyncHandler(async (req, res) => {
    const attachments = (req.files || []).map((file) => ({
        id: file.filename,
        name: file.originalname,
        storedName: file.filename,
        url: `/api/group-chat/${Number(req.params.groupId)}/attachments/${encodeURIComponent(file.filename)}`,
        mimeType: file.mimetype,
        size: file.size,
    }));
    try {
        const message = await groupChatService.createMessage(
            req.params.groupId,
            { ...req.body, attachments },
            req.user
        );
        return ApiResponse.created(res, "Group chat message sent successfully.", message);
    } catch (error) {
        await removeUploadedFiles(req.files || []);
        throw error;
    }
});

exports.addMembers = asyncHandler(async (req, res) => {
    const group = await groupChatService.addMembers(
        req.params.groupId,
        parseMemberIds(req.body?.memberIds),
        req.user
    );
    return ApiResponse.success(res, "Group members added successfully.", group);
});

exports.removeMember = asyncHandler(async (req, res) => {
    const group = await groupChatService.removeMember(req.params.groupId, req.params.userId, req.user);
    return ApiResponse.success(res, "Group member removed successfully.", group);
});

exports.updateProfileImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        const error = new Error("A group image is required.");
        error.status = 400;
        throw error;
    }
    try {
        const profileImage = `/uploads/group-chat/images/${req.file.filename}`;
        const group = await groupChatService.updateProfileImage(req.params.groupId, profileImage, req.user);
        return ApiResponse.success(res, "Group image updated successfully.", group);
    } catch (error) {
        await removeUploadedFiles([req.file]);
        throw error;
    }
});

exports.deleteGroup = asyncHandler(async (req, res) => {
    await groupChatService.deleteGroup(req.params.groupId, req.user);
    return ApiResponse.success(res, "Group deleted successfully.");
});

exports.downloadAttachment = asyncHandler(async (req, res) => {
    const { filePath, attachment } = await groupChatService.getAttachment(
        req.params.groupId,
        req.params.fileName,
        req.user
    );
    if (req.query.download === "1") {
        return res.download(filePath, attachment.name);
    }
    res.setHeader("Content-Type", attachment.mimeType || "application/octet-stream");
    res.setHeader("Content-Disposition", "inline");
    return res.sendFile(filePath);
});
