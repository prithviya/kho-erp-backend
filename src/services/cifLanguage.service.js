const BaseService = require("./base.service");
const repository = require("../repository/cifLanguage.repository");

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

class CifLanguageService extends BaseService {
    constructor() {
        super(repository);
    }

    async create(data) {
        const payload = normalizeCandidateId(data);

        if (!payload.language) {
            throw new Error("Language is required.");
        }

        return await super.create(payload);
    }

    async getAll() {
        return await repository.findAll();
    }

    async getById(id) {
        const language = await repository.findById(id);

        if (!language) {
            throw new Error("Language record not found.");
        }

        return language;
    }

    async getByCandidateId(candidateId) {
        return await repository.findByCandidateId(candidateId);
    }

    async getByCifId(cifid) {
        return this.getByCandidateId(cifid);
    }

    async update(id, data) {
        const language = await repository.findById(id);

        if (!language) {
            throw new Error("Language record not found.");
        }

        return await repository.update(id, data);
    }

    async delete(id) {
        const language = await repository.findById(id);

        if (!language) {
            throw new Error("Language record not found.");
        }

        return await repository.delete(id);
    }
}

module.exports = new CifLanguageService();