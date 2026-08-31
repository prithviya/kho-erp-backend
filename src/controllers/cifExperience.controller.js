const cifExperience = require("../services/cifExperience.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");

exports.create = asyncHandler(async (req, res) => {
    const experienceData = await cifExperience.create(req.body);

    return ApiResponse.created(
        res,
        "Experience record created successfully.",
        experienceData
    );
});

exports.getAll = asyncHandler(async (req, res) => {
    const experiences = await cifExperience.getAll();

    return ApiResponse.success(
        res,
        "Experience records fetched successfully.",
        experiences
    );
});

exports.getById = asyncHandler(async (req, res) => {
    const experienceData = await cifExperience.getById(
        req.params.id
    );

    return ApiResponse.success(
        res,
        "Experience record fetched successfully.",
        experienceData
    );
});

exports.getByCifId = asyncHandler(async (req, res) => {
    const candidateId = req.params.candidateId || req.params.cifid;
    const experiences = await cifExperience.getByCifId(
        candidateId
    );

    return ApiResponse.success(
        res,
        "Experience records fetched successfully.",
        experiences
    );
});

exports.update = asyncHandler(async (req, res) => {
    const experienceData = await cifExperience.update(
        req.params.id,
        req.body
    );

    return ApiResponse.success(
        res,
        "Experience record updated successfully.",
        experienceData
    );
});

exports.delete = asyncHandler(async (req, res) => {
    await cifExperience.delete(req.params.id);

    return ApiResponse.success(
        res,
        "Experience record deleted successfully."
    );
});