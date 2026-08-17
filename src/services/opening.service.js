const BaseService = require("./base.service");
const repository = require("../repository/opening.repository");

class OpeningService extends BaseService {
    constructor() {
        super(repository);
    }

    async create(data) {
        if (!data.code) {
            throw new Error("Opening code is required.");
        }

        if (!data.jobTitle) {
            throw new Error("Job title is required.");
        }

        const existingOpening = await repository.findByCode(data.code);

        if (existingOpening) {
            throw new Error("Opening code already exists.");
        }

        return await super.create(data);
    }

    async getAll() {
        return await repository.findAll();
    }

    async getById(id) {
        const opening = await repository.findById(id);

        if (!opening) {
            throw new Error("Opening not found.");
        }

        return opening;
    }

    async update(id, data) {
        const opening = await repository.findById(id);

        if (!opening) {
            throw new Error("Opening not found.");
        }

        if (data.code && data.code !== opening.code) {
            const existingOpening = await repository.findByCode(
                data.code
            );

            if (existingOpening) {
                throw new Error("Opening code already exists.");
            }
        }

        return await repository.update(id, data);
    }

    async delete(id) {
        const opening = await repository.findById(id);

        if (!opening) {
            throw new Error("Opening not found.");
        }

        return await repository.delete(id);
    }

    // ✅ ADD THIS METHOD
    async updateStatus(id, isActive) {
        const opening = await repository.findById(id);

        if (!opening) {
            throw new Error("Opening not found.");
        }

        return await repository.update(id, { isActive });
    }
}

module.exports = new OpeningService();