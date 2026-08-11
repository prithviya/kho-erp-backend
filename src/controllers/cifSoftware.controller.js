const cifSoftware = require("../services/cifSoftware.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");

exports.create = asyncHandler(async (req, res) => {
    const softwareData = await cifSoftware.create(req.body);

    return ApiResponse.created(
        res,
        "Software record created successfully.",
        softwareData
    );
});

exports.getAll = asyncHandler(async (req, res) => {
    const software = await cifSoftware.getAll();

    return ApiResponse.success(
        res,
        "Software records fetched successfully.",
        software
    );
});

exports.getById = asyncHandler(async (req, res) => {
    const softwareData = await cifSoftware.getById(req.params.id);

    return ApiResponse.success(
        res,
        "Software record fetched successfully.",
        softwareData
    );
});

exports.getByCifId = asyncHandler(async (req, res) => {
    const software = await cifSoftware.getByCifId(
        req.params.cifid
    );

    return ApiResponse.success(
        res,
        "Software records fetched successfully.",
        software
    );
});

exports.update = asyncHandler(async (req, res) => {
    const softwareData = await cifSoftware.update(
        req.params.id,
        req.body
    );

    return ApiResponse.success(
        res,
        "Software record updated successfully.",
        softwareData
    );
});

exports.delete = asyncHandler(async (req, res) => {
    await cifSoftware.delete(req.params.id);

    return ApiResponse.success(
        res,
        "Software record deleted successfully."
    );
});