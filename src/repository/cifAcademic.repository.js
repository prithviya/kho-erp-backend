const BaseRepository = require("./base.repository");
const { CifAcademic } = require("../model");

class CifAcademicRepository extends BaseRepository {
    constructor() {
        super(CifAcademic);
    }

    async findByCifId(cifid) {
        return await this.model.findAll({
            where: { cifid },
        });
    }
}

module.exports = new CifAcademicRepository();