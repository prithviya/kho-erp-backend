const BaseRepository = require("./base.repository");
const { CifSkill } = require("../model");

class CifSkillRepository extends BaseRepository {
    constructor() {
        super(CifSkill);
    }

    async findByCifId(cifid) {
        return await this.model.findAll({
            where: { cifid },
        });
    }
}

module.exports = new CifSkillRepository();