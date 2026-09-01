const openingService = require("../services/opening.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");

exports.create = asyncHandler(async (req, res) => {
    const openingData = await openingService.create(req.body);

    return ApiResponse.created(
        res,
        "Opening created successfully.",
        openingData
    );
});

exports.getAll = asyncHandler(async (req, res) => {
    const openings = await openingService.getAll();

    return ApiResponse.success(
        res,
        "Openings fetched successfully.",
        openings
    );
});

exports.getById = asyncHandler(async (req, res) => {
    const openingData = await openingService.getById(req.params.id);

    return ApiResponse.success(
        res,
        "Opening fetched successfully.",
        openingData
    );
});

exports.update = asyncHandler(async (req, res) => {
    const openingData = await openingService.update(
        req.params.id,
        req.body
    );

    return ApiResponse.success(
        res,
        "Opening updated successfully.",
        openingData
    );
});

// ✅ ADD THIS METHOD
exports.updateStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;

    const openingData = await openingService.updateStatus(id, isActive);

    return ApiResponse.success(
        res,
        "Opening status updated successfully.",
        openingData
    );
});

exports.delete = asyncHandler(async (req, res) => {
    await openingService.delete(req.params.id);

    return ApiResponse.success(
        res,
        "Opening deleted successfully."
    );
});

exports.getPublicAll = asyncHandler(async (req, res) => {
    const openings = await openingService.getPublicAll();

    return ApiResponse.success(
        res,
        "Openings fetched successfully.",
        openings
    );
});

exports.getPublicById = asyncHandler(async (req, res) => {
    const openingData = await openingService.getPublicById(req.params.id);

    return ApiResponse.success(
        res,
        "Opening fetched successfully.",
        openingData
    );
});