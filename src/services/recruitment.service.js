const BaseService = require("./base.service");
const repository = require("../repository/recruitment.repository");
const { Candidate, sequelize } = require("../model");

class RecruitmentService extends BaseService {
    constructor() {
        super(repository);
    }

    async ensureLegacyCifRecord(cifid, candidate) {
        const [existingLegacyCandidate] = await sequelize.query(
            "SELECT cifid FROM cif_personals WHERE cifid = :cifid LIMIT 1",
            {
                replacements: { cifid },
                type: sequelize.QueryTypes.SELECT,
            }
        );

        if (existingLegacyCandidate) {
            return;
        }

        const legacyPayload = {
            cifid,
            fullName: candidate.fullName || "",
            email: candidate.email || "",
            phoneNumber: candidate.phoneNumber || "",
            DOB: candidate.dob || candidate.DOB || null,
            address: candidate.currentAddress || candidate.address || "",
            city: candidate.currentCity || candidate.city || "",
            state: candidate.currentState || candidate.state || "",
            pinCode: candidate.currentPincode || candidate.pinCode || "",
            gender: candidate.gender || null,
            maritalStatus: candidate.maritalStatus || null,
            portfolioLink: candidate.portfolioLink || null,
            resume: candidate.resumeUrl || null,
            appliedPosition: candidate.appliedPosition || null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await sequelize.query(
            `INSERT INTO cif_personals (
                cifid,
                fullName,
                email,
                phoneNumber,
                DOB,
                address,
                city,
                state,
                pinCode,
                gender,
                maritalStatus,
                portfolioLink,
                resume,
                appliedPosition,
                createdAt,
                updatedAt
            ) VALUES (
                :cifid,
                :fullName,
                :email,
                :phoneNumber,
                :DOB,
                :address,
                :city,
                :state,
                :pinCode,
                :gender,
                :maritalStatus,
                :portfolioLink,
                :resume,
                :appliedPosition,
                :createdAt,
                :updatedAt
            ) ON DUPLICATE KEY UPDATE
                fullName = VALUES(fullName),
                email = VALUES(email),
                phoneNumber = VALUES(phoneNumber),
                DOB = VALUES(DOB),
                address = VALUES(address),
                city = VALUES(city),
                state = VALUES(state),
                pinCode = VALUES(pinCode),
                gender = VALUES(gender),
                maritalStatus = VALUES(maritalStatus),
                portfolioLink = VALUES(portfolioLink),
                resume = VALUES(resume),
                appliedPosition = VALUES(appliedPosition),
                updatedAt = VALUES(updatedAt)`,
            {
                replacements: legacyPayload,
            }
        );
    }

    async create(data) {
        const cifid = Number(data.cifid ?? data.candidateId ?? 0);
        if (!cifid) {
            throw new Error("CIF ID is required.");
        }

        const candidate = await Candidate.findByPk(cifid);
        if (!candidate) {
            throw new Error("Candidate not found for recruitment.");
        }

        await this.ensureLegacyCifRecord(cifid, candidate);

        const payload = { ...data, cifid };
        const existingRecruitment = await repository.findByCifId(cifid);

        if (existingRecruitment) {
            return await super.create(payload);
        }

        return await super.create(payload);
    }

    async getAll() {
        return await repository.findAll();
    }

    async getById(id) {
        const recruitment = await repository.findById(id);

        if (!recruitment) {
            throw new Error("Recruitment record not found.");
        }

        return recruitment;
    }

    async getByCifId(cifid) {
        const recruitment = await repository.findByCifId(cifid);

        if (!recruitment) {
            throw new Error("Recruitment record not found for this CIF.");
        }

        return recruitment;
    }

    async update(id, data) {
        const recruitment = await this.getById(id);

        if (data.cifid && data.cifid !== recruitment.cifid) {
            const existingRecruitment = await repository.findByCifId(data.cifid);

            if (existingRecruitment && existingRecruitment.rid !== recruitment.rid) {
                throw new Error("Recruitment already exists for this CIF.");
            }
        }

        return await repository.update(id, data);
    }

    async delete(id) {
        const recruitment = await this.getById(id);

        if (!recruitment) {
            throw new Error("Recruitment record not found.");
        }

        return await repository.delete(id);
    }
}

module.exports = new RecruitmentService();
