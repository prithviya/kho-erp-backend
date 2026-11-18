const assert = require("node:assert/strict");
const { after, test } = require("node:test");
const db = require("../src/model");
const groupChatService = require("../src/services/groupChat.service");

const originals = {
    groupFindByPk: db.GroupChat.findByPk,
    groupFindAll: db.GroupChat.findAll,
    memberFindOne: db.GroupChatMember.findOne,
    userFindAll: db.User.findAll,
    userFindByPk: db.User.findByPk,
    employeeFindAll: db.Employee.findAll,
};

after(() => {
    db.GroupChat.findByPk = originals.groupFindByPk;
    db.GroupChat.findAll = originals.groupFindAll;
    db.GroupChatMember.findOne = originals.memberFindOne;
    db.User.findAll = originals.userFindAll;
    db.User.findByPk = originals.userFindByPk;
    db.Employee.findAll = originals.employeeFindAll;
});

test("employees cannot create groups", async () => {
    await assert.rejects(
        groupChatService.createGroup({ name: "Team" }, { id: 3, roleSet: new Set(["employee"]) }),
        (error) => error.status === 403
    );
});

test("member options expose employee job positions as designations", async () => {
    db.User.findAll = async () => [
        {
            id: 20,
            firstName: "Priya",
            lastName: "Shah",
            email: "priya@example.com",
            employeeRecord: "EMP-20",
            roles: [],
            toJSON() {
                return {
                    id: this.id,
                    firstName: this.firstName,
                    lastName: this.lastName,
                    email: this.email,
                    employeeRecord: this.employeeRecord,
                    roles: this.roles,
                };
            },
        },
        {
            id: 21,
            firstName: "Superadmin",
            lastName: "Admin",
            email: "admin@example.com",
            employeeRecord: "",
            roles: [{ name: "Super Admin", code: "SUPER_ADMIN" }],
        },
    ];
    db.Employee.findAll = async () => [{
        employeeCode: "EMP-20",
        email: "priya@example.com",
        jobPosition: "UI/UX Designer",
    }];

    const users = await groupChatService.listMemberOptions({ isSuperAdmin: true });

    assert.equal(users.length, 1);
    assert.equal(users[0].designation, "UI/UX Designer");
    assert.equal(Object.hasOwn(users[0], "employeeRecord"), false);
});

test("managers cannot remove Super Admins or Managers from a group", async () => {
    db.GroupChat.findByPk = async () => ({ members: [{ userId: 20 }] });
    db.GroupChatMember.findOne = async () => ({ destroy: async () => {} });

    for (const role of ["Manager", "Super Admin"]) {
        db.User.findByPk = async () => ({
            roles: [{ name: role, code: role.toUpperCase().replace(" ", "_") }],
        });
        await assert.rejects(
            groupChatService.removeMember(10, 20, { id: 1, roleSet: new Set(["manager"]) }),
            (error) => error.status === 403
        );
    }
});
