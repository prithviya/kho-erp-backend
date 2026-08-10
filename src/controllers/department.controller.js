const department = require("../services/department.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");
exports.create = asyncHandler(async (req, res) => {
    const departmentData = await department.create(req.body)
    return ApiResponse.created(
        res,
        "Department created successfully.",
        departmentData
    );
});
exports.getAll = asyncHandler(async (req, res) => {
    const departments = await department.getAll()
    return ApiResponse.success(
        res,
        "Departments fetched successfully.",
        departments
    );
});
exports.getById = asyncHandler(async (req, res) => {
    const departmentData = await department.getById(req.params.id);
    return ApiResponse.success( 
        res,
        "Department fetched successfully.",
        departmentData
    );
});
exports.update = asyncHandler(async (req, res) => {
    const departmentData = await department.update(
        req.params.id,
        req.body
    );
    return ApiResponse.success(
        res,
        "Department updated successfully.",
        departmentData
    );
});
exports.delete = asyncHandler(async (req, res) => {
    await department.delete(req.params.id);
    return ApiResponse.success(
        res,
        "Department deleted successfully."
    );
});
