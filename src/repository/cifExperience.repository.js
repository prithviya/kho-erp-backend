const BaseRepository = require("./base.repository");
const { CifExperience } = require("../model");

class CifExperienceRepository extends BaseRepository {
    constructor() {
        super(CifExperience);
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

module.exports = new CifExperienceRepository();