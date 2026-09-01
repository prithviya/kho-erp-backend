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
        const academics = list(payload.academics, "Academics");
        const experiences = list(payload.experiences, "Experiences");
        const skills = list(payload.skills, "Skills");
        const softwares = list(payload.softwares, "Software tools");
        const languages = list(payload.languages, "Languages");
        const references = list(payload.references, "References");

        required(personal.fullName, "Full name is required.");
        required(personal.email, "Email is required.");
        required(personal.phoneNumber, "Phone number is required.");

        academics.forEach((item) => {
            required(item.degree, "Degree is required.");
            required(item.university, "University is required.");
            required(item.graduationYear, "Graduation year is required.");
            required(item.grade, "Academic grade is required.");
            required(item.city, "Academic city is required.");
        });
        experiences.forEach((item) => {
            required(item.companyName, "Company name is required.");
            required(item.location, "Experience location is required.");
            required(item.role, "Role is required.");
            required(item.startDate, "Start date is required.");
        });
        skills.forEach((item) => {
            required(item.skillName, "Skill name is required.");
            required(item.skillLevel, "Skill level is required.");
            required(item.year, "Skill year is required.");
            required(item.provider, "Skill provider is required.");
        });
        softwares.forEach((item) => {
            required(item.toolName || item.tools, "Software tool is required.");
            required(item.proficiencyLevel || item.levels, "Software level is required.");
        });
        languages.forEach((item) => {
            required(item.languageName || item.language, "Language is required.");
            required(item.speakLevel || item.Speak, "Speak proficiency is required.");
            required(item.readLevel || item.Read, "Read proficiency is required.");
            required(item.writeLevel || item.Write, "Write proficiency is required.");
        });
        references.forEach((item) => {
            required(item.referenceName, "Reference name is required.");
            required(item.referenceEmail, "Reference email is required.");
            required(item.referencePhone, "Reference phone is required.");
        });

        return sequelize.transaction(async (transaction) => {
            const [existingEmail, existingPhone] = await Promise.all([
                CifPersonal.findOne({ where: { email: personal.email }, transaction }),
                CifPersonal.findOne({ where: { phoneNumber: personal.phoneNumber }, transaction }),
            ]);

            if (existingEmail) throw new Error("Email already exists.");
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
