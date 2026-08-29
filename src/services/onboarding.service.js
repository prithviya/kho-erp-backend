const BaseService = require("./base.service");
const repository = require("../repository/onboarding.repository");
const db = require("../model");
const { QueryTypes } = require("sequelize");

class OnboardingService extends BaseService {
    constructor() {
        super(repository);
        this._onboardingDocumentFileUrlColumnAvailable = null;
    }

    async getNextEmployeeId() {
        const maxEmployeeId = await db.Employee.max("id", {
            paranoid: false,
        });

        const nextNumber = Number(maxEmployeeId || 0) + 1;
        return `KHO-${String(nextNumber).padStart(3, "0")}`;
    }

    normalizeStatus(status) {
        return String(status || "DRAFT").toUpperCase() === "FINAL"
            ? "FINAL"
            : "DRAFT";
    }

    pickValue(newValue, oldValue) {
        if (newValue === undefined || newValue === null) {
            return oldValue;
        }

        if (typeof newValue === "string" && newValue.trim() === "") {
            return oldValue;
        }

        return newValue;
    }

    parseExperienceTotal(value) {
        if (typeof value === "number") {
            return value;
        }

        const numeric = parseFloat(String(value || "").replace(/[^0-9.]/g, ""));
        return Number.isNaN(numeric) ? null : numeric;
    }

    parseBoolean(value) {
        if (typeof value === "boolean") {
            return value;
        }

        const normalized = String(value || "")
            .trim()
            .toLowerCase();
        return ["true", "yes", "1", "on"].includes(normalized);
    }

    normalizeYesNo(value) {
        if (typeof value === "boolean") {
            return value ? "Yes" : "No";
        }

        const normalized = String(value || "").trim().toLowerCase();
        if (["yes", "no"].includes(normalized)) {
            return normalized === "yes" ? "Yes" : "No";
        }

        return "";
    }

    createDocumentUploadPayload(file, documentType) {
        const normalizedType = String(documentType || "General").trim() || "General";
        const fileUrl = `/uploads/onboarding-documents/${file.filename}`;

        return {
            documentType: normalizedType,
            fileName: file.originalname || file.filename,
            fileUrl,
            file_url: fileUrl,
            storedName: file.filename,
            mimeType: file.mimetype || null,
            size: file.size || null,
        };
    }

    async ensureOnboardingInfoLink(cifid, transaction) {
        const existingLink = await db.Onboarding.findOne({
            where: { cifid },
            transaction,
        });

        if (existingLink?.onboardinginfoid) {
            return existingLink.onboardinginfoid;
        }

        const onboardingInfo = await db.OnboardingInfo.create(
            {
                cifid,
            },
            { transaction }
        );

        await this.upsertSectionRecord(
            db.Onboarding,
            { cifid },
            {
                cifid,
                onboardinginfoid: onboardingInfo.onboardinginfoid,
            },
            transaction
        );

        return onboardingInfo.onboardinginfoid;
    }

    async ensureOnboardingBankLink(cifid, onboardinginfoid, transaction) {
        const existingBank = await db.OnboardingBank.findOne({
            where: { cifid },
            order: [["bid", "DESC"]],
            transaction,
        });

        if (existingBank?.bid) {
            if (existingBank.onboardinginfoid !== onboardinginfoid) {
                await existingBank.update({ onboardinginfoid }, { transaction });
            }
            return existingBank.bid;
        }

        const createdBank = await db.OnboardingBank.create(
            {
                cifid,
                onboardinginfoid,
                accountHolderName: "N/A",
                accountNumber: "N/A",
                ifscCode: "N/A",
                bankName: "N/A",
                branchName: null,
            },
            { transaction }
        );

        return createdBank.bid;
    }

    async saveUploadedDocument(cifid, file, documentType) {
        const parsedCifId = Number(cifid);
        if (!parsedCifId) {
            throw new Error("Valid CIF ID is required to store document in database.");
        }

        return db.sequelize.transaction(async (transaction) => {
            const uploadData = this.createDocumentUploadPayload(file, documentType);
            const onboardinginfoid = await this.ensureOnboardingInfoLink(
                parsedCifId,
                transaction
            );
            const bid = await this.ensureOnboardingBankLink(
                parsedCifId,
                onboardinginfoid,
                transaction
            );

            const supportsFileUrl = await this.onboardingDocumentSupportsFileUrl(transaction);

            const existingDocument = await db.OnboardingDocument.findOne({
                where: {
                    cifid: parsedCifId,
                    documentType: uploadData.documentType,
                    fileName: uploadData.fileName,
                },
                transaction,
            });

            const payload = {
                cifid: parsedCifId,
                onboardinginfoid,
                documentType: uploadData.documentType,
                fileName: uploadData.fileName,
                bid,
            };

            if (supportsFileUrl) {
                payload.fileUrl = uploadData.fileUrl;
            }

            let savedDoc;
            if (existingDocument) {
                savedDoc = await existingDocument.update(payload, { transaction });
            } else {
                savedDoc = await db.OnboardingDocument.create(payload, { transaction });
            }

            return {
                ...uploadData,
                did: savedDoc?.did || null,
                cifid: parsedCifId,
                onboardinginfoid,
            };
        });
    }

    sanitizeDocumentsForSnapshot(documents) {
        if (!Array.isArray(documents)) {
            return [];
        }

        const uniqueDocuments = [];
        const seen = new Set();

        documents.forEach((doc) => {
            const documentType = String(doc?.documentType || doc?.type || "").trim();
            const fileName = String(doc?.fileName || doc?.name || "").trim();
            const fileUrl = String(doc?.fileUrl || doc?.file_url || "").trim();

            if (!fileName) {
                return;
            }

            const key = `${documentType.toLowerCase()}::${fileName.toLowerCase()}`;
            if (seen.has(key)) {
                return;
            }

            seen.add(key);
            uniqueDocuments.push({
                documentType,
                fileName,
                fileUrl,
            });
        });

        return uniqueDocuments;
    }

    buildSnapshotFormData(formData) {
        if (!formData || typeof formData !== "object") {
            return {};
        }

        return {
            ...formData,
            documents: this.sanitizeDocumentsForSnapshot(formData.documents),
        };
    }

    hasText(value) {
        return Boolean(String(value || "").trim());
    }

