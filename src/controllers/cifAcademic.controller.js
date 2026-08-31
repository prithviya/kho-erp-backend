const cifAcademic = require("../services/cifAcademic.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");

exports.create = asyncHandler(async (req, res) => {
    const academicData = await cifAcademic.create(req.body);

    return ApiResponse.created(
        res,
        "Academic record created successfully.",
        academicData
    );
});

exports.getAll = asyncHandler(async (req, res) => {
    const academics = await cifAcademic.getAll();

    return ApiResponse.success(
        res,
        "Academic records fetched successfully.",
        academics
    );
});

exports.getById = asyncHandler(async (req, res) => {
    const academicData = await cifAcademic.getById(req.params.id);

    return ApiResponse.success(
        res,
        "Academic record fetched successfully.",
        academicData
    );
});

exports.getByCifId = asyncHandler(async (req, res) => {
    const candidateId = req.params.candidateId || req.params.cifid;
    const academics = await cifAcademic.getByCifId(
        candidateId
    );

    return ApiResponse.success(
        res,
        "Academic records fetched successfully.",
        academics
    );
});

exports.update = asyncHandler(async (req, res) => {
    const academicData = await cifAcademic.update(
        req.params.id,
        req.body
    );

    return ApiResponse.success(
        res,
        "Academic record updated successfully.",
        academicData
    );
});

exports.delete = asyncHandler(async (req, res) => {
    await cifAcademic.delete(req.params.id);

    return ApiResponse.success(
        res,
        "Academic record deleted successfully."
    );
});