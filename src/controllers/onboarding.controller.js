const onboarding = require("../services/onboarding.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");

exports.create = asyncHandler(async (req, res) => {
    const onboardingData = await onboarding.create(req.body);

    return ApiResponse.created(
        res,
        "Onboarding created successfully.",
        onboardingData
    );
});

exports.getAll = asyncHandler(async (req, res) => {
    const onboardings = await onboarding.getAll();

    return ApiResponse.success(
        res,
        "Onboardings fetched successfully.",
        onboardings
    );
});

exports.getById = asyncHandler(async (req, res) => {
    const onboardingData = await onboarding.getById(
        req.params.id
    );

    return ApiResponse.success(
        res,
        "Onboarding fetched successfully.",
        onboardingData
    );
});

exports.update = asyncHandler(async (req, res) => {
    const onboardingData = await onboarding.update(
        req.params.id,
        req.body
    );

    return ApiResponse.success(
        res,
        "Onboarding updated successfully.",
        onboardingData
    );
});

exports.delete = asyncHandler(async (req, res) => {
    await onboarding.delete(req.params.id);

    return ApiResponse.success(
        res,
        "Onboarding deleted successfully."
    );
});