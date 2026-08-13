const BaseRepository = require("./base.repository");
const { Department } = require("../model");

class DepartmentRepository extends BaseRepository {
    constructor() {
        super(Department);
    }

    async findAll() {
        return await this.model.findAll();
    }

    async findByName(name) {
        return await this.model.findOne({
            where: {
                name
            }
        });
    }

    async getById(id) {
        return await this.model.findByPk(id);
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
}

module.exports = new DepartmentRepository();