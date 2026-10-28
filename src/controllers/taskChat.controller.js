const asyncHandler = require("../helpers/asyncHandler");
const ApiResponse = require("../helpers/apiResponse");
const taskChatService = require("../services/taskChat.service");

exports.listMessages = asyncHandler(async (req, res) => {
    const messages = await taskChatService.listMessages(req.params.taskId, req.user);
    return ApiResponse.success(res, "Task chat fetched successfully.", messages);
});

exports.createMessage = asyncHandler(async (req, res) => {
    const attachments = (req.files || []).map((file) => ({
        name: file.originalname,
        url: `/uploads/task-chat/${file.filename}`,
        mimeType: file.mimetype,
        size: file.size
    }));
    const body = req.body || {};
    let mentionedUserIds = body.mentionedUserIds || [];
    if (typeof mentionedUserIds === "string") {
        try { mentionedUserIds = JSON.parse(mentionedUserIds); } catch { mentionedUserIds = []; }
    }
    const message = await taskChatService.createMessage(
        req.params.taskId,
        { ...body, mentionedUserIds, attachments },
        req.user
    );
    return ApiResponse.created(res, "Task message sent successfully.", message);
});

exports.updateMessage = asyncHandler(async (req, res) => {
    const newAttachments = (req.files || []).map((file) => ({
        name: file.originalname,
        url: `/uploads/task-chat/${file.filename}`,
        mimeType: file.mimetype,
        size: file.size
    }));
    const body = req.body || {};
    let removedUrls = body.removedUrls || [];
    if (typeof removedUrls === "string") {
        try { removedUrls = JSON.parse(removedUrls); } catch { removedUrls = []; }
    }
    const message = await taskChatService.updateMessage(
        req.params.taskId,
        req.params.messageId,
        { ...body, removedUrls, newAttachments },
        req.user
    );
    return ApiResponse.success(res, "Comment updated successfully.", message);
});

exports.deleteMessage = asyncHandler(async (req, res) => {
    await taskChatService.deleteMessage(req.params.taskId, req.params.messageId, req.user);
    return ApiResponse.success(res, "Comment deleted successfully.");
});
