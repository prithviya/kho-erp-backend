const employeeService = require("../services/employee.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");

exports.createEmployee = asyncHandler(async (req, res) => {
    const employee = await employeeService.createEmployee(req.body, req.file, req.user?.id);
    return ApiResponse.created(res, "Employee created successfully.", employee);
});

exports.getEmployees = asyncHandler(async (req, res) => {
    const employees = await employeeService.getEmployees(req.query.search || "");
    return ApiResponse.success(res, "Employees fetched successfully.", employees);
});

exports.getEmployeeById = asyncHandler(async (req, res) => {
    const employee = await employeeService.getEmployeeById(req.params.id);
    return ApiResponse.success(res, "Employee fetched successfully.", employee);
});

exports.updateEmployee = asyncHandler(async (req, res) => {
    const employee = await employeeService.updateEmployee(req.params.id, req.body, req.file);
    return ApiResponse.success(res, "Employee updated successfully.", employee);
});