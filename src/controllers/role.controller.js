const roleService = require("../services/role.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");

exports.createRole = asyncHandler(async (req, res) => {

    const role = await roleService.createRole(req.body);

    return ApiResponse.created(res, "Role created successfully.", role);

});

exports.getRoles = asyncHandler(async (req, res) => {

    const roles = await roleService.getRoles();

    return ApiResponse.success(res, "Roles fetched successfully.", roles);

});
 
exports.updateRole = asyncHandler(async (req, res) => {

    const role = await roleService.updateRole(req.params.id, req.body);

    return ApiResponse.success(res, "Role updated successfully.", role);

});

exports.deleteRole = asyncHandler(async (req, res) => {

    await roleService.deleteRole(req.params.id);

    return ApiResponse.success(res, "Role deleted successfully.");

});