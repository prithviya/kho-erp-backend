const BaseService = require("./base.service");
const permissionRepository = require("../repository/permission.repository");
const logger = require("../helpers/logger");
class PermissionService extends BaseService {

    constructor() {
        super(permissionRepository);
    }

    // Create a new permission
    async createPermission(data) {
        logger.info(`Creating permission: ${data.name}`);
        const exists = await permissionRepository.findByPermissionKey(data.permissionKey);
        if (exists) {
            logger.warn(`Permission creation failed for key: ${data.permissionKey}`);
            throw new Error("Permission already exists.");
        }
        logger.info(`Creating permission: ${data.name}`);
        return this.create(data);
    }
}

module.exports = new PermissionService();