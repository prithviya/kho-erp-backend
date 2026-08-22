const recruitmentService = require("../services/recruitment.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");

exports.create = asyncHandler(async (req, res) => {
    const recruitment = await recruitmentService.create(req.body);

    return ApiResponse.created(
        res,
        "Recruitment created successfully.",
        recruitment
    );
});

exports.getAll = asyncHandler(async (req, res) => {
    const recruitments = await recruitmentService.getAll();

    return ApiResponse.success(
        res,
        "Recruitments fetched successfully.",
        recruitments
    );
});

exports.getById = asyncHandler(async (req, res) => {
    const recruitment = await recruitmentService.getById(req.params.id);

    return ApiResponse.success(
        res,
        "Recruitment fetched successfully.",
        recruitment
    );
});

exports.getByCifId = asyncHandler(async (req, res) => {
    const recruitment = await recruitmentService.getByCifId(req.params.cifid);

    return ApiResponse.success(
        res,
        "Recruitment fetched successfully.",
        recruitment
    );
});

exports.update = asyncHandler(async (req, res) => {
    const recruitment = await recruitmentService.update(req.params.id, req.body);

    return ApiResponse.success(
        res,
        "Recruitment updated successfully.",
        recruitment
    );
});

exports.delete = asyncHandler(async (req, res) => {
    await recruitmentService.delete(req.params.id);

    return ApiResponse.success(
        res,
        "Recruitment deleted successfully."
    );
});
