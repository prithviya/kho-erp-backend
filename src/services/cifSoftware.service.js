const BaseService = require("./base.service");
const repository = require("../repository/cifSoftware.repository");

class CifSoftwareService extends BaseService {
    constructor() {
        super(repository);
    }

    async create(data) {
        if (!data.cifid) {
            throw new Error("CIF ID is required.");
        }

        if (!data.tools) {
            throw new Error("Software tool is required.");
        }

        if (!data.levels) {
            throw new Error("Software level is required.");
        }

        return await super.create(data);
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

    async getByCifId(cifid) {
        return await repository.findByCifId(cifid);
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