const BaseService = require("./base.service");
const repository = require("../repository/cifLanguage.repository");

class CifLanguageService extends BaseService {
    constructor() {
        super(repository);
    }

    async create(data) {
        if (!data.cifid) {
            throw new Error("CIF ID is required.");
        }

        if (!data.language) {
            throw new Error("Language is required.");
        }

        return await super.create(data);
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

    async getByCifId(cifid) {
        return await repository.findByCifId(cifid);
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