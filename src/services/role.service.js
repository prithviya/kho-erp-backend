const BaseService = require("./base.service");
const roleRepository = require("../repository/role.repository");
const logger = require("../helpers/logger");
class RoleService extends BaseService {

    constructor() {
        super(roleRepository);
    }

    // Create a new role
    async createRole(data) {
        logger.info(`Creating role: ${data.name}`);
        const exists = await roleRepository.findByCode(data.code);
        if (exists) {
            logger.warn(`Role creation failed for code: ${data.code}`);
            throw new Error("Role code already exists.");
        }
        logger.info(`Role created successfully: ${data.name}`);
        return this.create(data);

    }

    // Get all roles with optional filters
    async getRoles() {
        logger.info("Fetching all roles.");
        return this.findAll({
            order: [["name", "ASC"]]
        });
    }

    // Get a role by ID
    async updateRole(id, data) {
        logger.info(`Updating role with ID: ${id}`);
        return this.update(id, data);
    }

    // Delete a role by ID
    async deleteRole(id) {
        logger.info(`Deleting role with ID: ${id}`);
        return this.delete(id);
    }

}

module.exports = new RoleService();