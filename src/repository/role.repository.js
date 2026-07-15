const BaseRepository = require("./base.repository");
const { Role, Permission } = require("../model");

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

}

module.exports = new RoleRepository();