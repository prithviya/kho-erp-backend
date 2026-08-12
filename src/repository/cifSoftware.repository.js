const BaseRepository = require("./base.repository");
const { CifSoftware } = require("../model");

class CifSoftwareRepository extends BaseRepository {
    constructor() {
        super(CifSoftware);
    }

    async findByCifId(cifid) {
        return this.model.findAll({
            where: { cifid },
        });
    }

    async update(id, data) {
        await this.model.update(data, {
            where: { softwareid: id },
        });
        return this.findById(id);
    }

    async delete(id) {
        return this.model.destroy({
            where: { softwareid: id },
        });
    }
}

module.exports = new CifSoftwareRepository();
