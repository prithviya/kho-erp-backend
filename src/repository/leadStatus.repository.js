const BaseRepository = require("./base.repository");
const { LeadStatus } = require("../model");
class LeadStatusRepository extends BaseRepository {
    constructor() {
        super(LeadStatus);
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
module.exports = new LeadStatusRepository();