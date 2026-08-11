const BaseRepository = require("./base.repository");
const { CifPersonal } = require("../model");

class CifPersonalRepository extends BaseRepository {
    constructor() {
        super(CifPersonal);
    }

    async findByEmail(email) {
        return await this.model.findOne({
            where: { email },
        });
    }

    async findByPhoneNumber(phoneNumber) {
        return await this.model.findOne({
            where: { phoneNumber },
        });
    }

    async findById(id) {
        return await this.model.findByPk(id);
    }
}

module.exports = new CifPersonalRepository();