const leaveService = require("../services/leave.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");

exports.getCategories = asyncHandler(async (_req, res) => {
    const categories = await leaveService.getCategories();
    return ApiResponse.success(res, "Leave categories fetched successfully.", categories);
});

exports.createCategory = asyncHandler(async (req, res) => {
    const category = await leaveService.createCategory(req.body || {});
    return ApiResponse.created(res, "Leave category created successfully.", category);
});

exports.updateCategory = asyncHandler(async (req, res) => {
    const category = await leaveService.updateCategory(req.params.id, req.body || {});
    if (!category) {
        return ApiResponse.notFound(res, "Leave category not found.");
    }

    return ApiResponse.success(res, "Leave category updated successfully.", category);
});

exports.getSummary = asyncHandler(async (req, res) => {
    const summary = await leaveService.getSummary(req.user, req.query || {});
    return ApiResponse.success(res, "Leave summary fetched successfully.", summary);
});

exports.getRequests = asyncHandler(async (req, res) => {
    const requests = await leaveService.listRequests(req.query || {}, req.user);
    return ApiResponse.success(res, "Leave requests fetched successfully.", requests);
});

exports.getRequestById = asyncHandler(async (req, res) => {
    const request = await leaveService.getRequestById(req.params.id, req.user);
    if (!request) {
        return ApiResponse.notFound(res, "Leave not found.");
    }

    return ApiResponse.success(res, "Leave request fetched successfully.", request);
});

exports.createRequest = asyncHandler(async (req, res) => {
    const request = await leaveService.createRequest(req.body || {}, req.user);
    return ApiResponse.created(res, "Leave request submitted successfully.", request);
});

exports.updateRequest = asyncHandler(async (req, res) => {
    const request = await leaveService.updateRequest(req.params.id, req.body || {}, req.user);
    if (!request) {
        return ApiResponse.notFound(res, "Leave not found.");
    }

    return ApiResponse.success(res, "Leave request updated successfully.", request);
});

exports.updateRequestStatus = asyncHandler(async (req, res) => {
    const request = await leaveService.updateRequestStatus(req.params.id, req.body || {}, req.user);
    if (!request) {
        return ApiResponse.notFound(res, "Leave not found.");
    }

    return ApiResponse.success(res, "Leave request status updated successfully.", request);
});

exports.deleteRequest = asyncHandler(async (req, res) => {
    const deleted = await leaveService.deleteRequest(req.params.id, req.user);
    if (!deleted) {
        return ApiResponse.notFound(res, "Leave not found.");
    }

    return ApiResponse.success(res, "Leave request deleted successfully.");
});
