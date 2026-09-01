const onboarding = require("../services/onboarding.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");

exports.create = asyncHandler(async (req, res) => {
    const onboardingData = await onboarding.create(req.body);

    return ApiResponse.created(
        res,
        "Onboarding created successfully.",
        onboardingData
    );
});

exports.saveRecord = asyncHandler(async (req, res) => {
    const record = await onboarding.saveRecord(req.body);

    return ApiResponse.success(
        res,
        "Onboarding record saved successfully.",
        record
    );
});

exports.updateRecordByCifId = asyncHandler(async (req, res) => {
    const cifid = Number(req.params.candidateId || req.params.cifid);
    if (!Number.isInteger(cifid) || cifid <= 0) {
        return ApiResponse.error(res, "A valid candidate ID is required.", null, 400);
    }

    const record = await onboarding.updateRecordByCifId(
        cifid,
        req.body
    );

    return ApiResponse.success(
        res,
        "Onboarding record updated successfully.",
        record
    );
});

exports.getRecordByCifId = asyncHandler(async (req, res) => {
    const cifid = Number(req.params.candidateId || req.params.cifid);
    if (!Number.isInteger(cifid) || cifid <= 0) {
        return ApiResponse.error(res, "A valid candidate ID is required.", null, 400);
    }

    const record = await onboarding.getRecordByCifId(cifid);

    return ApiResponse.success(
        res,
        "Onboarding record fetched successfully.",
        record
    );
});

exports.getRecordByEmployeeCode = asyncHandler(async (req, res) => {
    const employeeCode = String(
        req.params.employeeCode ||
        req.params.employee_code ||
        req.query.employee_code ||
        req.query.employeeCode ||
        ""
    ).trim();

    if (!employeeCode) {
        return ApiResponse.error(res, "A valid employee code is required.", null, 400);
    }

    const record = await onboarding.getRecordByEmployeeCode(employeeCode);
    if (!record) {
        return ApiResponse.error(res, "No onboarding record found for this employee code.", null, 404);
    }

    return ApiResponse.success(
        res,
        "Onboarding record fetched successfully.",
        record
    );
});

exports.getAllRecords = asyncHandler(async (_req, res) => {
    const records = await onboarding.getAllRecords();

    return ApiResponse.success(
        res,
        "Onboarding records fetched successfully.",
        records
    );
});

exports.getNextEmployeeId = asyncHandler(async (_req, res) => {
    const employeeId = await onboarding.getNextEmployeeId();

    return ApiResponse.success(
        res,
        "Next employee ID fetched successfully.",
        { employeeId }
    );
});

exports.uploadDocument = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new Error("Document file is required.");
    }

    const cifid = Number(req.body?.candidateId || req.body?.cifid);
    const uploadData = cifid
        ? await onboarding.saveUploadedDocument(
              cifid,
              req.file,
              req.body?.documentType
          )
        : onboarding.createDocumentUploadPayload(
              req.file,
              req.body?.documentType
          );

    return ApiResponse.success(
        res,
        cifid
            ? "Onboarding document uploaded and stored successfully."
            : "Onboarding document uploaded successfully.",
        uploadData
    );
});

exports.getAll = asyncHandler(async (req, res) => {
    const onboardings = await onboarding.getAll();

    return ApiResponse.success(
        res,
        "Onboardings fetched successfully.",
        onboardings
    );
});

exports.getById = asyncHandler(async (req, res) => {
    const onboardingData = await onboarding.getById(
        req.params.id
    );

    return ApiResponse.success(
        res,
        "Onboarding fetched successfully.",
        onboardingData
    );
});

exports.update = asyncHandler(async (req, res) => {
    const onboardingData = await onboarding.update(
        req.params.id,
        req.body
    );

    return ApiResponse.success(
        res,
        "Onboarding updated successfully.",
        onboardingData
    );
});

exports.delete = asyncHandler(async (req, res) => {
    await onboarding.delete(req.params.id);

    return ApiResponse.success(
        res,
        "Onboarding deleted successfully."
    );
});