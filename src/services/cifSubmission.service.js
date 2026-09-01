const {
    sequelize,
    CifPersonal,
    CifAcademic,
    CifExperience,
    CifLanguage,
    CifSoftware,
    CifSkill,
    CifReference,
    CifSubmission,
} = require("../model");

const required = (value, message) => {
    if (value === undefined || value === null || String(value).trim() === "") {
        throw new Error(message);
    }
};

const list = (value, fieldName) => {
    if (value === undefined || value === null) return [];
    if (!Array.isArray(value)) throw new Error(`${fieldName} must be an array.`);
    return value;
};

const normalizeLanguageLevel = (value) => {
    const normalized = String(value || "").trim().toLowerCase();
    return normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : normalized;
};

class CifSubmissionService {
    normalizeStatus(status) {
        if (!status) return "Pending";

        const normalized = String(status).trim();
        const direct = {
            Pending: "Pending",
            Shortlisted: "Shortlisted",
            Selected: "Selected",
            Rejected: "Rejected",
            APPLIED: "Pending",
            applied: "Pending",
            OFFERED: "Selected",
            offered: "Selected",
            shortlist: "Shortlisted",
            shortlisted: "Shortlisted",
            selected: "Selected",
            reject: "Rejected",
            rejected: "Rejected",
            pending: "Pending",
        };

        return direct[normalized] || direct[normalized.toLowerCase()] || "Pending";
    }

    async ensureSubmission(cifid, transaction) {
        const parsedCifId = Number(cifid);
        if (!parsedCifId) {
            throw new Error("Valid CIF ID is required.");
        }

        let submission = await CifSubmission.findOne({
            where: { candidateId: parsedCifId },
            transaction,
        });

        if (!submission) {
            submission = await CifSubmission.create(
                {
                    candidateId: parsedCifId,
                    status: "APPLIED",
                },
                { transaction }
            );
        }

        return submission;
    }

    async updateStatus(cifid, incomingStatus) {
        const status = this.normalizeStatus(incomingStatus);
        const validStatuses = ["Pending", "Shortlisted", "Selected", "Rejected"];

        if (!validStatuses.includes(status)) {
            throw new Error(`Status must be one of: ${validStatuses.join(", ")}`);
        }

        return sequelize.transaction(async (transaction) => {
            const submission = await this.ensureSubmission(cifid, transaction);
            const currentStatus = this.normalizeStatus(submission.appliedStatus || submission.status);

            if (status === "Selected" && ["Rejected"].includes(currentStatus)) {
                throw new Error("Rejected applications cannot be moved to selected.");
            }

            if (status === "Shortlisted" && ["Rejected", "Selected"].includes(currentStatus)) {
                throw new Error("Rejected or selected applications cannot be shortlisted again.");
            }

            if (status === "Rejected" && currentStatus === "Selected") {
                throw new Error("Selected applications cannot be rejected.");
            }

            const storedStatus = {
                Pending: "APPLIED",
                Shortlisted: "SHORTLISTED",
                Selected: "OFFERED",
                Rejected: "REJECTED",
            }[status];
            submission.status = storedStatus;
            await submission.save({ transaction });
            submission.appliedStatus = status;
            return submission;
        });
    }

    async canProceedToOnboarding(cifid, transaction) {
        const submission = await CifSubmission.findOne({
            where: { candidateId: Number(cifid) },
            transaction,
        });

        return this.normalizeStatus(submission?.appliedStatus) === "Selected";
    }