    formatValidationSummary(errors) {
        const labels = [...new Set(
            errors
                .map((item) => {
                    if (!item) return "";
                    const field = typeof item === "string" ? item : item?.field || "";
                    if (!field) return "";

                    return String(field)
                        .replace(/^Employment Information: /, "")
                        .replace(/^Address Section: /, "")
                        .replace(/^Education Details: /, "")
                        .replace(/^Experience Details: /, "")
                        .replace(/^Basic Details: /, "")
                        .replace(/^Icebreaker: /, "")
                        .replace(/currentAddress\./g, "Current Address > ")
                        .replace(/permanentAddress\./g, "Permanent Address > ")
                        .replace(/reportingHead/g, "Reporting Head")
                        .replace(/uanNumber/g, "UAN Number")
                        .replace(/panNumber/g, "PAN Number")
                        .replace(/currentSalary/g, "Current Salary")
                        .replace(/education/g, "Education")
                        .replace(/experience/g, "Experience")
                        .replace(/line1/g, "Line 1")
                        .replace(/city/g, "City")
                        .replace(/state/g, "State")
                        .replace(/pincode/g, "Pincode")
                        .replace(/qualification/g, "Qualification")
                        .replace(/institution/g, "Institution")
                        .replace(/board/g, "Board / University")
                        .replace(/year/g, "Year")
                        .replace(/percentage/g, "Percentage")
                        .replace(/company/g, "Company")
                        .replace(/designation/g, "Designation")
                        .replace(/startDate/g, "Start Date")
                        .replace(/totalExp/g, "Total Experience")
                        .replace(/\./g, " > ")
                        .replace(/\s+>\s+/g, " > ")
                        .replace(/\s+/g, " ")
                        .trim();
                })
                .filter(Boolean)
        )];

        return labels.length > 0 ? labels.join(", ") : "required fields";
    }

    validateFinalFormData(formData) {
        const errors = [];
        const currentAddress = formData.currentAddress || {};
        const permanentAddress = formData.permanentAddress || {};
        const icebreaker = formData.icebreaker || {};
        const education = Array.isArray(formData.education) ? formData.education : [];
        const experience = Array.isArray(formData.experience) ? formData.experience : [];

        const requiredBasicFields = [
            ["firstName", "Basic Details: firstName"],
            ["lastName", "Basic Details: lastName"],
            ["employeeId", "Basic Details: employeeId"],
            ["personalEmail", "Basic Details: personalEmail"],
            ["personalPhone", "Basic Details: personalPhone"],
            ["officialEmail", "Basic Details: officialEmail"],
            ["officePhone", "Basic Details: officePhone"],
            ["gender", "Basic Details: gender"],
            ["maritalStatus", "Basic Details: maritalStatus"],
            ["dateOfBirth", "Basic Details: dateOfBirth"],
            ["dateOfJoining", "Basic Details: dateOfJoining"],
        ];

        requiredBasicFields.forEach(([key, label]) => {
            if (!this.hasText(formData[key])) {
                errors.push(label);
            }
        });

        const requiredEmploymentFields = [
            ["employeeType", "Employment Information: employeeType"],
            ["erpRole", "Employment Information: erpRole"],
            ["sourceOfHire", "Employment Information: sourceOfHire"],
            ["department", "Employment Information: department"],
            ["designation", "Employment Information: designation"],
            ["reportingHead", "Employment Information: reportingHead"],
            ["uanNumber", "Employment Information: uanNumber"],
            ["panNumber", "Employment Information: panNumber"],
            ["currentSalary", "Employment Information: currentSalary"],
        ];

        requiredEmploymentFields.forEach(([key, label]) => {
            if (!this.hasText(formData[key])) {
                errors.push(label);
            }
        });

        const addressChecks = [
            [currentAddress.line1, "Address Section: currentAddress.line1"],
            [currentAddress.city, "Address Section: currentAddress.city"],
            [currentAddress.state, "Address Section: currentAddress.state"],
            [currentAddress.pincode, "Address Section: currentAddress.pincode"],
            [permanentAddress.line1, "Address Section: permanentAddress.line1"],
            [permanentAddress.city, "Address Section: permanentAddress.city"],
            [permanentAddress.state, "Address Section: permanentAddress.state"],
            [permanentAddress.pincode, "Address Section: permanentAddress.pincode"],
        ];

        addressChecks.forEach(([value, label]) => {
            if (!this.hasText(value)) {
                errors.push(label);
            }
        });

        if (education.length === 0) {
            errors.push("Education Details: at least one education entry is required");
        } else {
            const validEducation = education.some(
                (edu) =>
                    this.hasText(edu?.qualification) &&
                    (this.hasText(edu?.institution) || this.hasText(edu?.board)) &&
                    this.hasText(edu?.year) &&
                    this.hasText(edu?.percentage)
            );
            if (!validEducation) {
                errors.push(
                    "Education Details: one complete entry with qualification, institution/board, year, and percentage is required"
                );
            }
        }

        if (experience.length === 0) {
            errors.push("Experience Details: at least one experience entry is required");
        } else {
            const validExperience = experience.some(
                (exp) =>
                    this.hasText(exp?.company) &&
                    this.hasText(exp?.designation) &&
                    this.hasText(exp?.startDate) &&
                    this.hasText(exp?.totalExp)
            );
            if (!validExperience) {
                errors.push(
                    "Experience Details: one complete entry with company, designation, startDate, and totalExp is required"
                );
            }
        }

        const icebreakerChecks = [
            [icebreaker.favoriteCake, "Icebreaker: favoriteCake"],
            [icebreaker.favoriteColor, "Icebreaker: favoriteColor"],
            [icebreaker.favoriteSong, "Icebreaker: favoriteSong"],
            [icebreaker.favoriteMovie, "Icebreaker: favoriteMovie"],
            [icebreaker.favoriteFood, "Icebreaker: favoriteFood"],
            [icebreaker.favoriteActor, "Icebreaker: favoriteActor"],
            [icebreaker.dreamVacation, "Icebreaker: dreamVacation"],
            [icebreaker.weekendActivity, "Icebreaker: weekendActivity"],
            [icebreaker.coffeeOrTea, "Icebreaker: coffeeOrTea"],
            [icebreaker.favoriteSports, "Icebreaker: favoriteSports"],
        ];

        icebreakerChecks.forEach(([value, label]) => {
            if (!this.hasText(value)) {
                errors.push(label);
            }
        });

        if (errors.length > 0) {
            const summary = this.formatValidationSummary(errors);
            const error = new Error(
                `FINAL submission validation failed. Missing required fields: ${summary}`
            );
            error.status = 400;
            error.code = "ONBOARDING_FINAL_VALIDATION_FAILED";
            error.errors = errors.map((field) => ({ field, message: "Required" }));
            throw error;
        }
    }

