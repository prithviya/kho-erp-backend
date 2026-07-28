const BaseRepository = require("./base.repository");
const { Department } = require("../model");

class DepartmentRepository extends BaseRepository {

    constructor() {
        super(Department);
    }

    async findByDept(departid) {
        return await Department.findOne({
            where: { departid }
        });
    }

}

module.exports = new DepartmentRepository();