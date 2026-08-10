const BaseRepository = require("./base.repository");
const { Department } = require("../model");

class DepartmentRepository extends BaseRepository {
    constructor() {
        super(Department);
    }

    async findByName(name) {
        return await this.model.findOne({
            where: { name }
        });
    }

    async getById(id) {
        const department = await this.model.findByPk(id);

        if (!department) {
            throw new Error("Department not found.");
        }

        return department;
    }
}

module.exports = new DepartmentRepository();