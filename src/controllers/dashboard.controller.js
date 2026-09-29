const dashboardService = require("../services/dashboard.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");

exports.getDashboardOverview = asyncHandler(async (req, res) => {
    const data = await dashboardService.getOverview(req.user);
    return ApiResponse.success(res, "Dashboard data fetched successfully.", data);
});
