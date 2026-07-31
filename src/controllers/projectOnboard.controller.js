const projectOnboardService = require("../services/projectOnboard.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");

exports.createProjectOnboard = asyncHandler(async (req, res) => {
    const { projectName, companyName, serviceIds } = req.body;

    if (!projectName || !String(projectName).trim()) {
        return ApiResponse.error(res, "Project name is required.", null, 400);
    }
    if (!companyName || !String(companyName).trim()) {
        return ApiResponse.error(res, "Company name is required.", null, 400);
    }
    if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
        return ApiResponse.error(res, "At least one service is required.", null, 400);
    }

    const created = await projectOnboardService.createProjectOnboard(req.body, req.user?.id);
    return ApiResponse.created(res, "Project onboarded successfully.", created);
});

exports.getProjectOnboards = asyncHandler(async (_req, res) => {
    const projects = await projectOnboardService.listProjectOnboards();
    return ApiResponse.success(res, "Projects fetched successfully.", projects);
});

exports.getProjectOnboardById = asyncHandler(async (req, res) => {
    const project = await projectOnboardService.getProjectOnboardById(req.params.id);
    return ApiResponse.success(res, "Project fetched successfully.", project);
});

exports.updateProjectOnboard = asyncHandler(async (req, res) => {
    const { projectName, companyName, serviceIds } = req.body;

    if (!projectName || !String(projectName).trim()) {
        return ApiResponse.error(res, "Project name is required.", null, 400);
    }
    if (!companyName || !String(companyName).trim()) {
        return ApiResponse.error(res, "Company name is required.", null, 400);
    }
    if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
        return ApiResponse.error(res, "At least one service is required.", null, 400);
    }

    const updated = await projectOnboardService.updateProjectOnboard(req.params.id, req.body);
    return ApiResponse.success(res, "Project updated successfully.", updated);
});

exports.assignProjectOnboard = asyncHandler(async (req, res) => {
    const { assignedToIds } = req.body;

    if (!Array.isArray(assignedToIds) || assignedToIds.length === 0) {
        return ApiResponse.error(res, "At least one assignee is required.", null, 400);
    }
    const updated = await projectOnboardService.assignProjectOnboard(req.params.id, req.body, req.user?.id);
    return ApiResponse.success(res, "Project assigned successfully.", updated);
});
