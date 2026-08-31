const BaseRepository = require("./base.repository");
const { CifLanguage } = require("../model");

class CifLanguageRepository extends BaseRepository {
    constructor() {
        super(CifLanguage);
    }

    async findByCandidateId(candidateId) {
        return await this.model.findAll({
            where: { candidateId },
        });
    }

    async findByCifId(cifid) {
        return this.findByCandidateId(cifid);
    }
}

module.exports = new CifLanguageRepository();