    buildOnboardingInfoPayload(
        cifid,
        formData,
        personal,
        academicId,
        experienceId,
        defaultDepartmentId
    ) {
        const currentAddress = formData.currentAddress || {};
        const permanentAddress = formData.permanentAddress || {};
        const icebreaker = formData.icebreaker || {};

        const today = new Date().toISOString().slice(0, 10);
        const officialEmail =
            formData.officialEmail ||
            formData.personalEmail ||
            `onboard-${Date.now()}@local.invalid`;
        const officialPhone =
            formData.officePhone || formData.personalPhone || `${Date.now()}`.slice(-10);
        const employeeType = String(formData.employeeType || "").toLowerCase();
        const emptype = employeeType === "permanent" ? "Permanent" : "Trainee";
        const rawRole = String(formData.erpRole || "").toLowerCase();
        const erprole =
            rawRole === "admin"
                ? "Admin"
                : rawRole === "superadmin" || rawRole === "super admin"
                ? "Superadmin"
                : rawRole === "manager"
                ? "Manager"
                : "Team Member";
        const rawHireSource = String(formData.sourceOfHire || "").toLowerCase();
        const hiresource =
            rawHireSource === "website"
                ? "Website"
                : rawHireSource === "direct"
                ? "Direct"
                : "Referal";
        const salaryNum = parseInt(String(formData.currentSalary || "0").replace(/\D/g, ""), 10);
        const uanNum = parseInt(String(formData.uanNumber || "0").replace(/\D/g, ""), 10);
        const aadhaarNum = parseInt(String(formData.aadharNumber || "0").replace(/\D/g, ""), 10);

        const departmentNum = Number(formData.department);
        const departmentValue =
            Number.isFinite(departmentNum) && departmentNum > 0
                ? departmentNum
                : defaultDepartmentId;

        return {
            cifid,
            officialemail: officialEmail,
            officialphone: officialPhone,
            doj: formData.dateOfJoining || today,
            emptype,
            erprole,
            hiresource,
            department: departmentValue,
            designation: formData.designation || "Employee",
            reportHead: formData.reportingHead || null,
            uanno: Number.isFinite(uanNum) ? uanNum : 0,
            aadharno: Number.isFinite(aadhaarNum) ? aadhaarNum : 0,
            panno: formData.panNumber || null,
            salary: Number.isFinite(salaryNum) ? salaryNum : 0,
            eid: experienceId,
            academicid: academicId,

            employeeId: formData.employeeId || null,
            firstName: formData.firstName || null,
            lastName: formData.lastName || null,
            nickName: formData.nickName || null,
            personalEmail: formData.personalEmail || personal.email || null,
            personalPhone: formData.personalPhone || personal.phoneNumber || null,
            gender: formData.gender || personal.gender || null,
            maritalStatus: formData.maritalStatus || personal.maritalStatus || null,
            dateOfBirth: formData.dateOfBirth || personal.DOB || null,
            manager: formData.manager || null,
            referral: formData.referral || null,
            permanent: formData.permanent || null,
            systemAdmin: formData.systemAdmin || null,
            superAdmin: formData.superAdmin || null,

            currentAddressLine1: currentAddress.line1 || null,
            currentAddressLine2: currentAddress.line2 || null,
            currentCity: currentAddress.city || null,
            currentState: currentAddress.state || null,
            currentPincode: currentAddress.pincode || null,
            permanentAddressLine1: permanentAddress.line1 || null,
            permanentAddressLine2: permanentAddress.line2 || null,
            permanentCity: permanentAddress.city || null,
            permanentState: permanentAddress.state || null,
            permanentPincode: permanentAddress.pincode || null,

            experienceDetails: Array.isArray(formData.experience)
                ? formData.experience
                : [],
            educationDetails: Array.isArray(formData.education)
                ? formData.education
                : [],

            favoriteCake: icebreaker.favoriteCake || null,
            favoriteColor: icebreaker.favoriteColor || null,
            favoriteSong: icebreaker.favoriteSong || null,
            favoriteMovie: icebreaker.favoriteMovie || null,
            favoriteFood: icebreaker.favoriteFood || null,
            favoriteActor: icebreaker.favoriteActor || null,
            dreamVacation: icebreaker.dreamVacation || null,
            weekendActivity: icebreaker.weekendActivity || null,
            coffeeOrTea: icebreaker.coffeeOrTea || null,
            favoriteSports: icebreaker.favoriteSports || null,
        };
    }

    async upsertSectionRecord(model, where, payload, transaction) {
        const existing = await model.findOne({ where, transaction });
        if (existing) {
            await existing.update(payload, { transaction });
            return existing;
        }

        return model.create(payload, { transaction });
    }

    isMissingTableError(error) {
        const message = String(error?.message || "").toLowerCase();
        return (
            error?.original?.code === "ER_NO_SUCH_TABLE" ||
            message.includes("doesn't exist") ||
            message.includes("no such table")
        );
    }

    isMissingFileUrlColumnError(error) {
        const message = String(error?.message || "").toLowerCase();
        return (
            error?.original?.code === "ER_BAD_FIELD_ERROR" &&
            message.includes("unknown column") &&
            message.includes("file_url")
        );
    }

    async onboardingDocumentSupportsFileUrl(transaction) {
        if (typeof this._onboardingDocumentFileUrlColumnAvailable === "boolean") {
            return this._onboardingDocumentFileUrlColumnAvailable;
        }

        try {
            const rows = await db.sequelize.query(
                "SHOW COLUMNS FROM onboarding_documents LIKE 'file_url'",
                {
                    type: QueryTypes.SELECT,
                    transaction,
                }
            );
            this._onboardingDocumentFileUrlColumnAvailable = rows.length > 0;
            return this._onboardingDocumentFileUrlColumnAvailable;
        } catch (error) {
            if (this.isMissingTableError(error)) {
                this._onboardingDocumentFileUrlColumnAvailable = false;
                return false;
            }

            throw error;
        }
    }

