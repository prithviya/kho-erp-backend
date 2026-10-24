const BaseRepository = require("./base.repository");
const { Employee } = require("../model");
const { Op } = require("sequelize");

class EmployeeRepository extends BaseRepository {
    constructor() {
        super(Employee);
    }

    async findByEmail(email, excludeId = null) {
        const where = { email };
        if (excludeId) {
            where.id = { [Op.ne]: excludeId };
        }
        return this.model.findOne({ where, paranoid: false });
    }

    async findByEmployeeCode(employeeCode) {
        return this.model.findOne({ where: { employeeCode }, paranoid: false });
    }

    async findForUser({ email, employeeCode }) {
        if (employeeCode) {
            const employee = await this.model.findOne({ where: { employeeCode } });
            if (employee) return employee;
        }

        return email ? this.model.findOne({ where: { email } }) : null;
    }

    async getEmployees(search = "") {
        const where = search
            ? {
                [Op.or]: [
                    { employeeCode: { [Op.iLike]: `%${search}%` } },
                    { fullName: { [Op.iLike]: `%${search}%` } },
                    { email: { [Op.iLike]: `%${search}%` } },
                    { phone: { [Op.iLike]: `%${search}%` } },
                    { jobPosition: { [Op.iLike]: `%${search}%` } }
                ]
            }
            : {};

        return this.model.findAll({
            where,
            order: [["createdAt", "DESC"]]
        });
    }

    async getEmployeeById(id) {
        return this.model.findByPk(id);
    }
}

module.exports = new EmployeeRepository();