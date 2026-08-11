const BaseService = require("./base.service");
const repository = require("../repository/cifExperience.repository");

class CifExperienceService extends BaseService {
    constructor() {
        super(repository);
    }

    async create(data) {
        if (!data.cifid) {
            throw new Error("CIF ID is required.");
        }

        if (!data.companyName) {
            throw new Error("Company name is required.");
        }

        if (!data.role) {
            throw new Error("Role is required.");
        }

        if (!data.startDate) {
            throw new Error("Start date is required.");
        }

        return await super.create(data);
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

    async getByCifId(cifid) {
        return await repository.findByCifId(cifid);
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