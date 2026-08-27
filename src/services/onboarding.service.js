const BaseService = require("./base.service");
const repository = require("../repository/onboarding.repository");
const {
    OnboardingRecord,
    CifPersonal,
    CifAcademic,
    CifExperience,
    CifSkill,
    CifSoftware,
    CifReference,
    sequelize,
} = require("../model");

class OnboardingService extends BaseService {
    constructor() {
        super(repository);
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

    async saveRecord(cifid, formData, status) {
        if (!cifid) {
            throw new Error("CIF ID is required.");
        }

        if (!["DRAFT", "FINAL"].includes(status)) {
            throw new Error("Status must be DRAFT or FINAL.");
        }

        if (!formData || typeof formData !== "object" || Array.isArray(formData)) {
            throw new Error("Onboarding form data is required.");
        }

        const requiredSections = [
            "currentAddress",
            "permanentAddress",
            "experience",
            "education",
            "icebreaker",
        ];
        const missingSections = requiredSections.filter(
            (section) => formData[section] === undefined
        );

        if (missingSections.length > 0) {
            throw new Error(`Missing onboarding sections: ${missingSections.join(", ")}.`);
        }

        if (status === "FINAL") {
            const requiredFields = [
                "firstName",
                "lastName",
                "employeeType",
                "designation",
            ];
            const missingFields = requiredFields.filter(
                (field) => String(formData[field] || "").trim() === ""
            );

            if (missingFields.length > 0) {
                throw new Error(`Complete required onboarding fields: ${missingFields.join(", " )}.`);
            }
        }

        return sequelize.transaction(async (transaction) => {
            const personal = await CifPersonal.findByPk(cifid, { transaction });
            if (!personal) {
                throw new Error("CIF personal record not found.");
            }

            const fullName = [formData.firstName, formData.lastName]
                .map((part) => String(part || "").trim())
                .filter(Boolean)
                .join(" ");
            const personalUpdates = {};
            if (fullName) personalUpdates.fullName = fullName;
            if (formData.personalEmail) personalUpdates.email = formData.personalEmail;
            if (formData.personalPhone) personalUpdates.phoneNumber = formData.personalPhone;
            if (formData.dateOfBirth) personalUpdates.DOB = formData.dateOfBirth;
            if (formData.currentAddress?.line1) personalUpdates.address = formData.currentAddress.line1;
            if (formData.currentAddress?.city) personalUpdates.city = formData.currentAddress.city;
            if (formData.currentAddress?.state) personalUpdates.state = formData.currentAddress.state;
            if (formData.currentAddress?.pincode) personalUpdates.pinCode = formData.currentAddress.pincode;
            if (formData.gender && ["Male", "Female"].includes(formData.gender)) {
                personalUpdates.gender = formData.gender;
            }
            if (formData.maritalStatus && ["Single", "Married"].includes(formData.maritalStatus)) {
                personalUpdates.maritalStatus = formData.maritalStatus;
            }
            if (Object.keys(personalUpdates).length > 0) {
                await personal.update(personalUpdates, { transaction });
            }

            await CifAcademic.destroy({ where: { cifid }, transaction });
            const academics = (formData.education || [])
                .filter((item) => item.qualification && item.institution && item.year)
                .map((item) => ({
                    cifid,
                    degree: item.qualification,
                    university: item.institution,
                    graduationYear: Number(item.year),
                    grade: item.percentage || "N/A",
                    city: item.board || "N/A",
                }))
                .filter((item) => Number.isInteger(item.graduationYear));
            if (academics.length > 0) {
                await CifAcademic.bulkCreate(academics, { transaction });
            }

            await CifExperience.destroy({ where: { cifid }, transaction });
            const experiences = (formData.experience || [])
                .filter((item) => item.company && item.designation && item.startDate)
                .map((item) => ({
                    cifid,
                    companyName: item.company,
                    location: "N/A",
                    role: item.designation,
                    startDate: item.startDate,
                    endDate: item.endDate || null,
                    totalExperience: Number.parseFloat(item.totalExp) || 0,
                    reasonForLeaving: item.reason || null,
                }));
            if (experiences.length > 0) {
                await CifExperience.bulkCreate(experiences, { transaction });
            }

            await CifSkill.destroy({ where: { cifid }, transaction });
            const skills = (formData.skills || [])
                .filter((item) => item.skill)
                .map((item) => ({
                    cifid,
                    skillName: item.skill,
                    skillLevel: ["Beginner", "Intermediate", "Advanced", "Expert"].includes(item.level)
                        ? item.level
                        : "Intermediate",
                    year: item.year ? `${item.year}-01-01` : new Date(),
                    provider: item.institute || "N/A",
                }));
            if (skills.length > 0) {
                await CifSkill.bulkCreate(skills, { transaction });
            }

            await CifSoftware.destroy({ where: { cifid }, transaction });
            const software = (formData.softwareTools || [])
                .filter((item) => item.name)
                .map((item) => ({
                    cifid,
                    tools: item.name,
                    levels: ["Excellent", "Good", "Average"].includes(item.proficiency)
                        ? item.proficiency
                        : "Good",
                }));
            if (software.length > 0) {
                await CifSoftware.bulkCreate(software, { transaction });
            }

            await CifReference.destroy({ where: { cifid }, transaction });
            const references = (formData.references || [])
                .filter((item) => item.name && item.email && item.phone)
                .map((item) => ({
                    cifid,
                    referenceName: item.name,
                    referenceEmail: item.email,
                    referencePhone: item.phone,
                    consentConfirmed: true,
                }));
            if (references.length > 0) {
                await CifReference.bulkCreate(references, { transaction });
            }

            const [record] = await OnboardingRecord.findOrCreate({
                where: { cifid },
                defaults: { cifid, formData, status },
                transaction,
            });
            await record.update({ formData, status }, { transaction });

            return record;
        });
    }
}

module.exports = new OnboardingService();