    async getOnboardingDocumentRows(cifid, transaction) {
        try {
            return await db.OnboardingDocument.findAll({ where: { cifid }, transaction });
        } catch (error) {
            if (this.isMissingFileUrlColumnError(error)) {
                this._onboardingDocumentFileUrlColumnAvailable = false;
                return db.OnboardingDocument.findAll({
                    where: { cifid },
                    transaction,
                    attributes: [
                        "did",
                        "cifid",
                        "onboardinginfoid",
                        "documentType",
                        "fileName",
                        "bid",
                        "createdAt",
                        "updatedAt",
                        "deletedAt",
                    ],
                });
            }

            if (this.isMissingTableError(error)) {
                return [];
            }

            throw error;
        }
    }

    async getOnboardingEducationRows(cifid) {
        try {
            return await db.OnboardingEducation.findAll({ where: { cifid } });
        } catch (error) {
            if (this.isMissingTableError(error)) {
                return [];
            }
            throw error;
        }
    }

    async getOnboardingExperienceRows(cifid) {
        try {
            return await db.OnboardingExperience.findAll({ where: { cifid } });
        } catch (error) {
            if (this.isMissingTableError(error)) {
                return [];
            }
            throw error;
        }
    }

    async syncOnboardingEducationAndExperience(cifid, formData, transaction) {
        const education = Array.isArray(formData.education) ? formData.education : [];
        const experience = Array.isArray(formData.experience) ? formData.experience : [];

        try {
            await db.OnboardingEducation.destroy({
                where: { cifid },
                force: true,
                transaction,
            });
            await db.OnboardingExperience.destroy({
                where: { cifid },
                force: true,
                transaction,
            });

            if (education.length > 0) {
                const educationRows = education.map((edu) => ({
                    cifid,
                    qualification: String(edu?.qualification || "").trim() || null,
                    institution: String(edu?.institution || "").trim() || null,
                    board: String(edu?.board || "").trim() || null,
                    year: String(edu?.year || "").trim() || null,
                    percentage: String(edu?.percentage || "").trim() || null,
                }));

                await db.OnboardingEducation.bulkCreate(educationRows, { transaction });
            }

            if (experience.length > 0) {
                const experienceRows = experience.map((exp) => ({
                    cifid,
                    company: String(exp?.company || "").trim() || null,
                    designation: String(exp?.designation || "").trim() || null,
                    startDate: exp?.startDate || null,
                    endDate: exp?.endDate || null,
                    totalExp: String(exp?.totalExp || "").trim() || null,
                    reason: String(exp?.reason || "").trim() || null,
                }));

                await db.OnboardingExperience.bulkCreate(experienceRows, {
                    transaction,
                });
            }
        } catch (error) {
            if (this.isMissingTableError(error)) {
                return;
            }
            throw error;
        }
    }

    async persistLinkedOnboardingSections(cifid, formData, personal, transaction) {
        const academicTop = await db.CifAcademic.findOne({
            where: { cifid },
            order: [["academicid", "DESC"]],
            transaction,
        });

        const experienceTop = await db.CifExperience.findOne({
            where: { cifid },
            order: [["eid", "DESC"]],
            transaction,
        });

        const defaultDepartment = await db.Department.findOne({
            attributes: ["id"],
            order: [["id", "ASC"]],
            transaction,
        });

        if (!defaultDepartment?.id) {
            throw new Error(
                "No department found. Please create at least one department before saving onboarding sections."
            );
        }

        const onboardingInfoPayload = this.buildOnboardingInfoPayload(
            cifid,
            formData,
            personal,
            academicTop?.academicid,
            experienceTop?.eid,
            defaultDepartment.id
        );

        const onboardingLink = await db.Onboarding.findOne({
            where: { cifid },
            transaction,
        });

        let onboardingInfo = null;
        if (onboardingLink?.onboardinginfoid) {
            onboardingInfo = await db.OnboardingInfo.findByPk(
                onboardingLink.onboardinginfoid,
                { transaction }
            );
        }

        if (onboardingInfo) {
            await onboardingInfo.update(onboardingInfoPayload, { transaction });
        } else {
            onboardingInfo = await db.OnboardingInfo.create(onboardingInfoPayload, {
                transaction,
            });
        }

        await this.upsertSectionRecord(
            db.Onboarding,
            { cifid },
            {
                cifid,
                onboardinginfoid: onboardingInfo.onboardinginfoid,
            },
            transaction
        );

        const health = formData.health || {};
        await this.upsertSectionRecord(
            db.OnboardingHealth,
            { cifid },
            {
                cifid,
                onboardinginfoid: onboardingInfo.onboardinginfoid,
                takingTablets: this.parseBoolean(health.anyTablets),
                healthIssues: health.healthIssues || null,
                bloodGroup: health.bloodGroup || null,
                medicalAssistanceNeeded: this.parseBoolean(health.medicalAssistance),
                emergencyContactName: health.emergencyName || null,
                emergencyContactNumber: health.emergencyNumber || null,
            },
            transaction
        );

        const bankDetails = formData.bankDetails || {};
        const bankRecord = await this.upsertSectionRecord(
            db.OnboardingBank,
            { cifid },
            {
                cifid,
                onboardinginfoid: onboardingInfo.onboardinginfoid,
                accountHolderName: bankDetails.accountHolder || "N/A",
                accountNumber: bankDetails.accountNumber || "N/A",
                ifscCode: bankDetails.ifscCode || "N/A",
                bankName: bankDetails.bankName || "N/A",
                branchName: bankDetails.branchName || null,
            },
            transaction
        );

        const officeTour = formData.officeTour || {};
        await this.upsertSectionRecord(
            db.OnboardingOffice,
            { cifid },
            {
                cifid,
                onboardinginfoid: onboardingInfo.onboardinginfoid,
                reception: Boolean(officeTour.reception),
                workstationSheet: Boolean(officeTour.workstation),
                meetingRoom: Boolean(officeTour.meetingRoom),
                cafeteria: Boolean(officeTour.cafeteria),
                hrCabin: Boolean(officeTour.hrCabin),
            },
            transaction
        );

        const induction = formData.induction || {};
        await this.upsertSectionRecord(
            db.OnboardInduction,
            { cifid },
            {
                cifid,
                onboardinginfoid: onboardingInfo.onboardinginfoid,
                companyIntroduction: Boolean(induction.companyIntro),
                hrPolicies: Boolean(induction.hrPolicies),
                attendanceRules: Boolean(induction.attendanceRules),
                leavePolicy: Boolean(induction.leavePolicy),
                securityGuidelines: Boolean(induction.securityGuidelines),
                teamIntroduction: Boolean(induction.teamIntro),
            },
            transaction
        );

        const kit = formData.kit || {};
        await this.upsertSectionRecord(
            db.OnboardEquipment,
            { cifid },
            {
                cifid,
                onboardinginfoid: onboardingInfo.onboardinginfoid,
                laptop: Boolean(kit.laptop),
                mouse: Boolean(kit.mouse),
                keyboard: Boolean(kit.keyboard),
                entryCardRecognition: Boolean(kit.entryCard),
                headset: Boolean(kit.headset),
                welcomeKit: Boolean(kit.welcomeKit),
            },
            transaction
        );

        const docs = this.sanitizeDocumentsForSnapshot(formData.documents).map((doc) => ({
            documentType: doc.documentType || "General",
            fileName: doc.fileName,
            fileUrl: doc.fileUrl || "",
        }));

        const supportsFileUrl = await this.onboardingDocumentSupportsFileUrl(transaction);
        const existingDocumentsInTx = await this.getOnboardingDocumentRows(
            cifid,
            transaction
        );

        const existingByKey = new Map(
            existingDocumentsInTx.map((doc) => [
                `${String(doc.documentType || "").trim().toLowerCase()}::${String(
                    doc.fileName || ""
                )
                    .trim()
                    .toLowerCase()}`,
                doc,
            ])
        );

        const incomingKeys = new Set();
        for (const doc of docs) {
            const key = `${doc.documentType.toLowerCase()}::${doc.fileName.toLowerCase()}`;
            incomingKeys.add(key);

            const existingDoc = existingByKey.get(key);
            if (existingDoc) {
                const updatePayload = {
                    onboardinginfoid: onboardingInfo.onboardinginfoid,
                    bid: bankRecord?.bid || null,
                };
                if (supportsFileUrl) {
                    updatePayload.fileUrl = doc.fileUrl || existingDoc.fileUrl || null;
                }

                await existingDoc.update(
                    updatePayload,
                    { transaction }
                );
                continue;
            }

            const createPayload = {
                cifid,
                onboardinginfoid: onboardingInfo.onboardinginfoid,
                documentType: doc.documentType,
                fileName: doc.fileName,
                bid: bankRecord?.bid || null,
            };
            if (supportsFileUrl) {
                createPayload.fileUrl = doc.fileUrl || null;
            }

            await db.OnboardingDocument.create(
                createPayload,
                { transaction }
            );
        }

        const documentsToDelete = existingDocumentsInTx.filter((doc) => {
            const key = `${String(doc.documentType || "").trim().toLowerCase()}::${String(
                doc.fileName || ""
            )
                .trim()
                .toLowerCase()}`;
            return !incomingKeys.has(key);
        });

        for (const doc of documentsToDelete) {
            await doc.destroy({ transaction });
        }
    }

