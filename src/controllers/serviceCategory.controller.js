const serviceCategoryService = require("../services/serviceCategory.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");
exports.create = asyncHandler(async (req, res) => {
    const category = await serviceCategoryService.create(req.body)
    return ApiResponse.created(
        res,
        "Service Category created successfully.",
        category
    );
});
exports.getAll = asyncHandler(async (req, res) => {
    const categories = await serviceCategoryService.getAll()
    return ApiResponse.success(
        res,
        "Service Categories fetched successfully.",
        categories
    );
});
exports.getById = asyncHandler(async (req, res) => {
    const category = await serviceCategoryService.getById(req.params.id);
    return ApiResponse.success(
        res,
        "Service Category fetched successfully.",
        category
    );
});
exports.update = asyncHandler(async (req, res) => {
    const category = await serviceCategoryService.update(
        req.params.id,
        req.body
    );
    return ApiResponse.success(
        res,
        "Service Category updated successfully.",
        category
    );
});
exports.delete = asyncHandler(async (req, res) => {
    await serviceCategoryService.delete(req.params.id);
    return ApiResponse.success(
        res,
            "Service Category deleted successfully."
        );
    });
exports.getWithServices = asyncHandler(async (req, res) => {
    const data = await serviceCategoryService.getWithServices();
    return ApiResponse.success(
        res,
        "Service Categories fetched successfully.",
        data
    );
});