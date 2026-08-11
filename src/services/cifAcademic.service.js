const BaseService = require("./base.service");
const repository = require("../repository/cifAcademic.repository");

class CifAcademicService extends BaseService {
    constructor() {
        super(repository);
    }

    async create(data) {
        if (!data.cifid) {
            throw new Error("CIF ID is required.");
        }

        if (!data.degree) {
            throw new Error("Degree is required.");
        }

        if (!data.university) {
            throw new Error("University is required.");
        }

        return await super.create(data);
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

    async getByCifId(cifid) {
        return await repository.findByCifId(cifid);
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