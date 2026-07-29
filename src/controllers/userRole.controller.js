const userRoleService = require("../services/userRole.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");
exports.assignRoles = asyncHandler(async (req, res) => {
    const roles = await userRoleService.assignRoles(
        req.params.userId, req.body.roleIds);
    return ApiResponse.success(
        res,
        "Roles assigned successfully.",
        roles
    );
});
exports.getRoles = asyncHandler(async (req, res) => {
    const roles = await userRoleService.getRoles(
        req.params.userId);
    return ApiResponse.success(
        res,
        "Roles fetched successfully.",
        roles
    );
});
exports.removeRole = asyncHandler(async (req, res) => {
    await userRoleService.removeRole(
        req.params.userId,
        req.params.roleId
    );
    return ApiResponse.success(
        res,
        "Role removed successfully."
    );
});
