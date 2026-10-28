const assert = require("node:assert/strict");
const { after, test } = require("node:test");
const db = require("../src/model");
const roleRepository = require("../src/repository/role.repository");
const roleService = require("../src/services/role.service");
const rolePermissionsMigration = require("../migrations/20261027000100-add-permissions-configured-to-roles");
const requireModulePermission = require("../src/middleware/modulePermission.middleware");
const { requireAnyRole } = require("../src/middleware/roleAccess.middleware");
const authService = require("../src/services/auth.service");
const { hasEventPermission } = require("../src/realtime/socket");

const originalMethods = {
    transaction: db.sequelize.transaction,
    roleFindByPk: db.Role.findByPk,
    roleFindById: roleRepository.findById,
    moduleFindOne: db.Module.findOne,
    moduleCreate: db.Module.create,
    moduleFindAll: db.Module.findAll,
    permissionFindOne: db.Permission.findOne,
    permissionCreate: db.Permission.create,
};

after(() => {
    db.sequelize.transaction = originalMethods.transaction;
    db.Role.findByPk = originalMethods.roleFindByPk;
    roleRepository.findById = originalMethods.roleFindById;
    db.Module.findOne = originalMethods.moduleFindOne;
    db.Module.create = originalMethods.moduleCreate;
    db.Module.findAll = originalMethods.moduleFindAll;
    db.Permission.findOne = originalMethods.permissionFindOne;
    db.Permission.create = originalMethods.permissionCreate;
});

test("role updates protect Super Admin and preserve legacy permissions when omitted", async () => {
    let rollbacks = 0;
    const updates = [];
    db.sequelize.transaction = async () => ({
        commit: async () => {},
        rollback: async () => { rollbacks += 1; },
    });
    db.Role.findByPk = async (id) => (
        String(id) === "1"
            ? {
                id: 1,
                code: "SUPER_ADMIN",
                name: "Super Admin",
                update: async () => assert.fail("Super Admin must not be updated"),
            }
            : {
                id: 2,
                code: "HR",
                name: "HR",
                update: async (data) => { updates.push(data); },
            }
    );
    roleRepository.findById = async (id) => ({ id });

    await assert.rejects(
        roleService.updateRole(1, { isActive: false, permissionIds: [] }),
        (error) => error.status === 400
    );
    assert.equal(rollbacks, 1);

    await roleService.updateRole(2, { name: "Human Resources" });
    assert.deepEqual(updates, [{ name: "Human Resources" }]);
});

test("permission catalog initialization is additive and idempotent", async () => {
    const modules = new Map();
    const permissions = new Map();
    let moduleWrites = 0;
    let permissionWrites = 0;

    db.sequelize.transaction = async () => ({
        commit: async () => {},
        rollback: async () => {},
    });
    db.Module.findOne = async ({ where }) => modules.get(where.code) || null;
    db.Module.create = async (data) => {
        const module = { id: modules.size + 1, ...data };
        modules.set(data.code, module);
        moduleWrites += 1;
        return module;
    };
    db.Module.findAll = async () => [];
    db.Permission.findOne = async ({ where }) => permissions.get(where.permissionKey) || null;
    db.Permission.create = async (data) => {
        const permission = { id: permissions.size + 1, ...data };
        permissions.set(data.permissionKey, permission);
        permissionWrites += 1;
        return permission;
    };

    const first = await roleService.initializePermissionCatalog();
    const firstWriteCounts = [moduleWrites, permissionWrites];
    const second = await roleService.initializePermissionCatalog();

    assert.ok(first.createdModules > 0);
    assert.ok(first.createdPermissions > 0);
    assert.deepEqual([second.createdModules, second.createdPermissions], [0, 0]);
    assert.deepEqual([moduleWrites, permissionWrites], firstWriteCounts);
});

test("role configuration migration is idempotent", async () => {
    let additions = 0;
    let removals = 0;
    const queryInterface = {
        describeTable: async () => ({}),
        addColumn: async (tableName, columnName, definition) => {
            assert.equal(tableName, "roles");
            assert.equal(columnName, "permissionsConfigured");
            assert.equal(definition.allowNull, true);
            additions += 1;
        },
        removeColumn: async (tableName, columnName) => {
            assert.equal(tableName, "roles");
            assert.equal(columnName, "permissionsConfigured");
            removals += 1;
        },
    };

    await rolePermissionsMigration.up(queryInterface, { BOOLEAN: "BOOLEAN" });
    await rolePermissionsMigration.up({
        ...queryInterface,
        describeTable: async () => ({ permissionsConfigured: {} }),
    }, { BOOLEAN: "BOOLEAN" });
    assert.equal(additions, 1);

    await rolePermissionsMigration.down({
        ...queryInterface,
        describeTable: async () => ({ permissionsConfigured: {} }),
    });
    await rolePermissionsMigration.down(queryInterface);
    assert.equal(removals, 1);
});

