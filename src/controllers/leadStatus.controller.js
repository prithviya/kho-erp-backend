const service = require("../services/leadStatus.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");
exports.create = asyncHandler(async (req, res) => {
    const data = await service.create(req.body);
    return ApiResponse.created(res, "Lead Status created successfully.", data);
});
exports.getAll = asyncHandler(async (req, res) => {
    const data = await service.getAll();
    return ApiResponse.success(res, "Lead Status fetched successfully.", data);
});
exports.getById = asyncHandler(async (req, res) => {
    const data = await service.getById(req.params.id);
    return ApiResponse.success(res, "Lead Status fetched successfully.", data);
});
exports.update = asyncHandler(async (req, res) => {
    const data = await service.update(req.params.id, req.body);
    return ApiResponse.success(res, "Lead Status updated successfully.", data);
});
exports.delete = asyncHandler(async (req, res) => {
    await service.delete(req.params.id);
    return ApiResponse.success(res, "Lead Status deleted successfully.");
});