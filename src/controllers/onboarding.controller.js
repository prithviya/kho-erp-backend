const fs = require("fs");
const onboarding = require("../services/onboarding.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");
const archiver = require("archiver");
const path = require("path");

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

exports.getOnboardingDocuments = asyncHandler(async (_req, res) => {
    const documents = await onboarding.getOnboardingDocuments();
    return ApiResponse.success(res, "Onboarding documents fetched successfully.", documents);
});

exports.downloadOnboardingDocuments = asyncHandler(async (req, res, next) => {
    const files = await onboarding.getOnboardingDocumentArchiveFiles(req.body?.documents);
    const maxArchiveSize = Number(process.env.ONBOARDING_DOCUMENT_MAX_ARCHIVE_SIZE || 1024 * 1024 * 1024);
    const stats = await Promise.all(files.map(async (file) => {
        try {
            return await fs.promises.stat(file.path);
        } catch (error) {
            if (error.code === "ENOENT") {
                const notFound = new Error("One or more selected onboarding documents are no longer available.");
                notFound.status = 404;
                throw notFound;
            }
            throw error;
        }
    }));
    if (stats.reduce((total, fileStats) => total + fileStats.size, 0) > maxArchiveSize) {
        const error = new Error("The selected documents exceed the maximum ZIP download size.");
        error.status = 413;
        throw error;
    }

    const archive = archiver("zip", { zlib: { level: 6 } });
    const usedNames = new Map();
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", 'attachment; filename="onboarding-documents.zip"');
    archive.on("error", (error) => {
        if (!res.headersSent) next(error);
        else res.destroy(error);
    });
    archive.pipe(res);
    for (const file of files) {
        const safeName = path.basename(`${file.employeeName} - ${file.documentType} - ${file.name}`)
            .replace(/[\\/:]/g, "_") || "document";
        const key = safeName.toLowerCase();
        const count = usedNames.get(key) || 0;
        usedNames.set(key, count + 1);
        const extension = path.extname(safeName);
        const basename = path.basename(safeName, extension);
        archive.file(file.path, {
            name: count ? `${basename} (${count + 1})${extension}` : safeName,
        });
    }
    await archive.finalize();
});

exports.getClaimedEmployeeCodes = asyncHandler(async (_req, res) => {
    const codes = await onboarding.getClaimedEmployeeCodes();

    return ApiResponse.success(
        res,
        "Claimed employee codes fetched successfully.",
        codes
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