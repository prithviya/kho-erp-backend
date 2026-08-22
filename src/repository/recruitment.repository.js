const BaseRepository = require("./base.repository");
const { Recruitment } = require("../model");

class RecruitmentRepository extends BaseRepository {
    constructor() {
        super(Recruitment);
    }

    async findById(id) {
        return await this.model.findByPk(id);
    }

    async update(id, data) {
        await this.model.update(data, {
            where: { rid: id },
        });
        return await this.findById(id);
    }

    async delete(id) {
        return await this.model.destroy({
            where: { rid: id },
        });
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