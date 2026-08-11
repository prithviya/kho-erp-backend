const opening = require("../services/opening.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");

exports.create = asyncHandler(async (req, res) => {
    const openingData = await opening.create(req.body);

    return ApiResponse.created(
        res,
        "Opening created successfully.",
        openingData
    );
});

exports.getAll = asyncHandler(async (req, res) => {
    const openings = await opening.getAll();

    return ApiResponse.success(
        res,
        "Openings fetched successfully.",
        openings
    );
});

exports.getById = asyncHandler(async (req, res) => {
    const openingData = await opening.getById(req.params.id);

    return ApiResponse.success(
        res,
        "Opening fetched successfully.",
        openingData
    );
});

exports.update = asyncHandler(async (req, res) => {
    const openingData = await opening.update(
        req.params.id,
        req.body
    );

    return ApiResponse.success(
        res,
        "Opening updated successfully.",
        openingData
    );
});

exports.delete = asyncHandler(async (req, res) => {
    await opening.delete(req.params.id);

    return ApiResponse.success(
        res,
        "Opening deleted successfully."
    );
});