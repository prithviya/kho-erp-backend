const BaseRepository = require("./base.repository");
const { CifSkill } = require("../model");

class CifSkillRepository extends BaseRepository {
    constructor() {
        super(CifSkill);
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

module.exports = new CifSkillRepository();