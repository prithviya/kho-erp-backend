const BaseRepository = require("./base.repository");
const { CifReference } = require("../model");

class CifReferenceRepository extends BaseRepository {
    constructor() {
        super(CifReference);
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

module.exports = new CifReferenceRepository();