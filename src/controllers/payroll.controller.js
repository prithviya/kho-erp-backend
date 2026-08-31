const payrollService = require("../services/payroll.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");

exports.getAll = asyncHandler(async (req, res) => {
    const records = await payrollService.list(req.query || {});
    return ApiResponse.success(res, "Payrolls fetched successfully.", records);
});

exports.getById = asyncHandler(async (req, res) => {
    const record = await payrollService.getById(req.params.id);
    if (!record) {
        return ApiResponse.notFound(res, "Payroll not found.");
    }

    return ApiResponse.success(res, "Payroll fetched successfully.", record);
});

exports.create = asyncHandler(async (req, res) => {
    const record = await payrollService.create(req.body || {}, req.user?.id || null);
    return ApiResponse.created(res, "Payroll created successfully.", record);
});

exports.update = asyncHandler(async (req, res) => {
    const record = await payrollService.update(req.params.id, req.body || {});
    if (!record) {
        return ApiResponse.notFound(res, "Payroll not found.");
    }

    return ApiResponse.success(res, "Payroll updated successfully.", record);
});

exports.delete = asyncHandler(async (req, res) => {
    const deleted = await payrollService.remove(req.params.id);
    if (!deleted) {
        return ApiResponse.notFound(res, "Payroll not found.");
    }

    return ApiResponse.success(res, "Payroll deleted successfully.");
});
