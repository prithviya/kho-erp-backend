const assert = require("node:assert/strict");
const { after, test } = require("node:test");
const db = require("../src/model");
const menuService = require("../src/services/menu.service");
const requireTrustedOrigin = require("../src/middleware/trustedOrigin.middleware");
const { requireAnyRole } = require("../src/middleware/roleAccess.middleware");

const { buildMenuTree, filterMenusForUser } = menuService;

const originals = {
    transaction: db.sequelize.transaction,
    moduleFindByPk: db.Module.findByPk,
    moduleFindOne: db.Module.findOne,
    moduleFindAll: db.Module.findAll,
    moduleCount: db.Module.count,
    permissionUpdate: db.Permission.update,
    permissionDestroy: db.Permission.destroy,
    roleFindAll: db.Role.findAll,
};

after(() => {
    db.sequelize.transaction = originals.transaction;
    db.Module.findByPk = originals.moduleFindByPk;
    db.Module.findOne = originals.moduleFindOne;
    db.Module.findAll = originals.moduleFindAll;
    db.Module.count = originals.moduleCount;
    db.Permission.update = originals.permissionUpdate;
    db.Permission.destroy = originals.permissionDestroy;
    db.Role.findAll = originals.roleFindAll;
});

const menus = [
    { id: 1, name: "HRM", code: "HRM", route: null, parentId: null, displayOrder: 2, isActive: true },
    { id: 2, name: "Employee", code: "EMPLOYEE", route: "/employee", parentId: 1, displayOrder: 2, isActive: true },
    { id: 3, name: "Opening", code: "OPENING", route: "/job", parentId: 1, displayOrder: 1, isActive: true },
    { id: 4, name: "CRM", code: "CRM", route: null, parentId: null, displayOrder: 1, isActive: true },
    { id: 5, name: "Reports", code: "REPORTS", route: "/report", parentId: 4, displayOrder: 1, isActive: false },
];

const userWith = (...keys) => ({
    id: 9,
    isSuperAdmin: false,
    roles: [{ isActive: true, permissions: keys.map((permissionKey) => ({ permissionKey })) }],
});

const fakeTransaction = () => {
    db.sequelize.transaction = async () => ({ commit: async () => {}, rollback: async () => {} });
};

test("menus are returned as an ordered parent/submenu tree", () => {
    const tree = buildMenuTree(menus);
    assert.deepEqual(tree.map((item) => item.name), ["CRM", "HRM"]);
    assert.deepEqual(tree[1].children.map((item) => item.name), ["Opening", "Employee"]);
});

test("a user only receives menus their role may view and gets nothing by default", () => {
    const viewer = filterMenusForUser(menus, userWith("employee.view"));
    assert.deepEqual(viewer.menus.map((item) => item.code), ["HRM", "EMPLOYEE"]);
    assert.deepEqual(viewer.permissionKeys, ["employee.view"]);

    // Create alone does not make a menu visible; View is required.
    assert.equal(filterMenusForUser(menus, userWith("employee.create")).menus.length, 0);
    assert.equal(filterMenusForUser(menus, userWith()).menus.length, 0);
});

test("disabled menus are hidden from every role and reported as disabled routes", () => {
    const result = filterMenusForUser(menus, userWith("reports.view", "opening.view"));
    assert.deepEqual(result.menus.map((item) => item.code), ["HRM", "OPENING"]);
    assert.deepEqual(result.disabledRoutes, ["/report"]);

    const admin = filterMenusForUser(menus, { id: 1, isSuperAdmin: true, roles: [] });
    assert.deepEqual(admin.menus.map((item) => item.code), ["HRM", "OPENING", "EMPLOYEE"]);
    assert.equal(admin.permissionKeys, null);
});

test("changing one role's permissions does not change another role's menus", () => {
    const first = filterMenusForUser(menus, userWith("employee.view"));
    const second = filterMenusForUser(menus, userWith("opening.view"));
    assert.deepEqual(first.menus.map((item) => item.code), ["HRM", "EMPLOYEE"]);
    assert.deepEqual(second.menus.map((item) => item.code), ["HRM", "OPENING"]);
});

test("menu input is validated", async () => {
    fakeTransaction();
    await assert.rejects(menuService.createMenu({ name: "" }), (error) => error.status === 400);
    await assert.rejects(
        menuService.createMenu({ name: "Bad", route: "javascript:alert(1)" }),
        (error) => error.status === 400
    );
    await assert.rejects(
        menuService.createMenu({ name: "Bad icon", route: "/ok", icon: "<img>" }),
        (error) => error.status === 400
    );
});

