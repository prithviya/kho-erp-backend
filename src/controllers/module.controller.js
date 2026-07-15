const moduleService = require("../services/module.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");

exports.createModule = asyncHandler(async (req, res) => {

    const result = await moduleService.createModule(req.body);

    return ApiResponse.created(res, "Module created successfully.", result);

});

exports.getModules = asyncHandler(async (req, res) => {

    const result = await moduleService.getModules();

    return ApiResponse.success(res, "Modules fetched successfully.", result);

});

exports.getModule = asyncHandler(async (req, res) => {

    const result = await moduleService.getModule(req.params.id);

    return ApiResponse.success(res, "Module fetched successfully.", result);

}); 

exports.updateModule = asyncHandler(async (req, res) => {

    const result = await moduleService.updateModule(req.params.id, req.body);

    return ApiResponse.success(res, "Module updated successfully.", result);

});

exports.deleteModule = asyncHandler(async (req, res) => {

    await moduleService.deleteModule(req.params.id);

    return ApiResponse.success(res, "Module deleted successfully.");

});