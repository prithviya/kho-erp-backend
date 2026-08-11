const BaseRepository = require("./base.repository");
const { CifLanguage } = require("../model");

class CifLanguageRepository extends BaseRepository {
    constructor() {
        super(CifLanguage);
    }

    async findByCifId(cifid) {
        return await this.model.findAll({
            where: { cifid },
        });
    }
}

module.exports = new CifLanguageRepository();