const vendorservice = require('../services/vendor.service');
const ApiResponse = require('../helpers/apiResponse');
const asyncHandler = require('../helpers/asyncHandler');

exports.create = asyncHandler(async (req, res) => {
    const vendor = await vendorservice.create(req.body);
    return ApiResponse.created(
        res,
        "Vendor Created Successfully.",
    vendor);
});

exports.getAll =asyncHandler(async (req,res) => {
    const vendors = await vendorservice.getAll();
    return ApiResponse.success(
        res,
        "Vendors fetched successfully.",
        vendors
    );
});

exports.getById = asyncHandler(async (req, res) => {
    const vendor = await vendorservice.getById(req.params.id);
    return ApiResponse.success(
        res,
        "Vendor fetched successfully.",
        vendor
    );
});

exports.update = asyncHandler(async (req, res) => {
    const vendor = await vendorservice.update(req.params.id, req.body);
    return ApiResponse.success(
        res,"Vendor updated successfully.",
        vendor
    );
});

exports.delete = asyncHandler(async (req, res) => {
    await vendorservice.delete(req.params.id);
    return ApiResponse.success(
        res,
        "Vendor deleted successfully."
    );
});