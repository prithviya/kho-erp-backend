const BaseService = require("./base.service");
const repository = require("../repository/leadStatus.repository");
class LeadStatusService extends BaseService {
    constructor() {
        super(repository);
    }
    async create(data) {
        if (await repository.findByCode(data.code))
            throw new Error("Code already exists.");
        if (await repository.findByName(data.name))
            throw new Error("Name already exists.");
        return super.create(data);
    }
    async getAll() {
        const status = await repository.findAll();
        return status;
    }
    async update(id, data) {
        const status = await repository.findById(id);
        if (!status)
            throw new Error("Lead Status not found.");
        return super.update(id, data);
    }
}
module.exports = new LeadStatusService();