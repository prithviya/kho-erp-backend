const {
    sequelize,
    CifPersonal,
    CifAcademic,
    CifExperience,
    CifLanguage,
    CifSoftware,
    CifSkill,
    CifReference,
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

class CifSubmissionService {
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
            required(item.tools, "Software tool is required.");
            required(item.levels, "Software level is required.");
        });
        languages.forEach((item) => {
            required(item.language, "Language is required.");
            required(item.Speak, "Speak proficiency is required.");
            required(item.Read, "Read proficiency is required.");
            required(item.Write, "Write proficiency is required.");
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
            const cifid = cifPersonal.cifid;
            const createAll = (Model, entries) => Promise.all(
                entries.map((entry) => Model.create({ ...entry, cifid }, { transaction }))
            );

            await createAll(CifAcademic, academics);
            await createAll(CifExperience, experiences);
            await createAll(CifSkill, skills);
            await createAll(CifSoftware, softwares);
            await createAll(CifLanguage, languages);
            await createAll(CifReference, references);

            return cifPersonal;
        });
    }
}

module.exports = new CifSubmissionService();
