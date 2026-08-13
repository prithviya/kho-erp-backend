const BaseRepository = require("./base.repository");
const { Opening, Department } = require("../model");

class OpeningRepository extends BaseRepository {
    constructor() {
        super(Opening);
    }

    async findAll() {
        return await this.model.findAll({
            include: [
                {
                    model: Department,
                    as: "department",
                    attributes: ["id", "name"],
                },
            ],
        });
    }

    async findByCode(code) {
        return await this.model.findOne({
            where: { code },
            include: [
                {
                    model: Department,
                    as: "department",
                    attributes: ["id", "name"],
                },
            ],
        });
    }

    async findByDepartmentId(departmentId) {
        return await this.model.findAll({
            where: { departmentId },
            include: [
                {
                    model: Department,
                    as: "department",
                    attributes: ["id", "name"],
                },
            ],
        });
    }

    async findActive() {
        return await this.model.findAll({
            where: {
                isActive: true,
            },
            include: [
                {
                    model: Department,
                    as: "department",
                    attributes: ["id", "name"],
                },
            ],
        });
    }

    async findById(id) {
        return await this.model.findByPk(id, {
            include: [
                {
                    model: Department,
                    as: "department",
                    attributes: ["id", "name"],
                },
            ],
        });
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