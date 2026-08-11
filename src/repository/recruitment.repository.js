const BaseRepository = require("./base.repository");
const { Recruitment } = require("../model");

class RecruitmentRepository extends BaseRepository {
    constructor() {
        super(Recruitment);
    }

    async findByCifId(cifid) {
        return await this.model.findOne({
            where: { cifid },
        });
    }

    async findByStatus(recruitmentStatus) {
        return await this.model.findAll({
            where: { recruitmentStatus },
        });
    }
}

module.exports = new RecruitmentRepository();