test("API permissions enforce the requested action and keep Super Admin unrestricted", () => {
    const authorize = (user, method, moduleCodes) => {
        const req = { user, method };
        let nextCalled = false;
        const res = {
            statusCode: null,
            body: null,
            status(statusCode) {
                this.statusCode = statusCode;
                return this;
            },
            json(body) {
                this.body = body;
                return this;
            },
        };
        requireModulePermission(moduleCodes)(req, res, () => { nextCalled = true; });
        return { req, res, nextCalled };
    };

    const configuredUser = {
        id: 2,
        isSuperAdmin: false,
        roles: [{
            isActive: true,
            permissions: [{ permissionKey: "employee.view" }],
        }],
    };
    assert.equal(authorize(configuredUser, "GET", "employee").nextCalled, true);
    const deniedEdit = authorize(configuredUser, "PUT", "employee");
    assert.equal(deniedEdit.nextCalled, false);
    assert.equal(deniedEdit.res.statusCode, 403);
    const reportRead = authorize(configuredUser, "GET", (req, action) => [
        `reports.${action}`,
        `employee.${action}`,
    ]);
    assert.equal(reportRead.nextCalled, true);

    const legacyUser = {
        id: 3,
        isSuperAdmin: false,
        roles: [{ code: "HR", permissionsConfigured: false, permissions: [] }],
    };
    assert.equal(authorize(legacyUser, "GET", "employee").res.statusCode, 403);

    const superAdmin = { id: 1, isSuperAdmin: true, roles: [] };
    assert.equal(authorize(superAdmin, "DELETE", "employee").nextCalled, true);
});

test("a granted module action can pass legacy role allow-lists", async () => {
    const user = {
        id: 2,
        isSuperAdmin: false,
        roleSet: new Set(["teammember"]),
        roles: [{
            isActive: true,
            permissions: [{ permissionKey: "employee.edit" }],
        }],
    };
    const req = { user, method: "PUT" };
    const res = {
        status(statusCode) {
            this.statusCode = statusCode;
            return this;
        },
        json(body) {
            this.body = body;
            return this;
        },
    };
    const permissionPassed = await new Promise((resolve) => {
        requireModulePermission("employee")(req, res, () => resolve(true));
        if (res.statusCode) resolve(false);
    });
    assert.equal(permissionPassed, true);

    const rolePassed = await new Promise((resolve) => {
        requireAnyRole(["hr"])(req, res, () => resolve(true));
        if (res.statusCode) resolve(false);
    });
    assert.equal(rolePassed, true);
});

test("public registration cannot assign roles", async () => {
    await assert.rejects(
        authService.register({ email: "external@example.com", roleIds: [1] }),
        (error) => error.status === 403
    );
});

test("realtime events require an active user's matching module permission", () => {
    const projectUser = {
        isActive: true,
        roles: [{
            code: "PROJECT_MEMBER",
            isActive: true,
            permissions: [{ permissionKey: "project_onboard.view" }],
        }],
    };
    assert.equal(hasEventPermission(projectUser, "project-message"), true);
    assert.equal(hasEventPermission(projectUser, "task-message"), false);
    assert.equal(hasEventPermission(projectUser, "unknown-event"), false);
    assert.equal(hasEventPermission({
        ...projectUser,
        roles: [{ ...projectUser.roles[0], isActive: false }],
    }, "project-message"), false);
    assert.equal(hasEventPermission({
        isActive: true,
        roles: [{ code: "SUPER_ADMIN", isActive: true }],
    }, "task-activity"), true);
    assert.equal(hasEventPermission({
        isActive: true,
        roles: [{ code: "SUPER_ADMIN", isActive: false }],
    }, "task-activity"), false);
    assert.equal(hasEventPermission({ ...projectUser, isActive: false }, "project-message"), false);
});
