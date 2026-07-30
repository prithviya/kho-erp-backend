const BaseService = require("./base.service");
const repository = require("../repository/service.repository");
class ServiceService extends BaseService {
    constructor() {
        super(repository);
    }
    async create(data) {
        if (await repository.findByCode(data.code))
            throw new Error("Service code already exists.");
        if (await repository.findByName(data.name))
            throw new Error("Service already exists.");
        return super.create(data);
    }
    async getAll() {
        const services = await repository.findAll();
        return services;
    }
    async getByCategory(categoryId) {
        return await repository.getByCategory(categoryId);
    }
}
module.exports = new ServiceService();