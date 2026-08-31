const BaseService = require("./base.service");
const repository = require("../repository/cifSoftware.repository");

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

class CifSoftwareService extends BaseService {
    constructor() {
        super(repository);
    }

    async create(data) {
        const payload = normalizeCandidateId(data);

        if (!payload.tools) {
            throw new Error("Software tool is required.");
        }

        if (!payload.levels) {
            throw new Error("Software level is required.");
        }

        return await super.create(payload);
    }

    async getAll() {
        return await repository.findAll();
    }

    async getById(id) {
        const software = await repository.findById(id);

        if (!software) {
            throw new Error("Software record not found.");
        }

        return software;
    }

    async getByCandidateId(candidateId) {
        return await repository.findByCandidateId(candidateId);
    }

    async getByCifId(cifid) {
        return this.getByCandidateId(cifid);
    }

    async update(id, data) {
        const software = await repository.findById(id);

        if (!software) {
            throw new Error("Software record not found.");
        }

        return await repository.update(id, data);
    }

    async delete(id) {
        const software = await repository.findById(id);

        if (!software) {
            throw new Error("Software record not found.");
        }

        return await repository.delete(id);
    }
}

module.exports = new CifSoftwareService();