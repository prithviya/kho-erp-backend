const BaseRepository = require("./base.repository");
const { CifExperience } = require("../model");

class CifExperienceRepository extends BaseRepository {
    constructor() {
        super(CifExperience);
    }

    async findByCifId(cifid) {
        return await this.model.findAll({
            where: { cifid },
        });
    }
    
}

module.exports = new CifExperienceRepository();