test("duplicate menu names or codes are rejected", async () => {
    fakeTransaction();
    db.Module.findByPk = async () => null;
    db.Module.findOne = async ({ where }) => (where.code === "EMPLOYEE" ? { id: 2 } : null);
    await assert.rejects(menuService.createMenu({ name: "Employee" }), (error) => error.status === 409);
});

test("deleting a menu checks built-in status, submenus and role assignments", async () => {
    const menu = (data) => ({ ...data, destroy: async () => {}, Permissions: [{ id: 50 }] });

    db.Module.findByPk = async () => menu({ id: 2, code: "EMPLOYEE" });
    await assert.rejects(menuService.deleteMenu(2), (error) => error.status === 409 && /Built-in/.test(error.message));

    db.Module.findByPk = async () => menu({ id: 20, code: "CUSTOM_SECTION" });
    db.Module.count = async () => 2;
    await assert.rejects(menuService.deleteMenu(20), (error) => error.status === 409 && /submenus/.test(error.message));

    db.Module.count = async () => 0;
    db.Role.findAll = async () => [{ name: "Viewer" }];
    await assert.rejects(menuService.deleteMenu(20), (error) => error.status === 409 && /Viewer/.test(error.message));

    fakeTransaction();
    let destroyed = false;
    db.Role.findAll = async () => [];
    db.Permission.destroy = async () => { destroyed = true; };
    db.Module.findByPk = async () => ({ id: 20, code: "CUSTOM_SECTION", Permissions: [], destroy: async () => {} });
    assert.equal(await menuService.deleteMenu(20), true);
    assert.equal(destroyed, true);
});

test("disabling a menu also disables its permissions so the API denies access", async () => {
    fakeTransaction();
    const updates = [];
    const record = {
        id: 20,
        code: "CUSTOM",
        name: "Custom",
        parentId: null,
        update: async (data) => updates.push(data),
    };
    db.Module.findByPk = async () => record;
    db.Module.findAll = async () => [];
    db.Module.findOne = async () => null;
    let permissionUpdate = null;
    db.Permission.update = async (values, options) => { permissionUpdate = { values, where: options.where }; };

    await menuService.updateMenu(20, { isActive: false }).catch(() => {});
    assert.deepEqual(updates[0], { isActive: false });
    assert.deepEqual(permissionUpdate, { values: { isActive: false }, where: { moduleId: [20] } });
});

test("menus cannot be nested deeper than one level", async () => {
    fakeTransaction();
    db.Module.findByPk = async () => ({ id: 3, parentId: 1 });
    await assert.rejects(
        menuService.createMenu({ name: "Deep", parentId: 3 }),
        (error) => error.status === 400 && /one level/.test(error.message)
    );
});

test("only Super Admin passes the menu and role administration guard", async () => {
    const run = async (user) => {
        const res = {
            status(code) { this.statusCode = code; return this; },
            json(body) { this.body = body; return this; },
        };
        let nexted = false;
        await requireAnyRole(["super_admin"])({ user }, res, () => { nexted = true; });
        return { nexted, status: res.statusCode };
    };

    const admin = { id: 2, isSuperAdmin: false, roleSet: new Set(["admin"]), roles: [] };
    assert.deepEqual(await run(admin), { nexted: false, status: 403 });
    const selfGranting = {
        id: 3,
        isSuperAdmin: false,
        roleSet: new Set(["manager"]),
        roles: [{ isActive: true, permissions: [{ permissionKey: "user_management.edit" }] }],
    };
    assert.deepEqual(await run(selfGranting), { nexted: false, status: 403 });
    assert.equal((await run({ id: 1, isSuperAdmin: true, roleSet: new Set(["superadmin"]), roles: [] })).nexted, true);
});

test("admin writes from a foreign origin are rejected", () => {
    const call = (method, origin) => {
        const res = {
            status(code) { this.statusCode = code; return this; },
            json() { return this; },
        };
        let nexted = false;
        requireTrustedOrigin({ method, headers: origin ? { origin } : {} }, res, () => { nexted = true; });
        return { nexted, status: res.statusCode };
    };
    process.env.FRONTEND_URL = "https://staging.khosocial.com";
    assert.equal(call("POST", "https://evil.example").nexted, false);
    assert.equal(call("POST", "https://evil.example").status, 403);
    assert.equal(call("POST", "https://staging.khosocial.com").nexted, true);
    assert.equal(call("GET", "https://evil.example").nexted, true);
    assert.equal(call("DELETE", undefined).nexted, true);
});
