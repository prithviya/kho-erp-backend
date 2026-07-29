const userRoleRepository = require("../repository/userRole.repository");
const { User, Role } = require("../model");
const logger = require("../helpers/logger");
class UserRoleService {
    async assignRoles(userId, roleIds) {
        logger.info(`Assigning roles to user with ID: ${userId}`);
        const user = await User.findByPk(userId);
        if (!user) {
            logger.warn(`User with ID: ${userId} not found for role assignment.`);
            throw new Error("User not found.");
        }
        const roles = await Role.findAll({
            where: {
                id: roleIds
            }
        });
        if (roles.length !== roleIds.length) {
            logger.warn(`One or more roles are invalid for user ID: ${userId}`);
            throw new Error("One or more roles are invalid.");
        }
        await userRoleRepository.removeAllRoles(userId);
        await userRoleRepository.assignRoles(userId, roleIds);
        return await userRoleRepository.getRoles(userId);
    }
    async getRoles(userId) {
        logger.info(`Fetching roles for user with ID: ${userId}`);
        return await userRoleRepository.getRoles(userId);
    }
    async removeRole(userId, roleId) {
        logger.info(`Removing role from user with ID: ${userId}`);
        const record = await userRoleRepository.findUserRole(
            userId,
            roleId
        );
        if (!record) {
            logger.warn(`Role with ID: ${roleId} is not assigned to user with ID: ${userId}`);
            throw new Error("Role is not assigned to the user.");
        }
        await userRoleRepository.removeRole(userId, roleId);
        return true;
    }
}
module.exports = new UserRoleService();