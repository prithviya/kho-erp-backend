const moduleRepository = require("../repository/module.repository");

class ModuleService {

    async createModule(data) {

        const exists = await moduleRepository.findByCode(data.code);

        if (exists) {
            throw new Error("Module code already exists.");
        }

        return moduleRepository.create(data);

    }

    async getModules() {
        return moduleRepository.findAll({
            order: [["displayOrder", "ASC"]]
        });
    }

    async getModule(id) {

        const module = await moduleRepository.findById(id);

        if (!module) {
            throw new Error("Module not found.");
        }

        return module;

    }

    async updateModule(id, data) {

        const module = await this.getModule(id);

        return module.update(data);

    }

    async deleteModule(id) {

        const module = await this.getModule(id);

        await module.destroy();

        return true;

    }

}

module.exports = new ModuleService();