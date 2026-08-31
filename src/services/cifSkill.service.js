const BaseService = require("./base.service");
const repository = require("../repository/cifSkill.repository");

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

class CifSkillService extends BaseService {
    constructor() {
        super(repository);
    }

    async create(data) {
        const payload = normalizeCandidateId(data);

        if (!payload.skillName) {
            throw new Error("Skill name is required.");
        }

        if (!payload.skillLevel) {
            throw new Error("Skill level is required.");
        }

        if (!payload.year) {
            throw new Error("Skill year is required.");
        }

        if (!payload.provider) {
            throw new Error("Skill provider is required.");
        }

        return await super.create(payload);
    }

    async getAll() {
        return await repository.findAll();
    }

    async getById(id) {
        const skill = await repository.findById(id);

        if (!skill) {
            throw new Error("Skill record not found.");
        }

        return skill;
    }

    async getByCandidateId(candidateId) {
        return await repository.findByCandidateId(candidateId);
    }

    async getByCifId(cifid) {
        return this.getByCandidateId(cifid);
    }

    async update(id, data) {
        const skill = await repository.findById(id);

        if (!skill) {
            throw new Error("Skill record not found.");
        }

        return await repository.update(id, data);
    }

    async delete(id) {
        const skill = await repository.findById(id);

        if (!skill) {
            throw new Error("Skill record not found.");
        }

        return await repository.delete(id);
    }
}

module.exports = new CifSkillService();