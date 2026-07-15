const permissionService = require("../services/permission.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");

exports.createPermission = asyncHandler(async (req, res) => {

    const permission = await permissionService.createPermission(req.body);

    return ApiResponse.created(res, "Permission created successfully", permission);

});

exports.getPermissions = asyncHandler(async (req, res) => {

    const permissions = await permissionService.getPermissions();

    return ApiResponse.success(res, "Permissions fetched successfully", permissions);

});

exports.getPermission = asyncHandler(async (req, res) => {
    const permission = await permissionService.getPermission(req.params.id);
    return ApiResponse.success(res, "Permission fetched successfully", permission);
});

exports.updatePermission = asyncHandler(async (req, res) => {

    const result = await permissionService.updatePermission(req.params.id, req.body);

    return ApiResponse.success(res, "Permission updated successfully.", result);

});

exports.deletePermission = asyncHandler(async (req, res) => {

    await permissionService.deletePermission(req.params.id);

    return ApiResponse.success(res, "Permission deleted successfully.");

});