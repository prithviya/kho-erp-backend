const roleRepository = require("../repository/role.repository");

class RoleService {

    async createRole(data) {

        const exists = await roleRepository.findByCode(data.code);

        if (exists) {
            throw new Error("Role code already exists.");
        }

        return await roleRepository.create(data);
    }

    async getRoles() {

        return await roleRepository.findAll({
            order: [["name", "ASC"]]
        });

    }

    async updateRole(id, data) {

        const role = await roleRepository.findById(id);

        if (!role) {
            throw new Error("Role not found.");
        }

        if (data.code) {
            const existingRole = await roleRepository.findByCode(data.code);

            if (existingRole && existingRole.id !== Number(id)) {
                throw new Error("Role code already exists.");
            }
        }

        await role.update(data);

        return role;
    }

    async deleteRole(id) {

        const role = await roleRepository.findById(id);

        if (!role) {
            throw new Error("Role not found.");
        }

        await role.destroy();

        return true;
    }

}

module.exports = new RoleService();