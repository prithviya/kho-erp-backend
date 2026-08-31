const BaseRepository = require("./base.repository");
const { CifAcademic } = require("../model");

class CifAcademicRepository extends BaseRepository {
    constructor() {
        super(CifAcademic);
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

module.exports = new CifAcademicRepository();