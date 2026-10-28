const assert = require("node:assert/strict");
const { after, test } = require("node:test");
const db = require("../src/model");
const roleService = require("../src/services/role.service");

const originals = {
    transaction: db.sequelize.transaction,
    roleFindByPk: db.Role.findByPk,
    roleFindAll: db.Role.findAll,
    moduleFindAll: db.Module.findAll,
    permissionFindAll: db.Permission.findAll,
    permissionCount: db.Permission.count,
};

after(() => {
    db.sequelize.transaction = originals.transaction;
    db.Role.findByPk = originals.roleFindByPk;
    db.Role.findAll = originals.roleFindAll;
    db.Module.findAll = originals.moduleFindAll;
    db.Permission.findAll = originals.permissionFindAll;
    db.Permission.count = originals.permissionCount;
});

const ACTIONS = ["View", "Create", "Edit", "Delete"];
let nextId = 1;
const makeModule = (code, parentId, actions = ACTIONS) => {
    const id = nextId++;
    return {
        id,
        name: code,
        code,
        route: parentId ? `/${code.toLowerCase()}` : null,
        parentId,
        Permissions: actions.map((action) => ({
            id: id * 10 + ACTIONS.indexOf(action),
            moduleId: id,
            action,
            permissionKey: `${code.toLowerCase()}.${action.toLowerCase()}`,
        })),
    };
};

const hrm = makeModule("HRM", null, []);
const employee = makeModule("EMPLOYEE", hrm.id);
const leave = makeModule("LEAVE", hrm.id);
const assign = makeModule("ASSIGN_BOARD", hrm.id);
const tasks = makeModule("TASKS", hrm.id);
const dashboard = makeModule("DASHBOARD", hrm.id);
const modules = [hrm, employee, leave, assign, tasks, dashboard];
const allPermissions = modules.flatMap((module) => module.Permissions);

const mockCatalog = () => {
    db.Module.findAll = async () => modules;
    db.Permission.findAll = async (options = {}) => (
        options.include
            ? allPermissions.map((permission) => ({
                ...permission,
                Module: modules.find((module) => module.id === permission.moduleId),
            }))
            : allPermissions
    );
    db.Permission.count = async ({ where }) => where.id.length;
    db.sequelize.transaction = async () => ({ commit: async () => {}, rollback: async () => {} });
};

const makeRole = (data) => ({
    id: 5,
    isActive: true,
    permissionsConfigured: false,
    permissions: [],
    updates: [],
    granted: null,
    async update(values) { this.updates.push(values); },
    async setPermissions(ids) { this.granted = ids; },
    ...data,
});

test("unconfigured roles are prefilled from legacy page access", async () => {
    mockCatalog();
    db.Role.findByPk = async () => makeRole({ code: "HR", name: "HR" });
    const matrix = await roleService.getPermissionMatrix(5);
    assert.equal(matrix.prefilled, true);
    const names = matrix.sections[0].menus.map((menu) => menu.code);
    assert.ok(names.includes("EMPLOYEE") && !names.includes("TASKS"), "hidden task menus are not listed");
    assert.deepEqual(
        matrix.grantedPermissionIds.sort((a, b) => a - b),
        [...employee.Permissions, ...leave.Permissions, ...assign.Permissions].map((p) => p.id).sort((a, b) => a - b)
    );
});

test("dashboard only exposes the View action and configured roles use stored grants", async () => {
    mockCatalog();
    db.Role.findByPk = async () => makeRole({
        code: "CEO",
        name: "CEO",
        permissionsConfigured: true,
        permissions: [{ id: employee.Permissions[0].id }],
    });
    const matrix = await roleService.getPermissionMatrix(5);
    assert.equal(matrix.prefilled, false);
    assert.deepEqual(matrix.grantedPermissionIds, [employee.Permissions[0].id]);
    const dash = matrix.sections[0].menus.find((menu) => menu.code === "DASHBOARD");
    assert.deepEqual(dash.permissions.map((permission) => permission.action), ["View"]);
});

test("the matrix refuses to configure Super Admin", async () => {
    mockCatalog();
    db.Role.findByPk = async () => makeRole({ code: "SUPER_ADMIN", name: "Super Admin" });
    await assert.rejects(roleService.getPermissionMatrix(5), (error) => error.status === 400);
});

test("saving grants implies View and mirrors Assign Board onto hidden task menus", async () => {
    mockCatalog();
    const role = makeRole({ code: "X", name: "X" });
    await roleService.setRolePermissions(role, [employee.Permissions[2].id, assign.Permissions[1].id]);
    const granted = new Set(role.granted);
    assert.ok(granted.has(employee.Permissions[0].id), "Edit implies View");
    assert.ok(granted.has(assign.Permissions[0].id), "Create implies View");
    assert.ok(granted.has(tasks.Permissions[1].id), "task create mirrors assign_board.create");
    assert.ok(!granted.has(leave.Permissions[0].id));
});

test("legacy backfill is a dry run by default and skips Super Admin and configured roles", async () => {
    mockCatalog();
    const hr = makeRole({ id: 1, code: "HR", name: "HR" });
    const superAdmin = makeRole({ id: 2, code: "SUPER_ADMIN", name: "Super Admin" });
    const configured = makeRole({ id: 3, code: "MANAGER", name: "Manager", permissionsConfigured: true });
    db.Role.findAll = async () => [hr, superAdmin, configured];

    const dry = await roleService.backfillLegacyRoles();
    assert.equal(dry.dryRun, true);
    assert.deepEqual(dry.roles.map((role) => role.code), ["HR"]);
    assert.equal(hr.granted, null);
    assert.equal(hr.updates.length, 0);

    // initializePermissionCatalog is exercised elsewhere; stub it for the apply run.
    roleService.initializePermissionCatalog = async () => ({});
    await roleService.backfillLegacyRoles({ dryRun: false });
    assert.deepEqual(hr.updates, [{ permissionsConfigured: true }]);
    assert.ok(hr.granted.length >= 12);
    assert.equal(superAdmin.granted, null);
    assert.equal(configured.granted, null);
});
