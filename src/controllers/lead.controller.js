const leadService = require("../services/lead.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");
const { LEAD } = require("../constants/responseMessages");

exports.getLeads = asyncHandler(async (req, res) => {
    const { search, leadStatusId, leadSourceId, assignedTo } = req.query;
    const leads = await leadService.getAll({ search, leadStatusId, leadSourceId, assignedTo });
    return ApiResponse.success(res, LEAD.FETCHED, leads);
});

exports.getLeadById = asyncHandler(async (req, res) => {
    const lead = await leadService.getById(req.params.id);
    return ApiResponse.success(res, LEAD.FETCHED, lead);
});
 
exports.createLead = asyncHandler(async (req, res) => {
    const lead = await leadService.createLead(req.body, req.user.id);
    return ApiResponse.created(res, LEAD.CREATED, lead);
});

exports.updateLead = asyncHandler(async (req, res) => {
    const lead = await leadService.updateLead(req.params.id, req.body, req.user.id);
    return ApiResponse.success(res, LEAD.UPDATED, lead);
});

exports.deleteLead = asyncHandler(async (req, res) => {
    const deleted = await leadService.deleteLead(req.params.id);
    if (!deleted) {
        return ApiResponse.notFound(res, LEAD.NOT_FOUND);
    }
    return ApiResponse.success(res, LEAD.DELETED);
});
