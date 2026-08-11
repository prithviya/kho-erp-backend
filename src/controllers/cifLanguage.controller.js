const cifLanguage = require("../services/cifLanguage.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");

exports.create = asyncHandler(async (req, res) => {
    const languageData = await cifLanguage.create(req.body);

    return ApiResponse.created(
        res,
        "Language record created successfully.",
        languageData
    );
});

exports.getAll = asyncHandler(async (req, res) => {
    const languages = await cifLanguage.getAll();

    return ApiResponse.success(
        res,
        "Language records fetched successfully.",
        languages
    );
});

exports.getById = asyncHandler(async (req, res) => {
    const languageData = await cifLanguage.getById(
        req.params.id
    );

    return ApiResponse.success(
        res,
        "Language record fetched successfully.",
        languageData
    );
});

exports.getByCifId = asyncHandler(async (req, res) => {
    const languages = await cifLanguage.getByCifId(
        req.params.cifid
    );

    return ApiResponse.success(
        res,
        "Language records fetched successfully.",
        languages
    );
});

exports.update = asyncHandler(async (req, res) => {
    const languageData = await cifLanguage.update(
        req.params.id,
        req.body
    );

    return ApiResponse.success(
        res,
        "Language record updated successfully.",
        languageData
    );
});

exports.delete = asyncHandler(async (req, res) => {
    await cifLanguage.delete(req.params.id);

    return ApiResponse.success(
        res,
        "Language record deleted successfully."
    );
});