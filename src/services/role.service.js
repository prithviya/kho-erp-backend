const BaseService = require("./base.service");
const roleRepository = require("../repository/role.repository");
const logger = require("../helpers/logger");
const db = require("../model");
const permissionCatalog = require("../constants/rolePermissionCatalog");
const { getLegacyModuleCodes } = require("../constants/legacyRoleAccess");

function invalidRequest(message) {
    const error = new Error(message);
    error.status = 400;
    return error;
}

function isSuperAdminRole(role) {
    return [role?.code, role?.name].some((value) =>
        String(value || "").replace(/[\s_-]+/g, "").toLowerCase() === "superadmin"
    );
}

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
        const transaction = await db.sequelize.transaction();
        let role;
        try {
            role = await db.Role.create({
                name: data.name,
                code: data.code,
                description: data.description || null,
                isActive: data.isActive !== false,
                permissionsConfigured: Array.isArray(data.permissionIds),
            }, { transaction });

            if (Array.isArray(data.permissionIds)) {
                await this.setRolePermissions(role, data.permissionIds, transaction);
            }

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
        logger.info(`Role created successfully: ${data.name}`);
        return roleRepository.findById(role.id, {
            include: [{ model: db.Permission, as: "permissions", through: { attributes: [] } }],
        });
    }
    // Get all roles with optional filters
    async getRoles() {
        logger.info("Fetching all roles.");
        return this.findAll({
            order: [["name", "ASC"]]
        });
    }

    async getRolesWithAccess() {
        return roleRepository.getRolesWithAccess();
    }
    // Get a role by ID
    async updateRole(id, data) {
        logger.info(`Updating role with ID: ${id}`);
        const transaction = await db.sequelize.transaction();
        let role;
        try {
            role = await db.Role.findByPk(id, { transaction });
            if (!role) {
                throw new Error("Role not found.");
            }
            if (isSuperAdminRole(role)) {
                throw invalidRequest("The Super Admin system role cannot be changed here.");
            }

            const updates = {};
            for (const field of ["name", "code", "description", "isActive"]) {
                if (Object.prototype.hasOwnProperty.call(data, field)) {
                    updates[field] = data[field];
                }
            }
            if (Array.isArray(data.permissionIds)) {
                updates.permissionsConfigured = true;
            }

            await role.update(updates, { transaction });
            if (Array.isArray(data.permissionIds)) {
                await this.setRolePermissions(role, data.permissionIds, transaction);
            }

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
        return roleRepository.findById(role.id, {
            include: [{ model: db.Permission, as: "permissions", through: { attributes: [] } }],
        });
    }
    // Delete a role by ID
    async deleteRole(id) {
        logger.info(`Deleting role with ID: ${id}`);
        const role = await db.Role.findByPk(id, {
            include: [{
                model: db.User,
                as: "users",
                attributes: ["id"],
                through: { attributes: [] },
                paranoid: false,
            }],
        });
        if (!role) {
            throw new Error("Role not found.");
        }
        if (isSuperAdminRole(role)) {
            throw invalidRequest("The Super Admin system role cannot be deleted.");
        }
        if (role.users?.length) {
            throw invalidRequest("Remove this role from assigned users before deleting it.");
        }
        await role.destroy();
        return true;
    }

    async setRolePermissions(role, permissionIds, transaction) {
        const normalizedIds = [...new Set(permissionIds.map(Number))];
        if (normalizedIds.some((id) => !Number.isInteger(id) || id < 1)) {
            throw invalidRequest("Permission IDs must be positive integers.");
        }

        const permissionCount = normalizedIds.length
            ? await db.Permission.count({
                where: { id: normalizedIds, isActive: true },
                transaction,
            })
            : 0;
        if (permissionCount !== normalizedIds.length) {
            throw invalidRequest("One or more selected permissions are unavailable.");
        }

        const finalIds = await this.expandPermissionIds(normalizedIds, transaction);
        await role.setPermissions(finalIds, { transaction });
    }

    // A granted action implies View on the same menu, and hidden task menus follow Assign Board.
    async expandPermissionIds(permissionIds, transaction) {
        if (!permissionIds.length || typeof db.Permission.findAll !== "function") {
            return permissionIds;
        }
        const all = await db.Permission.findAll({
            where: { isActive: true },
            attributes: ["id", "moduleId", "action", "permissionKey"],
            transaction,
        });
        const selected = new Set(permissionIds);
        const selectedRows = all.filter((permission) => selected.has(permission.id));

        const result = new Set(permissionIds);
        for (const permission of selectedRows) {
            if (String(permission.action).toLowerCase() === "view") continue;
            const view = all.find((candidate) => (
                candidate.moduleId === permission.moduleId
                && String(candidate.action).toLowerCase() === "view"
            ));
            if (view) result.add(view.id);
        }

        const grantedKeys = new Set(
            all.filter((permission) => result.has(permission.id)).map((permission) => permission.permissionKey)
        );
        for (const item of permissionCatalog.filter((entry) => entry.mirrorOf)) {
            for (const permission of item.permissions) {
                const sourceKey = `${item.mirrorOf.toLowerCase()}.${permission.action.toLowerCase()}`;
                if (!grantedKeys.has(sourceKey)) continue;
                const target = all.find((candidate) => candidate.permissionKey === permission.permissionKey);
                if (target) result.add(target.id);
            }
        }
        return [...result];
    }

    async getPermissionMatrix(roleId) {
        const isNew = roleId === "new";
        const role = isNew ? null : await db.Role.findByPk(roleId, {
            include: [{ model: db.Permission, as: "permissions", through: { attributes: [] } }],
        });
        if (!isNew && !role) {
            const error = new Error("Role not found.");
            error.status = 404;
            throw error;
        }
        if (role && isSuperAdminRole(role)) {
            throw invalidRequest("Super Admin always has full access and cannot be configured.");
        }

        const meta = new Map(permissionCatalog.map((item) => [item.code, item]));
        const modules = (await this.getPermissionCatalog()).map((module) => module.toJSON ? module.toJSON() : module);
        const standardNames = new Set(["view", "create", "edit", "delete"]);

        const toMenu = (module) => {
            const info = meta.get(module.code) || {};
            const allowedStandard = info.permissions
                ? new Set(info.permissions.map((permission) => permission.action.toLowerCase()))
                : null;
            const permissions = (module.Permissions || module.permissions || [])
                .filter((permission) => {
                    const action = String(permission.action).toLowerCase();
                    return !allowedStandard || !standardNames.has(action) || allowedStandard.has(action);
                })
                .map((permission) => ({
                    id: permission.id,
                    action: permission.action,
                    permissionKey: permission.permissionKey,
                }));
            return {
                id: module.id,
                name: module.name,
                code: module.code,
                route: module.route,
                superAdminOnly: Boolean(info.superAdminOnly),
                permissions,
            };
        };

        const visible = modules.filter((module) => !meta.get(module.code)?.hidden);
        const sections = visible
            .filter((module) => !module.parentId)
            .map((section) => ({
                id: section.id,
                name: section.name,
                code: section.code,
                menus: visible.filter((child) => Number(child.parentId) === Number(section.id)).map(toMenu),
            }))
            .filter((section) => section.menus.length);

        const configured = isNew || role.permissionsConfigured === true;
        let granted;
        if (isNew) {
            granted = [];
        } else if (configured) {
            granted = (role.permissions || []).map((permission) => permission.id);
        } else {
            const legacyCodes = new Set(getLegacyModuleCodes(role));
            granted = sections.flatMap((section) => section.menus)
                .filter((menu) => legacyCodes.has(menu.code))
                .flatMap((menu) => menu.permissions.map((permission) => permission.id));
            const existing = (role.permissions || []).map((permission) => permission.id);
            granted = [...new Set([...granted, ...existing])];
        }

        return {
            role: role ? {
                id: role.id,
                name: role.name,
                code: role.code,
                description: role.description,
                isActive: role.isActive,
                permissionsConfigured: role.permissionsConfigured === true,
            } : null,
            prefilled: !isNew && !configured,
            sections,
            grantedPermissionIds: granted,
        };
    }

    // Writes explicit grants for roles that still rely on the old hard-coded page access.
    async backfillLegacyRoles({ dryRun = true } = {}) {
        if (!dryRun) {
            await this.initializePermissionCatalog();
        }
        const roles = await db.Role.findAll({
            include: [{ model: db.Permission, as: "permissions", through: { attributes: [] } }],
        });
        const permissions = await db.Permission.findAll({
            where: { isActive: true },
            include: [{ model: db.Module, attributes: ["code"] }],
        });
        const report = [];
        for (const role of roles) {
            if (isSuperAdminRole(role) || role.permissionsConfigured === true) continue;
            const legacyCodes = new Set(getLegacyModuleCodes(role));
            const legacyIds = permissions
                .filter((permission) => legacyCodes.has(permission.Module?.code))
                .map((permission) => permission.id);
            const ids = [...new Set([...(role.permissions || []).map((permission) => permission.id), ...legacyIds])];
            report.push({ roleId: role.id, code: role.code, name: role.name, menus: [...legacyCodes], grants: ids.length });
            if (dryRun) continue;

            const transaction = await db.sequelize.transaction();
            try {
                await role.update({ permissionsConfigured: true }, { transaction });
                await this.setRolePermissions(role, ids, transaction);
                await transaction.commit();
            } catch (error) {
                await transaction.rollback();
                throw error;
            }
        }
        return { dryRun, roles: report };
    }

    async getPermissionCatalog() {
        return db.Module.findAll({
            where: { isActive: true },
            include: [{
                model: db.Permission,
                where: { isActive: true },
                required: false,
            }],
            order: [["displayOrder", "ASC"], ["name", "ASC"]],
        });
    }

    async initializePermissionCatalog() {
        const transaction = await db.sequelize.transaction();
        let createdModules = 0;
        let createdPermissions = 0;
        try {
            const moduleIds = new Map();
            for (const item of permissionCatalog) {
                const parentId = item.parentCode ? moduleIds.get(item.parentCode) : null;
                let module = await db.Module.findOne({
                    where: { code: item.code },
                    paranoid: false,
                    transaction,
                });
                if (!module) {
                    module = await db.Module.create({
                        name: item.name,
                        code: item.code,
                        route: item.route,
                        parentId,
                        displayOrder: item.displayOrder,
                        isActive: true,
                    }, { transaction });
                    createdModules += 1;
                }
                moduleIds.set(item.code, module.id);

                for (const permission of item.permissions) {
                    const existing = await db.Permission.findOne({
                        where: { permissionKey: permission.permissionKey },
                        paranoid: false,
                        transaction,
                    });
                    if (!existing) {
                        await db.Permission.create({
                            moduleId: module.id,
                            action: permission.action,
                            permissionKey: permission.permissionKey,
                            description: permission.description,
                            isActive: true,
                        }, { transaction });
                        createdPermissions += 1;
                    }
                }
            }

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
        return {
            createdModules,
            createdPermissions,
            modules: await this.getPermissionCatalog(),
        };
    }
}
module.exports = new RoleService();