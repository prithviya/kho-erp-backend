const BaseRepository = require("./base.repository");
const { CifSoftware } = require("../model");

class CifSoftwareRepository extends BaseRepository {
    constructor() {
        super(CifSoftware);
    }

    async findByCifId(cifid) {
        return await this.model.findAll({
            where: { cifid },
        });
    }
}

module.exports = new CifSoftwareRepository();