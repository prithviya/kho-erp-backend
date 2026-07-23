const permissionService = require("../services/permission.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");
const logger = require("../helpers/logger");

exports.createPermission = asyncHandler(async (req, res) => {
    logger.info(`Creating permission: ${req.body.name}`);
    const permission = await permissionService.createPermission(req.body);
    logger.info(`Permission created: ${permission.name}`);
    return ApiResponse.created(res, "Permission created successfully", permission);

});

exports.getPermissions = asyncHandler(async (req, res) => {
    logger.info("Fetching all permissions.");
    const permissions = await permissionService.getPermissions();
    logger.info(`Permissions fetched: ${permissions.length} permissions found.`);
    return ApiResponse.success(res, "Permissions fetched successfully", permissions);

});

exports.getPermission = asyncHandler(async (req, res) => {
    logger.info(`Fetching permission with ID: ${req.params.id}`);
    const permission = await permissionService.getPermission(req.params.id);
    logger.info(`Permission fetched: ${permission.name}`);
    return ApiResponse.success(res, "Permission fetched successfully", permission);
});

exports.updatePermission = asyncHandler(async (req, res) => {
    logger.info(`Updating permission with ID: ${req.params.id}`);
    const result = await permissionService.updatePermission(req.params.id, req.body);
    logger.info(`Permission updated: ${result.name}`);
    return ApiResponse.success(res, "Permission updated successfully.", result);
});

exports.deletePermission = asyncHandler(async (req, res) => {
    logger.info(`Deleting permission with ID: ${req.params.id}`);
    await permissionService.deletePermission(req.params.id);
    logger.info(`Permission deleted with ID: ${req.params.id}`);
    return ApiResponse.success(res, "Permission deleted successfully.");
});