const BaseService = require("./base.service");
const moduleRepository = require("../repository/module.repository");
const logger = require("../helpers/logger");
class ModuleService extends BaseService {

    constructor() {
        super(moduleRepository);
    }

    // Create a new module
    async createModule(data) {
        logger.info(`Creating module: ${data.name}`);
        const exists = await moduleRepository.findByCode(data.code);
        if (exists) {
            logger.warn(`Module creation failed for code: ${data.code}`);
            throw new Error("Module code already exists.");
        }
        logger.info(`Creating module: ${data.name}`);
        return this.create(data);
    }
}

module.exports = new ModuleService();