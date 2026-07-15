const BaseRepository = require("./base.repository");
const { Permission } = require("../model");

class PermissionRepository extends BaseRepository {

    constructor() {
        super(Permission);
    }
    
    findByKey(permissionKey) {
        return Permission.findOne({
            where: { permissionKey }
        });
    }
}

module.exports = new PermissionRepository();