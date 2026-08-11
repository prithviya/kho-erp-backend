const cifPersonal = require("../services/cifPersonal.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");

exports.create = asyncHandler(async (req, res) => {
    const cifPersonalData = await cifPersonal.create(req.body);

    return ApiResponse.created(
        res,
        "CIF Personal created successfully.",
        cifPersonalData
    );
});

exports.getAll = asyncHandler(async (req, res) => {
    const cifPersonals = await cifPersonal.getAll();

    return ApiResponse.success(
        res,
        "CIF Personals fetched successfully.",
        cifPersonals
    );
});

exports.getById = asyncHandler(async (req, res) => {
    const cifPersonalData = await cifPersonal.getById(req.params.id);

    return ApiResponse.success(
        res,
        "CIF Personal fetched successfully.",
        cifPersonalData
    );
});

exports.update = asyncHandler(async (req, res) => {
    const cifPersonalData = await cifPersonal.update(
        req.params.id,
        req.body
    );

    return ApiResponse.success(
        res,
        "CIF Personal updated successfully.",
        cifPersonalData
    );
});

exports.delete = asyncHandler(async (req, res) => {
    await cifPersonal.delete(req.params.id);

    return ApiResponse.success(
        res,
        "CIF Personal deleted successfully."
    );
});