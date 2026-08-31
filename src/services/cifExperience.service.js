const BaseService = require("./base.service");
const repository = require("../repository/cifExperience.repository");

function normalizeCandidateId(data = {}) {
    const candidateId = Number(data.candidateId || data.cifid || 0);
    if (!candidateId) {
        throw new Error("candidateId is required.");
    }

    return {
        ...data,
        candidateId,
        cifid: candidateId,
    };
}

class CifExperienceService extends BaseService {
    constructor() {
        super(repository);
    }

    async create(data) {
        const payload = normalizeCandidateId(data);

        if (!payload.companyName) {
            throw new Error("Company name is required.");
        }

        if (!payload.role) {
            throw new Error("Role is required.");
        }

        if (!payload.startDate) {
            throw new Error("Start date is required.");
        }

        return await super.create(payload);
    }

    async getAll() {
        return await repository.findAll();
    }

    async getById(id) {
        const experience = await repository.findById(id);

        if (!experience) {
            throw new Error("Experience record not found.");
        }

        return experience;
    }

    async getByCandidateId(candidateId) {
        return await repository.findByCandidateId(candidateId);
    }

    async getByCifId(cifid) {
        return this.getByCandidateId(cifid);
    }

    async update(id, data) {
        const experience = await repository.findById(id);

        if (!experience) {
            throw new Error("Experience record not found.");
        }

        return await repository.update(id, data);
    }

    async delete(id) {
        const experience = await repository.findById(id);

        if (!experience) {
            throw new Error("Experience record not found.");
        }

        return await repository.delete(id);
    }
}

module.exports = new CifExperienceService();