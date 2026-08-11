const BaseService = require("./base.service");
const repository = require("../repository/cifSkill.repository");

class CifSkillService extends BaseService {
    constructor() {
        super(repository);
    }

    async create(data) {
        if (!data.cifid) {
            throw new Error("CIF ID is required.");
        }

        if (!data.skillName) {
            throw new Error("Skill name is required.");
        }

        if (!data.skillLevel) {
            throw new Error("Skill level is required.");
        }

        if (!data.year) {
            throw new Error("Skill year is required.");
        }

        if (!data.provider) {
            throw new Error("Skill provider is required.");
        }

        return await super.create(data);
    }

    async getAll() {
        return await repository.findAll();
    }

    async getById(id) {
        const skill = await repository.findById(id);

        if (!skill) {
            throw new Error("Skill record not found.");
        }

        return skill;
    }

    async getByCifId(cifid) {
        return await repository.findByCifId(cifid);
    }

    async update(id, data) {
        const skill = await repository.findById(id);

        if (!skill) {
            throw new Error("Skill record not found.");
        }

        return await repository.update(id, data);
    }

    async delete(id) {
        const skill = await repository.findById(id);

        if (!skill) {
            throw new Error("Skill record not found.");
        }

        return await repository.delete(id);
    }
}

module.exports = new CifSkillService();