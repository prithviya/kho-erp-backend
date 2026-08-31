const BaseService = require("./base.service");
const repository = require("../repository/cifReference.repository");

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

class CifReferenceService extends BaseService {
    constructor() {
        super(repository);
    }

    async create(data) {
        const payload = normalizeCandidateId(data);

        if (!payload.referenceName) {
            throw new Error("Reference name is required.");
        }

        if (!payload.referenceEmail) {
            throw new Error("Reference email is required.");
        }

        if (!payload.referencePhone) {
            throw new Error("Reference phone is required.");
        }

        return await super.create(payload);
    }

    async getAll() {
        return await repository.findAll();
    }

    async getById(id) {
        const reference = await repository.findById(id);

        if (!reference) {
            throw new Error("Reference record not found.");
        }

        return reference;
    }

    async getByCandidateId(candidateId) {
        return await repository.findByCandidateId(candidateId);
    }

    async getByCifId(cifid) {
        return this.getByCandidateId(cifid);
    }

    async update(id, data) {
        const reference = await repository.findById(id);

        if (!reference) {
            throw new Error("Reference record not found.");
        }

        return await repository.update(id, data);
    }

    async delete(id) {
        const reference = await repository.findById(id);

        if (!reference) {
            throw new Error("Reference record not found.");
        }

        return await repository.delete(id);
    }
}

module.exports = new CifReferenceService();