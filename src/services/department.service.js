const BaseService = require("./base.service");
const repository = require("../repository/department.repository");

class DepartmentService extends BaseService {
    constructor() {
        super(repository);
    }

    async create(data) {
        if (await repository.findByName(data.name)) {
            throw new Error("Department name already exists.");
        }

        return super.create(data);
    }

    async getAll() {
        return await repository.findAll();
    }

    async getById(id) {
        const department = await repository.getById(id);
        if (!department) {
            throw new Error("Department not found.");
        }
        return department;
    }

    async update(id, data) {
        const department = await repository.getById(id);
        if (!department) {
            throw new Error("Department not found.");
        }           

        if (data.name && data.name !== department.name) {
            if (await repository.findByName(data.name)) {
                throw new Error("Department name already exists.");
            }       
        }
        return super.update(id, data);  
    }
    async delete(id) {
        const department = await repository.getById(id);
        if (!department) {
            throw new Error("Department not found.");
        }
        return super.delete(id);
    }

}

module.exports = new DepartmentService();