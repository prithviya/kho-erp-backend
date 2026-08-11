const BaseService = require("./base.service");
const repository = require("../repository/cifReference.repository");

class CifReferenceService extends BaseService {
    constructor() {
        super(repository);
    }

    async create(data) {
        if (!data.cifid) {
            throw new Error("CIF ID is required.");
        }

        if (!data.referenceName) {
            throw new Error("Reference name is required.");
        }

        if (!data.referenceEmail) {
            throw new Error("Reference email is required.");
        }

        if (!data.referencePhone) {
            throw new Error("Reference phone is required.");
        }

        return await super.create(data);
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

    async getByCifId(cifid) {
        return await repository.findByCifId(cifid);
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