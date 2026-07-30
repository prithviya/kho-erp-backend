const { UserRole, Role } = require("../model");
class UserRoleRepository {
    async assignRoles(userId, roleIds) {
        const records = roleIds.map(roleId => ({
            userId,
            roleId
        }));
        return await UserRole.bulkCreate(records);
    }
    async getRoles(userId) {
        return await Role.findAll({
            include: [
                {
                    association: "users",
                    where: {
                        id: userId
                    },
                    through: {
                        attributes: []
                    },
                    attributes: []
                }
            ]
        });
    }
    async findUserRole(userId, roleId) {
        return await UserRole.findOne({
            where: {
                userId, roleId
            }
        });
    }
    async removeRole(userId, roleId) {
        return await UserRole.destroy({
            where: {
                userId,
                roleId
            }
        });
    }
    async removeAllRoles(userId) {
        return await UserRole.destroy({
            where: { userId }
        });
    }
}
module.exports = new UserRoleRepository();