const leadService = require("../services/lead.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");
const { LEAD } = require("../constants/responseMessages");
const { hasRole } = require("../middleware/roleAccess.middleware");

exports.getLeads = asyncHandler(async (req, res) => {
    const { search, leadStatusId, leadSourceId, assignedTo } = req.query;
    const filters = {
        search,
        leadStatusId,
        leadSourceId,
        assignedTo,
    };

    if (hasRole(req, "crm_executive") && !req.user.isSuperAdmin) {
        filters.assignedTo = req.user.id;
    }

    const leads = await leadService.getAll(filters);
    return ApiResponse.success(res, LEAD.FETCHED, leads);
});

exports.getLeadById = asyncHandler(async (req, res) => {
    const requireAssignedUser = hasRole(req, "crm_executive") && !req.user.isSuperAdmin;
    const lead = await leadService.getById(req.params.id, {
        requireAssignedUser,
        userId: req.user.id,
    });
    return ApiResponse.success(res, LEAD.FETCHED, lead);
});
 
exports.createLead = asyncHandler(async (req, res) => {
    const lead = await leadService.createLead(req.body, req.user.id);
    return ApiResponse.created(res, LEAD.CREATED, lead);
});

exports.updateLead = asyncHandler(async (req, res) => {
    const requireAssignedUser = hasRole(req, "crm_executive") && !req.user.isSuperAdmin;
    const payload = { ...req.body };

    if (requireAssignedUser) {
        payload.assignedTo = req.user.id;
    }

    const lead = await leadService.updateLead(req.params.id, payload, req.user.id, {
        requireAssignedUser,
        userId: req.user.id,
    });
    return ApiResponse.success(res, LEAD.UPDATED, lead);
});

exports.deleteLead = asyncHandler(async (req, res) => {
    const deleted = await leadService.deleteLead(req.params.id);
    if (!deleted) {
        return ApiResponse.notFound(res, LEAD.NOT_FOUND);
    }
    return ApiResponse.success(res, LEAD.DELETED);
});
