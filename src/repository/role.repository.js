const BaseRepository = require("./base.repository");
const { Role, Permission, User, Module } = require("../model");
class RoleRepository extends BaseRepository {
    constructor() {
        super(Role);
    }
    findByCode(code) {
        return Role.findOne({
            where: { code }
        });
    }
    findByName(name) {
        return Role.findOne({
            where: { name }
        });
    }
    async getRolePermissions(id) {
        return await Role.findByPk(id, {
            include: [{
                model: Permission
            }]
        });
    }

    getRolesWithAccess() {
        return Role.findAll({
            order: [["name", "ASC"]],
            include: [
                {
                    model: Permission,
                    as: "permissions",
                    through: { attributes: [] },
                    where: { isActive: true },
                    required: false,
                    include: [{ model: Module }],
                },
                {
                    model: User,
                    as: "users",
                    attributes: ["id", "isActive"],
                    through: { attributes: [] },
                    required: false,
                    paranoid: false,
                },
            ],
        });
    }
}
module.exports = new RoleRepository();