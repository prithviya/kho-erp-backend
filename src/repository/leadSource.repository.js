const BaseRepository = require("./base.repository");
const { LeadSource } = require("../model");
class LeadSourceRepository extends BaseRepository {
    constructor() {
        super(LeadSource);
    }
    async findByCode(code) {
        return await this.model.findOne({
            where: { code }
        });
    }
    async findByName(name) {
        return await this.model.findOne({
            where: { name }
        });
    }
}
module.exports = new LeadSourceRepository();