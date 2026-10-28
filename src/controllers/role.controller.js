const roleService = require("../services/role.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");
const logger = require("../helpers/logger");
exports.createRole = asyncHandler(async (req, res) => {
    logger.info(`Creating role: ${req.body.name}`);
    const role = await roleService.createRole(req.body);
    logger.info(`Role created: ${role.name}`);
    return ApiResponse.created(res, "Role created successfully.", role);
});
exports.getRoles = asyncHandler(async (req, res) => {
    logger.info("Fetching all roles.");
    const roles = await roleService.getRoles();
    logger.info(`Roles fetched: ${roles.length} roles found.`);
    return ApiResponse.success(res, "Roles fetched successfully.", roles);
});
exports.getRolesWithAccess = asyncHandler(async (_req, res) => {
    const roles = await roleService.getRolesWithAccess();
    return ApiResponse.success(res, "Roles and access assignments fetched successfully.", roles);
});
exports.getPermissionCatalog = asyncHandler(async (_req, res) => {
    const modules = await roleService.getPermissionCatalog();
    return ApiResponse.success(res, "Permission catalog fetched successfully.", modules);
});
exports.initializePermissionCatalog = asyncHandler(async (_req, res) => {
    const result = await roleService.initializePermissionCatalog();
    return ApiResponse.success(res, "Permission catalog initialized.", result);
});
exports.getPermissionMatrix = asyncHandler(async (req, res) => {
    const matrix = await roleService.getPermissionMatrix(req.params.id);
    return ApiResponse.success(res, "Permission matrix fetched successfully.", matrix);
});
exports.backfillLegacyRoles = asyncHandler(async (req, res) => {
    const result = await roleService.backfillLegacyRoles({ dryRun: req.query.dryRun !== "false" });
    return ApiResponse.success(res, "Legacy role access processed.", result);
});
exports.updateRole = asyncHandler(async (req, res) => {
    logger.info(`Updating role with ID: ${req.params.id}`);
    const role = await roleService.updateRole(
        req.params.id,
        req.body
    );
    logger.info(`Role updated: ${role.name}`);
    return ApiResponse.success(res, "Role updated successfully.", role);
});
exports.deleteRole = asyncHandler(async (req, res) => {
    logger.info(`Deleting role with ID: ${req.params.id}`);
    await roleService.deleteRole(req.params.id);
    logger.info(`Role deleted with ID: ${req.params.id}`);
    return ApiResponse.success(res, "Role deleted successfully.");
});