const BaseService = require("./base.service");
const repository = require("../repository/cifAcademic.repository");

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

class CifAcademicService extends BaseService {
    constructor() {
        super(repository);
    }

    async create(data) {
        const payload = normalizeCandidateId(data);

        if (!payload.degree) {
            throw new Error("Degree is required.");
        }

        if (!payload.university) {
            throw new Error("University is required.");
        }

        return await super.create(payload);
    }

    async getAll() {
        return await repository.findAll();
    }

    async getById(id) {
        const academic = await repository.findById(id);

        if (!academic) {
            throw new Error("Academic record not found.");
        }

        return academic;
    }

    async getByCandidateId(candidateId) {
        return await repository.findByCandidateId(candidateId);
    }

    async getByCifId(cifid) {
        return this.getByCandidateId(cifid);
    }

    async update(id, data) {
        const academic = await repository.findById(id);

        if (!academic) {
            throw new Error("Academic record not found.");
        }

        return await repository.update(id, data);
    }

    async delete(id) {
        const academic = await repository.findById(id);

        if (!academic) {
            throw new Error("Academic record not found.");
        }

        return await repository.delete(id);
    }
}

module.exports = new CifAcademicService();