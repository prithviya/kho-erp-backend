const db = require("../model");
const permissionCatalog = require("../constants/rolePermissionCatalog");

const STANDARD_ACTIONS = ["View", "Create", "Edit", "Delete"];
const STANDARD_ACTION_KEYS = new Set(STANDARD_ACTIONS.map((action) => action.toLowerCase()));
const BUILT_IN_CODES = new Set(permissionCatalog.map((item) => item.code));

function httpError(message, status = 400) {
    const error = new Error(message);
    error.status = status;
    return error;
}

function slugify(value) {
    return String(value || "")
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

function actionSlug(action) {
    return String(action || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

function plain(record) {
    return typeof record?.toJSON === "function" ? record.toJSON() : record;
}

function sortMenus(a, b) {
    return (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0)
        || String(a.name).localeCompare(String(b.name));
}

// Builds a two-level tree: sections (no parent) with their submenus.
function buildMenuTree(menus = []) {
    const items = menus.map((menu) => ({ ...plain(menu), children: [] }));
    const byId = new Map(items.map((item) => [Number(item.id), item]));
    const roots = [];
    for (const item of items) {
        const parent = item.parentId ? byId.get(Number(item.parentId)) : null;
        if (parent) {
            parent.children.push(item);
        } else {
            roots.push(item);
        }
    }
    roots.sort(sortMenus);
    roots.forEach((root) => root.children.sort(sortMenus));
    return roots;
}

function normalizeRoute(route) {
    if (route === undefined || route === null || String(route).trim() === "") {
        return null;
    }
    const value = String(route).trim();
    if (value.length > 255) {
        throw httpError("Menu route must be 255 characters or fewer.");
    }
    if (!/^(\/[^\s]*|https?:\/\/[^\s]+)$/i.test(value)) {
        throw httpError("Menu route must start with / or be an http(s) URL.");
    }
    return value;
}

function normalizeIcon(icon) {
    if (icon === undefined || icon === null || String(icon).trim() === "") {
        return null;
    }
    const value = String(icon).trim();
    if (!/^[A-Za-z][A-Za-z0-9]{0,49}$/.test(value)) {
        throw httpError("Icon must be a lucide-react icon name such as ShieldCheck.");
    }
    return value;
}

function normalizeName(name) {
    const value = String(name || "").trim();
    if (!value || value.length > 100) {
        throw httpError("Menu name is required and must be 100 characters or fewer.");
    }
    return value;
}

function normalizeOrder(value, fallback = 0) {
    if (value === undefined || value === null || value === "") {
        return fallback;
    }
    const order = Number(value);
    if (!Number.isInteger(order) || order < 0 || order > 100000) {
        throw httpError("Display order must be a non-negative whole number.");
    }
    return order;
}

function userPermissionKeys(user) {
    const keys = new Set();
    for (const role of user?.roles || []) {
        if (role.isActive === false) continue;
        for (const permission of role.permissions || []) {
            keys.add(permission.permissionKey);
        }
    }
    return keys;
}

// Pure function: which active menus may this user see.
function filterMenusForUser(menus, user) {
    const all = menus.map(plain);
    const byId = new Map(all.map((menu) => [Number(menu.id), menu]));
    const isInactive = (menu) => menu.isActive === false
        || (menu.parentId && byId.get(Number(menu.parentId))?.isActive === false);

    const disabledRoutes = all.filter((menu) => menu.route && isInactive(menu)).map((menu) => menu.route);
    const active = all.filter((menu) => !isInactive(menu));
    const keys = userPermissionKeys(user);
    const canView = (menu) => user?.isSuperAdmin || keys.has(`${String(menu.code).toLowerCase()}.view`);

    const visibleLeaves = active.filter((menu) => (
        (menu.parentId || menu.route) && canView(menu)
    ));
    const parentIds = new Set(visibleLeaves.map((menu) => Number(menu.parentId)).filter(Boolean));
    const visible = active.filter((menu) => (
        visibleLeaves.includes(menu) || (!menu.parentId && parentIds.has(Number(menu.id)))
    ));

    const orderedVisible = buildMenuTree(visible).flatMap((section) => [
        section,
        ...section.children,
    ]);

    return {
        menus: orderedVisible.map((menu) => ({
            id: menu.id,
            name: menu.name,
            code: menu.code,
            route: menu.route,
            icon: menu.icon,
            parentId: menu.parentId,
            displayOrder: menu.displayOrder,
            builtIn: BUILT_IN_CODES.has(menu.code),
        })),
        disabledRoutes,
        permissionKeys: user?.isSuperAdmin ? null : [...keys],
    };
}

class MenuService {
    async listMenus() {
        const menus = await db.Module.findAll({
            include: [{ model: db.Permission, required: false }],
            order: [["displayOrder", "ASC"], ["name", "ASC"]],
        });
        return buildMenuTree(menus.map((menu) => {
            const data = plain(menu);
            return { ...data, builtIn: BUILT_IN_CODES.has(data.code) };
        }));
    }

    async getMenusForUser(user) {
        const menus = await db.Module.findAll({ order: [["displayOrder", "ASC"], ["name", "ASC"]] });
        return filterMenusForUser(menus, user);
    }

    async assertParent(parentId, selfId = null, transaction) {
        if (parentId === undefined || parentId === null || parentId === "") {
            return null;
        }
        const id = Number(parentId);
        if (!Number.isInteger(id) || id < 1 || id === Number(selfId)) {
            throw httpError("Choose a valid parent menu.");
        }
        const parent = await db.Module.findByPk(id, { transaction });
        if (!parent) {
            throw httpError("Parent menu was not found.");
        }
        if (parent.parentId) {
            throw httpError("Submenus can only be nested one level below a parent menu.");
        }
        return parent;
    }

    async createMenu(data = {}) {
        const name = normalizeName(data.name);
        const code = slugify(data.code || name);
        if (!code) {
            throw httpError("Menu code could not be generated from the name.");
        }
        const route = normalizeRoute(data.route);
        const icon = normalizeIcon(data.icon);
        const transaction = await db.sequelize.transaction();
        try {
            const parent = await this.assertParent(data.parentId, null, transaction);
            const duplicate = await db.Module.findOne({
                where: { code },
                paranoid: false,
                transaction,
            });
            const duplicateName = await db.Module.findOne({
                where: { name },
                paranoid: false,
                transaction,
            });
            if (duplicate || duplicateName) {
                throw httpError("A menu with this name or code already exists.", 409);
            }

            const siblings = await db.Module.findAll({
                where: { parentId: parent ? parent.id : null },
                attributes: ["displayOrder"],
                transaction,
            });
            const nextOrder = siblings.reduce((max, item) => Math.max(max, Number(item.displayOrder) || 0), 0) + 1;
            const menu = await db.Module.create({
                name,
                code,
                route,
                icon,
                parentId: parent ? parent.id : null,
                displayOrder: normalizeOrder(data.displayOrder, nextOrder),
                isActive: data.isActive !== false,
            }, { transaction });

            // Submenus and routed menus carry the standard action permissions; plain sections do not.
            if (parent || route) {
                const extraActions = (Array.isArray(data.extraActions) ? data.extraActions : [])
                    .map((action) => String(action).trim())
                    .filter(Boolean);
                for (const action of [...STANDARD_ACTIONS, ...extraActions]) {
                    await this.createPermission(menu, action, transaction);
                }
            }

            await transaction.commit();
            return this.getMenu(menu.id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async getMenu(id) {
        const menu = await db.Module.findByPk(id, {
            include: [{ model: db.Permission, required: false }],
        });
        if (!menu) {
            throw httpError("Menu not found.", 404);
        }
        return { ...plain(menu), builtIn: BUILT_IN_CODES.has(menu.code) };
    }

    async createPermission(menu, action, transaction) {
        const label = String(action).trim();
        const slug = actionSlug(label);
        if (!/^[A-Za-z][A-Za-z0-9 ]{0,29}$/.test(label) || !slug) {
            throw httpError("Action names must start with a letter, use letters, numbers or spaces, and be 30 characters or fewer.");
        }
        const permissionKey = `${String(menu.code).toLowerCase()}.${slug}`;
        const existing = await db.Permission.findOne({
            where: { permissionKey },
            paranoid: false,
            transaction,
        });
        if (existing) {
            if (existing.deletedAt) {
                await existing.restore({ transaction });
                await existing.update({ isActive: menu.isActive !== false }, { transaction });
                return existing;
            }
            throw httpError(`The ${label} action already exists for this menu.`, 409);
        }
        return db.Permission.create({
            moduleId: menu.id,
            action: label,
            permissionKey,
            description: `${label} ${menu.name}`,
            isActive: menu.isActive !== false,
        }, { transaction });
    }

    async updateMenu(id, data = {}) {
        const transaction = await db.sequelize.transaction();
        try {
            const menu = await db.Module.findByPk(id, { transaction });
            if (!menu) {
                throw httpError("Menu not found.", 404);
            }

            const updates = {};
            if (data.name !== undefined) {
                updates.name = normalizeName(data.name);
                if (updates.name !== menu.name) {
                    const clash = await db.Module.findOne({ where: { name: updates.name }, paranoid: false, transaction });
                    if (clash && Number(clash.id) !== Number(menu.id)) {
                        throw httpError("A menu with this name already exists.", 409);
                    }
                }
            }
            if (data.route !== undefined) updates.route = normalizeRoute(data.route);
            if (data.icon !== undefined) updates.icon = normalizeIcon(data.icon);
            if (data.displayOrder !== undefined) updates.displayOrder = normalizeOrder(data.displayOrder, menu.displayOrder);
            if (data.parentId !== undefined) {
                const parent = await this.assertParent(data.parentId, menu.id, transaction);
                if (parent) {
                    const children = await db.Module.count({ where: { parentId: menu.id }, transaction });
                    if (children) {
                        throw httpError("A menu that has submenus cannot become a submenu.");
                    }
                }
                updates.parentId = parent ? parent.id : null;
            }
            if (data.isActive !== undefined) updates.isActive = Boolean(data.isActive);

            await menu.update(updates, { transaction });

            // Disabling a menu also disables its action permissions so API access is denied server-side.
            if (updates.isActive !== undefined) {
                const targetIds = [menu.id];
                const children = await db.Module.findAll({ where: { parentId: menu.id }, transaction });
                for (const child of children) {
                    await child.update({ isActive: updates.isActive }, { transaction });
                    targetIds.push(child.id);
                }
                await db.Permission.update(
                    { isActive: updates.isActive },
                    { where: { moduleId: targetIds }, transaction }
                );
            }

            await transaction.commit();
            return this.getMenu(menu.id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async rolesUsingPermissions(permissionIds, transaction) {
        if (!permissionIds.length) return [];
        const roles = await db.Role.findAll({
            attributes: ["id", "name"],
            include: [{
                model: db.Permission,
                as: "permissions",
                attributes: ["id"],
                where: { id: permissionIds },
                through: { attributes: [] },
                required: true,
            }],
            transaction,
        });
        return roles.map((role) => role.name);
    }

    async deleteMenu(id) {
        const menu = await db.Module.findByPk(id, {
            include: [{ model: db.Permission, required: false }],
        });
        if (!menu) {
            throw httpError("Menu not found.", 404);
        }
        if (BUILT_IN_CODES.has(menu.code)) {
            throw httpError("Built-in menus are required by application pages. Disable the menu instead of deleting it.", 409);
        }
        const children = await db.Module.count({ where: { parentId: menu.id } });
        if (children) {
            throw httpError("Delete or move this menu's submenus first.", 409);
        }
        const permissionIds = (menu.Permissions || menu.permissions || []).map((permission) => permission.id);
        const roles = await this.rolesUsingPermissions(permissionIds);
        if (roles.length) {
            throw httpError(`This menu is assigned to: ${roles.join(", ")}. Remove it from those roles first.`, 409);
        }

        const transaction = await db.sequelize.transaction();
        try {
            await db.Permission.destroy({ where: { moduleId: menu.id }, transaction });
            await menu.destroy({ transaction });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
        return true;
    }

    async reorderMenus(items) {
        if (!Array.isArray(items) || !items.length || items.length > 500) {
            throw httpError("Provide the menus to reorder.");
        }
        const ids = items.map((item) => Number(item.id));
        if (ids.some((id) => !Number.isInteger(id) || id < 1) || new Set(ids).size !== ids.length) {
            throw httpError("Menu IDs must be unique positive integers.");
        }

        const transaction = await db.sequelize.transaction();
        try {
            const menus = await db.Module.findAll({ where: { id: ids }, transaction });
            if (menus.length !== ids.length) {
                throw httpError("One or more menus were not found.");
            }
            const allMenus = await db.Module.findAll({ attributes: ["id", "parentId"], transaction });
            const finalParent = new Map(allMenus.map((menu) => [Number(menu.id), menu.parentId ? Number(menu.parentId) : null]));
            for (const item of items) {
                const parentId = item.parentId ? Number(item.parentId) : null;
                if (parentId === Number(item.id)) {
                    throw httpError("A menu cannot be its own parent.");
                }
                if (parentId && !finalParent.has(parentId)) {
                    throw httpError("Parent menu was not found.");
                }
                finalParent.set(Number(item.id), parentId);
            }
            for (const [menuId, parentId] of finalParent) {
                if (parentId && finalParent.get(parentId)) {
                    throw httpError("Submenus can only be nested one level below a parent menu.");
                }
                if (parentId === menuId) {
                    throw httpError("A menu cannot be its own parent.");
                }
            }
            for (const item of items) {
                await db.Module.update({
                    parentId: item.parentId ? Number(item.parentId) : null,
                    displayOrder: normalizeOrder(item.displayOrder),
                }, { where: { id: Number(item.id) }, transaction });
            }
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
        return this.listMenus();
    }

    async addAction(menuId, action) {
        const transaction = await db.sequelize.transaction();
        try {
            const menu = await db.Module.findByPk(menuId, { transaction });
            if (!menu) {
                throw httpError("Menu not found.", 404);
            }
            const children = await db.Module.count({ where: { parentId: menu.id }, transaction });
            if (children) {
                throw httpError("Actions can only be added to menus that have no submenus.");
            }
            const permission = await this.createPermission(menu, action, transaction);
            await transaction.commit();
            return permission;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async removeAction(menuId, permissionId) {
        const permission = await db.Permission.findOne({ where: { id: permissionId, moduleId: menuId } });
        if (!permission) {
            throw httpError("Action permission not found.", 404);
        }
        if (STANDARD_ACTION_KEYS.has(actionSlug(permission.action))) {
            throw httpError("Standard actions cannot be removed.", 409);
        }
        const roles = await this.rolesUsingPermissions([permission.id]);
        if (roles.length) {
            throw httpError(`This action is assigned to: ${roles.join(", ")}. Remove it from those roles first.`, 409);
        }
        await permission.destroy();
        return true;
    }
}

module.exports = new MenuService();
module.exports.buildMenuTree = buildMenuTree;
module.exports.filterMenusForUser = filterMenusForUser;
module.exports.slugify = slugify;
