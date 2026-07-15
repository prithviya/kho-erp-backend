const permissionRepository = require("../repository/permission.repository");

class PermissionService {

    async createPermission(data) {

        const exists = await permissionRepository.findByKey(data.permissionKey);

        if (exists) {
            throw new Error("Permission already exists");
        }

        return permissionRepository.create(data);
    }

    async getPermissions() {
        return permissionRepository.findAll();
    }

    async getPermission(id) {
    
            const Permission = await PermissionRepository.findById(id);
    
            if (!Permission) {
                throw new Error("Permission not found.");
            }
    
            return Permission;
    
        }
    
        async updatePermission(id, data) {
    
            const Permission = await this.getPermission(id);
    
            return Permission.update(data);
    
        }
    
        async deletePermission(id) {
    
            const Permission = await this.getPermission(id);
    
            await Permission.destroy();
    
            return true;
    
        }

}

module.exports = new PermissionService();