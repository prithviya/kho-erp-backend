const BaseService = require("./base.service");
const repository = require("../repository/onboarding.repository");

class OnboardingService extends BaseService {
    constructor() {
        super(repository);
    }

    async create(data) {
        if (!data.cifid) {
            throw new Error("CIF ID is required.");
        }

        const existingOnboarding = await repository.findByCifId(
            data.cifid
        );

        if (existingOnboarding) {
            throw new Error("Onboarding already exists for this CIF.");
        }

        return await super.create(data);
    }

    async getAll() {
        return await repository.findAll();
    }

    async getById(id) {
        const onboarding = await repository.findById(id);

        if (!onboarding) {
            throw new Error("Onboarding not found.");
        }

        return onboarding;
    }

    async update(id, data) {
        return await repository.update(id, data);
    }

    async delete(id) {
        return await repository.delete(id);
    }
}

module.exports = new OnboardingService();