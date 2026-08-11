const BaseRepository = require("./base.repository");
const { Opening } = require("../model");

class OpeningRepository extends BaseRepository {
    constructor() {
        super(Opening);
    }

    async findByCode(code) {
        return await this.model.findOne({
            where: { code },
        });
    }

    async findByDepartmentId(departmentId) {
        return await this.model.findAll({
            where: { departmentId },
        });
    }

    async findActive() {
        return await this.model.findAll({
            where: {
                isActive: true,
            },
        });
    }

    async findById(id) {
        return await this.model.findByPk(id);
    }

    async update(id, data) {
        const opening = await this.model.findByPk(id);

        if (!opening) {
            throw new Error("Opening not found.");
        }

        return await opening.update(data);
    }

    async delete(id) {
        const opening = await this.model.findByPk(id);

        if (!opening) {
            throw new Error("Opening not found.");
        }

        return await opening.destroy();
    }
}

module.exports = new OpeningRepository();