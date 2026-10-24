const asyncHandler = require("../helpers/asyncHandler");
const ApiResponse = require("../helpers/apiResponse");
const notificationService = require("../services/notification.service");

exports.list = asyncHandler(async (req, res) => {
    const notifications = await notificationService.listForUser(req.user.id);
    const unreadCount = await notificationService.unreadCount(req.user.id);
    return ApiResponse.success(res, "Notifications fetched successfully.", { notifications, unreadCount });
});

exports.markRead = asyncHandler(async (req, res) => {
    await notificationService.markRead(req.params.id, req.user.id);
    return ApiResponse.success(res, "Notification marked as read.");
});

exports.markAllRead = asyncHandler(async (req, res) => {
    await notificationService.markAllRead(req.user.id);
    return ApiResponse.success(res, "Notifications marked as read.");
});

exports.remove = asyncHandler(async (req, res) => {
    await notificationService.deleteForUser(req.params.id, req.user.id);
    return ApiResponse.success(res, "Notification cleared.");
});
