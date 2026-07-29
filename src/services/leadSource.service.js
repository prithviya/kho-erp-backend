const BaseService = require("./base.service");
const repository = require("../repository/leadSource.repository");
class LeadSourceService extends BaseService {
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
    async getById(id) {
        const source = await repository.findById(id);
        if (!source)
            throw new Error("Lead Source not found.");
        return source;
    }
    async getAll(){
        const source = await repository.findAll();
        return source;
    }
    async update(id, data) {
        const source = await repository.findById(id);
        if (!source)
            throw new Error("Lead Source not found.");
        return super.update(id, data);
    }
}
module.exports = new LeadSourceService();