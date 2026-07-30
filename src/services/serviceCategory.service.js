const BaseService = require("./base.service");
const repository = require("../repository/serviceCategory.repository");
class ServiceCategoryService extends BaseService {
    constructor() {
        super(repository);
    }
    async create(data) {
        if (await repository.findByCode(data.code))
            throw new Error("Category code already exists.");
        if (await repository.findByName(data.name))
            throw new Error("Category name already exists.");
        return super.create(data);
    }
    async getAll() {
        const serviceCategory = await repository.findAll();
        return serviceCategory;
    }
    async getById(id) {
        const serviceCategory = await repository.findById(id);
        if (!serviceCategory) {
            throw new Error("Service Category not found.");
        }
        return serviceCategory;
    }
    async getWithServices() {
        return await repository.getWithServices();
    }
}
module.exports = new ServiceCategoryService();