    async saveRecord(payload) {
        const cifid = Number(payload?.cifid);
        const status = this.normalizeStatus(payload?.status);
        const formData = payload?.formData || {};
        const snapshotFormData = this.buildSnapshotFormData(formData);
        const experienceDetails = Array.isArray(formData.experience)
            ? formData.experience
            : [];
        const educationDetails = Array.isArray(formData.education)
            ? formData.education
            : [];

        if (!cifid) {
            throw new Error("CIF ID is required.");
        }

        if (status === "DRAFT") {
            return db.sequelize.transaction(async (transaction) => {
                const personal = await db.CifPersonal.findByPk(cifid, {
                    transaction,
                    lock: transaction.LOCK.UPDATE,
                });

                if (!personal) {
                    throw new Error("CIF personal record not found.");
                }

                const existing = await db.OnboardingRecord.findOne({
                    where: { cifid },
                    transaction,
                    lock: transaction.LOCK.UPDATE,
                });

                if (existing) {
                    await existing.update(
                        {
                            status,
                            formData: snapshotFormData,
                            experienceDetails,
                            educationDetails,
                        },
                        { transaction }
                    );

                    await this.syncOnboardingEducationAndExperience(
                        cifid,
                        formData,
                        transaction
                    );

                    await this.persistLinkedOnboardingSections(
                        cifid,
                        formData,
                        personal,
                        transaction
                    );
                    return existing;
                }

                const created = await db.OnboardingRecord.create(
                    {
                        cifid,
                        status,
                        experienceDetails,
                        educationDetails,
                        formData: snapshotFormData,
                    },
                    { transaction }
                );

                await this.syncOnboardingEducationAndExperience(
                    cifid,
                    formData,
                    transaction
                );

                await this.persistLinkedOnboardingSections(
                    cifid,
                    formData,
                    personal,
                    transaction
                );

                return created;
            });
        }

        if (status === "FINAL") {
            this.validateFinalFormData(formData);
        }

        return db.sequelize.transaction(async (transaction) => {
            const personal = await db.CifPersonal.findByPk(cifid, {
                transaction,
                lock: transaction.LOCK.UPDATE,
            });
            if (!personal) {
                throw new Error("CIF personal record not found.");
            }

            const fullName = `${String(formData.firstName || "").trim()} ${String(
                formData.lastName || ""
            ).trim()}`.trim();
            const currentAddress = formData.currentAddress || {};
            const addressValue = [currentAddress.line1, currentAddress.line2]
                .filter((item) => Boolean(String(item || "").trim()))
                .join(", ");

            const gender = ["Male", "Female"].includes(formData.gender)
                ? formData.gender
                : personal.gender;
            const maritalStatus = ["Single", "Married"].includes(formData.maritalStatus)
                ? formData.maritalStatus
                : personal.maritalStatus;

            await personal.update(
                {
                    fullName: this.pickValue(fullName, personal.fullName),
                    email: this.pickValue(formData.personalEmail, personal.email),
                    phoneNumber: this.pickValue(formData.personalPhone, personal.phoneNumber),
                    DOB: this.pickValue(formData.dateOfBirth, personal.DOB),
                    address: this.pickValue(addressValue, personal.address),
                    city: this.pickValue(currentAddress.city, personal.city),
                    state: this.pickValue(currentAddress.state, personal.state),
                    pinCode: this.pickValue(currentAddress.pincode, personal.pinCode),
                    gender,
                    maritalStatus,
                },
                { transaction }
            );

            if (Array.isArray(formData.education)) {
                const educationRows = formData.education
                    .map((edu) => ({
                        cifid,
                        degree: String(edu?.qualification || "").trim(),
                        university: String(edu?.institution || edu?.board || "").trim(),
                        graduationYear: Number(edu?.year),
                        grade: String(edu?.percentage || "N/A").trim(),
                        city: String(currentAddress.city || personal.city || "N/A").trim(),
                    }))
                    .filter(
                        (row) =>
                            row.degree &&
                            row.university &&
                            Number.isFinite(row.graduationYear)
                    );

                if (educationRows.length > 0) {
                    const existingAcademics = await db.CifAcademic.findAll({
                        where: { cifid },
                        order: [["academicid", "ASC"]],
                        transaction,
                    });

                    for (let index = 0; index < educationRows.length; index += 1) {
                        const row = educationRows[index];
                        const existingAcademic = existingAcademics[index];

                        if (existingAcademic) {
                            await existingAcademic.update(row, { transaction });
                        } else {
                            await db.CifAcademic.create(row, { transaction });
                        }
                    }
                }
            }

            if (Array.isArray(formData.experience)) {
                const experienceRows = formData.experience
                    .map((exp) => ({
                        cifid,
                        companyName: String(exp?.company || "").trim(),
                        location: String(
                            exp?.location || currentAddress.city || personal.city || "N/A"
                        ).trim(),
                        role: String(exp?.designation || "").trim(),
                        startDate: exp?.startDate || null,
                        endDate: exp?.endDate || null,
                        totalExperience: this.parseExperienceTotal(exp?.totalExp),
                        reasonForLeaving: String(exp?.reason || "").trim() || null,
                    }))
                    .filter(
                        (row) =>
                            row.companyName &&
                            row.role &&
                            row.startDate &&
                            Number.isFinite(row.totalExperience)
                    );

                if (experienceRows.length > 0) {
                    const existingExperiences = await db.CifExperience.findAll({
                        where: { cifid },
                        order: [["eid", "ASC"]],
                        transaction,
                    });

                    for (let index = 0; index < experienceRows.length; index += 1) {
                        const row = experienceRows[index];
                        const existingExperience = existingExperiences[index];

                        if (existingExperience) {
                            await existingExperience.update(row, { transaction });
                        } else {
                            await db.CifExperience.create(row, { transaction });
                        }
                    }
                }
            }

            await this.syncOnboardingEducationAndExperience(
                cifid,
                formData,
                transaction
            );

            await this.persistLinkedOnboardingSections(
                cifid,
                formData,
                personal,
                transaction
            );

            const existing = await db.OnboardingRecord.findOne({
                where: { cifid },
                transaction,
            });

            let onboardingRecord;
            if (existing) {
                await existing.update(
                    {
                        status,
                        formData: snapshotFormData,
                        experienceDetails,
                        educationDetails,
                    },
                    { transaction }
                );
                onboardingRecord = existing;
            } else {
                onboardingRecord = await db.OnboardingRecord.create(
                    {
                        cifid,
                        status,
                        experienceDetails,
                        educationDetails,
                        formData: snapshotFormData,
                    },
                    { transaction }
                );
            }

            if (status === "FINAL") {
                const employeeCode = String(formData.employeeId || "").trim();
                const officialEmail = String(formData.officialEmail || formData.personalEmail || personal.email).trim();
                
                if (employeeCode) {
                    const [skills, softwares, languages, references, docs] = await Promise.all([
                        db.CifSkill.findAll({ where: { cifid }, transaction }),
                        db.CifSoftware.findAll({ where: { cifid }, transaction }),
                        db.CifLanguage.findAll({ where: { cifid }, transaction }),
                        db.CifReference.findAll({ where: { cifid }, transaction }),
                        this.getOnboardingDocumentRows(cifid, transaction)
                    ]);
                    
                    let resumeData = {};
                    if (docs && docs.length > 0) {
                        const resumeDoc = docs.find(d => d.documentType && d.documentType.toLowerCase().includes('resume'));
                        if (resumeDoc) {
                            resumeData = {
                                resumeOriginalName: resumeDoc.fileName,
                                resumeStoredName: resumeDoc.fileName,
                                portfolioLink: resumeDoc.fileUrl || resumeDoc.file_url || null
                            };
                        }
                    }

                    const employeePayload = {
                        employeeCode,
                        jobPosition: String(formData.designation || "Employee").trim(),
                        fullName: fullName || personal.fullName || "Employee",
                        email: officialEmail || `emp-${employeeCode}@local.invalid`,
                        phone: String(formData.officePhone || formData.personalPhone || personal.phoneNumber).trim() || "N/A",
                        dateOfBirth: formData.dateOfBirth || personal.DOB || null,
                        city: currentAddress.city || personal.city || null,
                        pinCode: currentAddress.pincode || personal.pinCode || null,
                        gender,
                        ...resumeData,
                        education: educationDetails || [],
                        workExperience: experienceDetails || [],
                        skills: skills.map(s => s.toJSON()),
                        softwareTools: softwares.map(s => s.toJSON()),
                        languages: languages.map(l => l.toJSON()),
                        references: references.map(r => r.toJSON()),
                        consent: true,
                        status: "Active"
                    };

                    const existingEmployee = await db.Employee.findOne({
                        where: {
                            [db.Sequelize.Op.or]: [
                                { employeeCode },
                                { email: employeePayload.email }
                            ]
                        },
                        transaction
                    });

                    if (existingEmployee) {
                        await existingEmployee.update(employeePayload, { transaction });
                    } else {
                        await db.Employee.create(employeePayload, { transaction });
                    }
                }
            }

            return onboardingRecord;
        });
    }

