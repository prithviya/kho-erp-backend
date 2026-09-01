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
            order: [
                [{ model: Department, as: "department" }, "name", "ASC"],
                ["code", "ASC"]
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

    async findByDepartmentId(departmentId, options = {}) {
        return await this.model.findAll({
            where: { departmentId },
            ...options,
            include: [
                {
                    model: Department,
                    as: "department",
                    attributes: ["id", "name"],
                },
            ],
            order: [
                ["code", "ASC"]
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
            order: [
                [{ model: Department, as: "department" }, "name", "ASC"],
                ["code", "ASC"]
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