const cifReference = require("../services/cifReference.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");

exports.create = asyncHandler(async (req, res) => {
    const referenceData = await cifReference.create(req.body);

    return ApiResponse.created(
        res,
        "Reference record created successfully.",
        referenceData
    );
});

exports.getAll = asyncHandler(async (req, res) => {
    const references = await cifReference.getAll();

    return ApiResponse.success(
        res,
        "Reference records fetched successfully.",
        references
    );
});

exports.getById = asyncHandler(async (req, res) => {
    const referenceData = await cifReference.getById(
        req.params.id
    );

    return ApiResponse.success(
        res,
        "Reference record fetched successfully.",
        referenceData
    );
});

exports.getByCifId = asyncHandler(async (req, res) => {
    const candidateId = req.params.candidateId || req.params.cifid;
    const references = await cifReference.getByCifId(
        candidateId
    );

    return ApiResponse.success(
        res,
        "Reference records fetched successfully.",
        references
    );
});

exports.update = asyncHandler(async (req, res) => {
    const referenceData = await cifReference.update(
        req.params.id,
        req.body
    );

    return ApiResponse.success(
        res,
        "Reference record updated successfully.",
        referenceData
    );
});

exports.delete = asyncHandler(async (req, res) => {
    await cifReference.delete(req.params.id);

    return ApiResponse.success(
        res,
        "Reference record deleted successfully."
    );
});