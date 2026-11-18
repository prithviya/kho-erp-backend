const asyncHandler = require("../helpers/asyncHandler");
const ApiResponse = require("../helpers/apiResponse");
const commonWallService = require("../services/commonWall.service");

exports.getOverview = asyncHandler(async (req, res) => {
    const overview = await commonWallService.getCommonWall(req.user);
    return ApiResponse.success(res, "Common Wall data fetched successfully.", overview);
});

exports.getAnnouncementCount = asyncHandler(async (req, res) => {
    const count = await commonWallService.getAnnouncementCount(req.user.id);
    return ApiResponse.success(res, "Announcement count fetched successfully.", { count });
});
