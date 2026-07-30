const serviceService = require("../services/service.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");
exports.create = asyncHandler(async (req, res) => {
    const service = await serviceService.create(req.body);
    return ApiResponse.created(
        res,
        "Service created successfully.",
        service
    );
});
exports.getAll = asyncHandler(async (req, res) => {
    const services = await serviceService.getAll();
    return ApiResponse.success(
        res,
        "Services fetched successfully.",
        services
    );
});
exports.getById = asyncHandler(async (req, res) => {
    const service = await serviceService.getById(req.params.id);
    return ApiResponse.success(
        res,
        "Service fetched successfully.",
        service
    );
});
exports.getByCategory = asyncHandler(async (req, res) => {
    const services = await serviceService.getByCategory(
        req.params.categoryId
    );
    return ApiResponse.success(
        res,
        "Services fetched successfully.",
        services
    );
});
exports.update = asyncHandler(async (req, res) => {
    const service = await serviceService.update(
        req.params.id,
        req.body
    );
    return ApiResponse.success(
        res,
        "Service updated successfully.",
        service
    );
});
exports.delete = asyncHandler(async (req, res) => {
    await serviceService.delete(req.params.id);
    return ApiResponse.success(
        res,
        "Service deleted successfully."
    );
});