    async updateRecordByCifId(cifid, payload) {
        const record = await db.OnboardingRecord.findOne({
            where: { cifid: Number(cifid) },
        });

        if (!record) {
            throw new Error("Onboarding record not found.");
        }

        return this.saveRecord({
            ...payload,
            cifid: Number(cifid),
        });
    }

    async getRecordByCifId(cifid) {
        const parsedCifId = Number(cifid);

        const onboardingLink = await db.Onboarding.findOne({
            where: { cifid: parsedCifId },
        });

        const onboardingInfoPromise = onboardingLink?.onboardinginfoid
            ? db.OnboardingInfo.findByPk(onboardingLink.onboardinginfoid)
            : Promise.resolve(null);

        const [
            record,
            personal,
            onboardingInfo,
            health,
            bank,
            office,
            induction,
            equipment,
            onboardingEducationRows,
            onboardingExperienceRows,
            educationRows,
            experienceRows,
            documentRows,
        ] = await Promise.all([
            db.OnboardingRecord.findOne({ where: { cifid: parsedCifId } }),
            db.CifPersonal.findByPk(parsedCifId),
            onboardingInfoPromise,
            db.OnboardingHealth.findOne({ where: { cifid: parsedCifId } }),
            db.OnboardingBank.findOne({ where: { cifid: parsedCifId } }),
            db.OnboardingOffice.findOne({ where: { cifid: parsedCifId } }),
            db.OnboardInduction.findOne({ where: { cifid: parsedCifId } }),
            db.OnboardEquipment.findOne({ where: { cifid: parsedCifId } }),
            this.getOnboardingEducationRows(parsedCifId),
            this.getOnboardingExperienceRows(parsedCifId),
            db.CifAcademic.findAll({ where: { cifid: parsedCifId } }),
            db.CifExperience.findAll({ where: { cifid: parsedCifId } }),
            this.getOnboardingDocumentRows(parsedCifId),
        ]);

        if (!record && !onboardingInfo) {
            return null;
        }

        const existingData = record?.formData || {};
        const formData = {
            ...existingData,
            firstName:
                onboardingInfo?.firstName ||
                existingData.firstName ||
                String(personal?.fullName || "").split(" ")[0] ||
                "",
            lastName:
                onboardingInfo?.lastName ||
                existingData.lastName ||
                String(personal?.fullName || "").split(" ").slice(1).join(" ") ||
                "",
            nickName: onboardingInfo?.nickName || existingData.nickName || "",
            employeeId: onboardingInfo?.employeeId || existingData.employeeId || "",
            officialEmail:
                onboardingInfo?.officialemail || existingData.officialEmail || "",
            personalEmail:
                onboardingInfo?.personalEmail ||
                existingData.personalEmail ||
                personal?.email ||
                "",
            personalPhone:
                onboardingInfo?.personalPhone ||
                existingData.personalPhone ||
                personal?.phoneNumber ||
                "",
            officePhone:
                onboardingInfo?.officialphone || existingData.officePhone || "",
            gender: onboardingInfo?.gender || existingData.gender || personal?.gender || "",
            maritalStatus:
                onboardingInfo?.maritalStatus ||
                existingData.maritalStatus ||
                personal?.maritalStatus ||
                "",
            dateOfBirth:
                onboardingInfo?.dateOfBirth || existingData.dateOfBirth || personal?.DOB || "",
            dateOfJoining:
                onboardingInfo?.doj || existingData.dateOfJoining || "",

            employeeType: onboardingInfo?.emptype || existingData.employeeType || "",
            erpRole: onboardingInfo?.erprole || existingData.erpRole || "",
            sourceOfHire:
                onboardingInfo?.hiresource || existingData.sourceOfHire || "",
            department: onboardingInfo?.department || existingData.department || "",
            permanent: onboardingInfo?.permanent || existingData.permanent || "",
            manager: onboardingInfo?.manager || existingData.manager || "",
            referral: onboardingInfo?.referral || existingData.referral || "",
            designation: onboardingInfo?.designation || existingData.designation || "",
            reportingHead:
                onboardingInfo?.reportHead || existingData.reportingHead || "",
            uanNumber: onboardingInfo?.uanno || existingData.uanNumber || "",
            panNumber: onboardingInfo?.panno || existingData.panNumber || "",
            currentSalary: onboardingInfo?.salary || existingData.currentSalary || "",
            systemAdmin: onboardingInfo?.systemAdmin || existingData.systemAdmin || "",
            superAdmin: onboardingInfo?.superAdmin || existingData.superAdmin || "",

            currentAddress: {
                line1:
                    onboardingInfo?.currentAddressLine1 ||
                    existingData.currentAddress?.line1 ||
                    "",
                line2:
                    onboardingInfo?.currentAddressLine2 ||
                    existingData.currentAddress?.line2 ||
                    "",
                city:
                    onboardingInfo?.currentCity ||
                    existingData.currentAddress?.city ||
                    personal?.city ||
                    "",
                state:
                    onboardingInfo?.currentState ||
                    existingData.currentAddress?.state ||
                    personal?.state ||
                    "",
                pincode:
                    onboardingInfo?.currentPincode ||
                    existingData.currentAddress?.pincode ||
                    personal?.pinCode ||
                    "",
            },
            permanentAddress: {
                line1:
                    onboardingInfo?.permanentAddressLine1 ||
                    existingData.permanentAddress?.line1 ||
                    "",
                line2:
                    onboardingInfo?.permanentAddressLine2 ||
                    existingData.permanentAddress?.line2 ||
                    "",
                city:
                    onboardingInfo?.permanentCity ||
                    existingData.permanentAddress?.city ||
                    "",
                state:
                    onboardingInfo?.permanentState ||
                    existingData.permanentAddress?.state ||
                    "",
                pincode:
                    onboardingInfo?.permanentPincode ||
                    existingData.permanentAddress?.pincode ||
                    "",
            },

            education:
                onboardingEducationRows.length > 0
                    ? onboardingEducationRows.map((row) => ({
                          qualification: row.qualification || "",
                          institution: row.institution || "",
                          board: row.board || "",
                          year: row.year || "",
                          percentage: row.percentage || "",
                      }))
                    : educationRows.length > 0
                    ? educationRows.map((row) => ({
                          qualification: row.degree || "",
                          institution: row.university || "",
                          board: row.university || "",
                          year: row.graduationYear || "",
                          percentage: row.grade || "",
                      }))
                    : existingData.education || [],

            experience:
                onboardingExperienceRows.length > 0
                    ? onboardingExperienceRows.map((row) => ({
                          company: row.company || "",
                          designation: row.designation || "",
                          startDate: row.startDate || "",
                          endDate: row.endDate || "",
                          totalExp: row.totalExp || "",
                          reason: row.reason || "",
                      }))
                    : experienceRows.length > 0
                    ? experienceRows.map((row) => ({
                          company: row.companyName || "",
                          designation: row.role || "",
                          startDate: row.startDate || "",
                          endDate: row.endDate || "",
                          totalExp:
                              row.totalExperience === null ||
                              row.totalExperience === undefined
                                  ? ""
                                  : String(row.totalExperience),
                          reason: row.reasonForLeaving || "",
                      }))
                    : existingData.experience || [],

            icebreaker: {
                favoriteCake:
                    onboardingInfo?.favoriteCake ||
                    existingData.icebreaker?.favoriteCake ||
                    "",
                favoriteColor:
                    onboardingInfo?.favoriteColor ||
                    existingData.icebreaker?.favoriteColor ||
                    "",
                favoriteSong:
                    onboardingInfo?.favoriteSong ||
                    existingData.icebreaker?.favoriteSong ||
                    "",
                favoriteMovie:
                    onboardingInfo?.favoriteMovie ||
                    existingData.icebreaker?.favoriteMovie ||
                    "",
                favoriteFood:
                    onboardingInfo?.favoriteFood ||
                    existingData.icebreaker?.favoriteFood ||
                    "",
                favoriteActor:
                    onboardingInfo?.favoriteActor ||
                    existingData.icebreaker?.favoriteActor ||
                    "",
                dreamVacation:
                    onboardingInfo?.dreamVacation ||
                    existingData.icebreaker?.dreamVacation ||
                    "",
                weekendActivity:
                    onboardingInfo?.weekendActivity ||
                    existingData.icebreaker?.weekendActivity ||
                    "",
                coffeeOrTea:
                    onboardingInfo?.coffeeOrTea ||
                    existingData.icebreaker?.coffeeOrTea ||
                    "",
                favoriteSports:
                    onboardingInfo?.favoriteSports ||
                    existingData.icebreaker?.favoriteSports ||
                    "",
            },

            health: {
                anyTablets: this.normalizeYesNo(
                    health?.takingTablets ?? existingData.health?.anyTablets
                ),
                healthIssues: health?.healthIssues || existingData.health?.healthIssues || "",
                bloodGroup: health?.bloodGroup || existingData.health?.bloodGroup || "",
                medicalAssistance: this.normalizeYesNo(
                    health?.medicalAssistanceNeeded ??
                        existingData.health?.medicalAssistance
                ),
                emergencyContact:
                    existingData.health?.emergencyContact || "",
                emergencyName:
                    health?.emergencyContactName || existingData.health?.emergencyName || "",
                emergencyNumber:
                    health?.emergencyContactNumber ||
                    existingData.health?.emergencyNumber ||
                    "",
            },
            bankDetails: {
                accountHolder:
                    bank?.accountHolderName || existingData.bankDetails?.accountHolder || "",
                accountNumber:
                    bank?.accountNumber || existingData.bankDetails?.accountNumber || "",
                ifscCode: bank?.ifscCode || existingData.bankDetails?.ifscCode || "",
                bankName: bank?.bankName || existingData.bankDetails?.bankName || "",
                branchName: bank?.branchName || existingData.bankDetails?.branchName || "",
            },
            documents:
                documentRows.length > 0
                    ? documentRows.map((doc) => ({
                          documentType: doc.documentType || "",
                          fileName: doc.fileName || "",
                          fileUrl: doc.fileUrl || "",
                          file_url: doc.fileUrl || "",
                      }))
                    : existingData.documents || [],
            officeTour: {
                reception: office?.reception ?? existingData.officeTour?.reception ?? false,
                workstation:
                    office?.workstationSheet ??
                    existingData.officeTour?.workstation ??
                    false,
                meetingRoom:
                    office?.meetingRoom ?? existingData.officeTour?.meetingRoom ?? false,
                cafeteria: office?.cafeteria ?? existingData.officeTour?.cafeteria ?? false,
                hrCabin: office?.hrCabin ?? existingData.officeTour?.hrCabin ?? false,
            },
            induction: {
                companyIntro:
                    induction?.companyIntroduction ??
                    existingData.induction?.companyIntro ??
                    false,
                hrPolicies:
                    induction?.hrPolicies ?? existingData.induction?.hrPolicies ?? false,
                attendanceRules:
                    induction?.attendanceRules ??
                    existingData.induction?.attendanceRules ??
                    false,
                leavePolicy:
                    induction?.leavePolicy ?? existingData.induction?.leavePolicy ?? false,
                securityGuidelines:
                    induction?.securityGuidelines ??
                    existingData.induction?.securityGuidelines ??
                    false,
                teamIntro:
                    induction?.teamIntroduction ?? existingData.induction?.teamIntro ?? false,
            },
            kit: {
                laptop: equipment?.laptop ?? existingData.kit?.laptop ?? false,
                mouse: equipment?.mouse ?? existingData.kit?.mouse ?? false,
                keyboard: equipment?.keyboard ?? existingData.kit?.keyboard ?? false,
                entryCard:
                    equipment?.entryCardRecognition ??
                    existingData.kit?.entryCard ??
                    false,
                headset: equipment?.headset ?? existingData.kit?.headset ?? false,
                welcomeKit:
                    equipment?.welcomeKit ?? existingData.kit?.welcomeKit ?? false,
            },
        };

        return {
            ...(record ? record.toJSON() : {}),
            cifid: parsedCifId,
            status: record?.status || "DRAFT",
            formData,
        };
    }

    async getAllRecords() {
        return db.OnboardingRecord.findAll({
            order: [["updatedAt", "DESC"]],
        });
    }

    async create(data) {
        if (!data.cifid) {
            throw new Error("CIF ID is required.");
        }

        const existingOnboarding = await repository.findByCifId(
            data.cifid
        );

        if (existingOnboarding) {
            throw new Error("Onboarding already exists for this CIF.");
        }

        return await super.create(data);
    }

    async getAll() {
        return await repository.findAll();
    }

    async getById(id) {
        const onboarding = await repository.findById(id);

        if (!onboarding) {
            throw new Error("Onboarding not found.");
        }

        return onboarding;
    }

    async update(id, data) {
        return await repository.update(id, data);
    }

    async delete(id) {
        return await repository.delete(id);
    }
}

module.exports = new OnboardingService();