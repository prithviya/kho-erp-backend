const BaseRepository = require("./base.repository");
const { Employee } = require("../model");

class EmployeeRepository extends BaseRepository {

    constructor() {
        super(Employee);
    }

    async findByDept(empid) {
        return await Employee.findOne({
            where: { empid }
        });
    }

}

module.exports = new EmployeeRepository();