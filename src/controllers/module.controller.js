const moduleService = require("../services/module.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");
const logger = require("../helpers/logger");

exports.createModule = asyncHandler(async (req, res) => {
    logger.info(`Creating module: ${req.body.name}`);
    const result = await moduleService.createModule(req.body);
    logger.info(`Module created: ${result.name}`);
    return ApiResponse.created(res, "Module created successfully.", result);
});

exports.getModules = asyncHandler(async (req, res) => {
    logger.info("Fetching all modules.");
    const result = await moduleService.getModules();
    logger.info(`Modules fetched: ${result.length} modules found.`);
    return ApiResponse.success(res, "Modules fetched successfully.", result);
});

exports.getModule = asyncHandler(async (req, res) => {
    logger.info(`Fetching module with ID: ${req.params.id}`);
    const result = await moduleService.getModule(req.params.id);
    logger.info(`Module fetched: ${result.name}`);
    return ApiResponse.success(res, "Module fetched successfully.", result);
});

exports.updateModule = asyncHandler(async (req, res) => {
    logger.info(`Updating module with ID: ${req.params.id}`);
    const result = await moduleService.updateModule(req.params.id, req.body);
    logger.info(`Module updated: ${result.name}`);
    return ApiResponse.success(res, "Module updated successfully.", result);
});

exports.deleteModule = asyncHandler(async (req, res) => {
    logger.info(`Deleting module with ID: ${req.params.id}`);
    await moduleService.deleteModule(req.params.id);
    logger.info(`Module deleted with ID: ${req.params.id}`);
    return ApiResponse.success(res, "Module deleted successfully.");
});