const cifSkill = require("../services/cifSkill.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");

exports.create = asyncHandler(async (req, res) => {
    const skillData = await cifSkill.create(req.body);

    return ApiResponse.created(
        res,
        "Skill record created successfully.",
        skillData
    );
});

exports.getAll = asyncHandler(async (req, res) => {
    const skills = await cifSkill.getAll();

    return ApiResponse.success(
        res,
        "Skill records fetched successfully.",
        skills
    );
});

exports.getById = asyncHandler(async (req, res) => {
    const skillData = await cifSkill.getById(req.params.id);

    return ApiResponse.success(
        res,
        "Skill record fetched successfully.",
        skillData
    );
});

exports.getByCifId = asyncHandler(async (req, res) => {
    const candidateId = req.params.candidateId || req.params.cifid;
    const skills = await cifSkill.getByCifId(candidateId);

    return ApiResponse.success(
        res,
        "Skill records fetched successfully.",
        skills
    );
});

exports.update = asyncHandler(async (req, res) => {
    const skillData = await cifSkill.update(
        req.params.id,
        req.body
    );

    return ApiResponse.success(
        res,
        "Skill record updated successfully.",
        skillData
    );
});

exports.delete = asyncHandler(async (req, res) => {
    await cifSkill.delete(req.params.id);

    return ApiResponse.success(
        res,
        "Skill record deleted successfully."
    );
});