const asyncHandler = require("../helpers/asyncHandler");
const ApiResponse = require("../helpers/apiResponse");
const projectChatService = require("../services/projectChat.service");

exports.listMessages = asyncHandler(async (req, res) => {
    const messages = await projectChatService.listMessages(req.params.projectId, req.user);
    return ApiResponse.success(res, "Project chat fetched successfully.", messages);
});

exports.createMessage = asyncHandler(async (req, res) => {
    const message = await projectChatService.createMessage(req.params.projectId, req.body, req.user);
    return ApiResponse.created(res, "Project message sent successfully.", message);
});