    async create(payload) {
        const personal = payload.personal || {};
        let academics = list(payload.academics, "Academics");
        let experiences = list(payload.experiences, "Experiences");
        let skills = list(payload.skills, "Skills");
        let softwares = list(payload.softwares, "Software tools");
        let languages = list(payload.languages, "Languages");
        let references = list(payload.references, "References");

        required(personal.fullName, "Full name is required.");
        required(personal.email, "Email is required.");
        required(personal.phoneNumber, "Phone number is required.");
        if (!/^\d{10}$/.test(String(personal.phoneNumber).trim())) {
            const error = new Error("Phone number must contain exactly 10 digits.");
            error.status = 400;
            throw error;
        }
        if (personal.pinCode && !/^\d{6}$/.test(String(personal.pinCode).trim())) {
            const error = new Error("PIN code must contain exactly 6 digits.");
            error.status = 400;
            throw error;
        }
        if (personal.DOB) {
            const dateOfBirth = new Date(personal.DOB);
            const minimumBirthDate = new Date();
            minimumBirthDate.setFullYear(minimumBirthDate.getFullYear() - 18);
            if (Number.isNaN(dateOfBirth.getTime()) || dateOfBirth > minimumBirthDate) {
                const error = new Error("Applicant must be at least 18 years old.");
                error.status = 400;
                throw error;
            }
        }

        academics = academics.filter((item) => item.degree && item.university && item.graduationYear);
        const invalidExperience = experiences.find((item) => {
            const started = [item.companyName, item.location, item.role, item.startDate, item.endDate]
                .some((value) => String(value || "").trim());
            return started && (!item.companyName || !item.location || !item.role || !item.startDate);
        });
        if (invalidExperience) {
            const error = new Error("Employer, location, job title, and start date are required for each experience entry.");
            error.status = 400;
            throw error;
        }
        experiences = experiences.filter((item) => item.companyName && item.location && item.role && item.startDate);
        skills = skills.filter((item) => item.skillName && item.skillLevel);
        softwares = softwares.filter((item) => (item.toolName || item.tools) && (item.proficiencyLevel || item.levels));
        languages = languages.filter((item) => (
            (item.languageName || item.language)
            && (item.speakLevel || item.Speak)
            && (item.readLevel || item.Read)
            && (item.writeLevel || item.Write)
        ));
        references = references.filter((item) => item.referenceName && item.referenceEmail && item.referencePhone);

        academics.forEach((item) => {
            required(item.degree, "Degree is required.");
            required(item.university, "University is required.");
            if (!/^\d{4}$/.test(String(item.graduationYear).trim())) {
                throw new Error("Graduation year must contain four digits.");
            }
        });

        return sequelize.transaction(async (transaction) => {
            const [existingEmail, existingPhone] = await Promise.all([
                CifPersonal.findOne({
                    where: {
                        email: personal.email,
                        appliedPosition: personal.appliedPosition || null,
                    },
                    transaction,
                }),
                CifPersonal.findOne({ where: { phoneNumber: personal.phoneNumber }, transaction }),
            ]);

            if (existingEmail) throw new Error("Email already exists for this role.");
            if (existingPhone) throw new Error("Phone number already exists.");

            const cifPersonal = await CifPersonal.create(personal, { transaction });
            const cifid = cifPersonal.id;
            const createAll = (Model, entries) => Promise.all(
                entries.map((entry) => Model.create({ ...entry, candidateId: cifid }, { transaction }))
            );

            await createAll(CifAcademic, academics);
            await createAll(CifExperience, experiences);
            await createAll(CifSkill, skills);
            await createAll(
                CifSoftware,
                softwares.map((item) => ({
                    ...item,
                    toolName: item.toolName || item.tools,
                    proficiencyLevel: item.proficiencyLevel || item.levels,
                }))
            );
            await createAll(
                CifLanguage,
                languages.map((item) => ({
                    ...item,
                    languageName: item.languageName || item.language,
                    speakLevel: normalizeLanguageLevel(item.speakLevel || item.Speak),
                    readLevel: normalizeLanguageLevel(item.readLevel || item.Read),
                    writeLevel: normalizeLanguageLevel(item.writeLevel || item.Write),
                }))
            );
            await createAll(CifReference, references);

            await this.ensureSubmission(cifid, transaction);

            return cifPersonal;
        });
    }
}

module.exports = new CifSubmissionService();
