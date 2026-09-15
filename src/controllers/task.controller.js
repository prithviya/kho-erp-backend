const taskService = require("../services/task.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");

exports.getTasks = asyncHandler(async (req, res) => {
    const tasks = await taskService.listTasks(req.query || {}, req.user);
    return ApiResponse.success(res, "Tasks fetched successfully.", tasks);
});

exports.getTaskById = asyncHandler(async (req, res) => {
    const task = await taskService.getTaskById(req.params.id, req.user);
    return ApiResponse.success(res, "Task fetched successfully.", task);
});

exports.createTask = asyncHandler(async (req, res) => {
    const task = await taskService.createTask(req.body || {}, req.user);
    return ApiResponse.created(res, "Task created successfully.", task);
});

exports.updateTask = asyncHandler(async (req, res) => {
    const task = await taskService.updateTask(req.params.id, req.body || {}, req.user);
    return ApiResponse.success(res, "Task updated successfully.", task);
});

exports.updateTaskStatus = asyncHandler(async (req, res) => {
    const task = await taskService.updateStatus(req.params.id, req.body?.status, req.user);
    return ApiResponse.success(res, "Task status updated successfully.", task);
});

exports.deleteTask = asyncHandler(async (req, res) => {
    await taskService.deleteTask(req.params.id);
    return ApiResponse.success(res, "Task deleted successfully.");
});
