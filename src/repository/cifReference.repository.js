const BaseRepository = require("./base.repository");
const { CifReference } = require("../model");

class CifReferenceRepository extends BaseRepository {
    constructor() {
        super(CifReference);
    }

    async findByCifId(cifid) {
        return await this.model.findAll({
            where: { cifid },
        });
    }
}

module.exports = new CifReferenceRepository();