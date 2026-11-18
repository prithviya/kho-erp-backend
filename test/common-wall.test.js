const assert = require("node:assert/strict");
const { test } = require("node:test");
const { buildEmployeeSections } = require("../src/services/commonWall.service");

test("Common Wall celebration windows include yesterday through tomorrow", () => {
    const data = buildEmployeeSections([
        {
            id: 1,
            fullName: "Yesterday",
            status: "Active",
            dateOfBirth: "1996-11-15",
            joiningDate: "2018-03-01",
        },
        {
            id: 2,
            fullName: "Today",
            status: "Active",
            dateOfBirth: "1994-11-16",
            joiningDate: "2020-11-16",
        },
        {
            id: 3,
            fullName: "Tomorrow",
            status: "Active",
            dateOfBirth: "1998-11-17",
            joiningDate: "2022-11-17",
        },
        {
            id: 4,
            fullName: "Outside window",
            status: "Active",
            dateOfBirth: "1997-11-14",
            joiningDate: "2021-11-14",
        },
        {
            id: 5,
            fullName: "Inactive",
            status: "Inactive",
            dateOfBirth: "1995-11-16",
            joiningDate: "2020-11-16",
        },
    ], "2026-11-16");

    assert.deepEqual(data.birthdays.map((person) => person.id), [1, 2, 3]);
    assert.deepEqual(data.anniversaries.map((person) => person.id), [2, 3]);
    assert.equal(data.anniversaries[1].yearsCompleted, 4);
});

test("Common Wall New Hires includes joining dates from today through seven days ahead", () => {
    const data = buildEmployeeSections([
        { id: 1, fullName: "Today", status: "Active", joiningDate: "2026-11-16" },
        { id: 2, fullName: "Day seven", status: "Active", joiningDate: "2026-11-23" },
        { id: 3, fullName: "Day eight", status: "Active", joiningDate: "2026-11-24" },
        { id: 4, fullName: "Yesterday", status: "Active", joiningDate: "2026-11-15" },
    ], "2026-11-16");

    assert.deepEqual(data.newHires.map((person) => person.id), [1, 2]);
});

