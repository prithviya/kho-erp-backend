const test = require("node:test");
const assert = require("node:assert/strict");
const {
    getPermissionMonthBalance,
    getCasualLeaveMonthBalance,
} = require("../src/services/leave.policy");

test("permission summary separates monthly allocation from the usage cap", () => {
    const balance = getPermissionMonthBalance([
        { status: "APPROVED", requestedHours: 1.25 },
        { status: "PENDING", requestedHours: 0.5 },
        { status: "REJECTED", requestedHours: 4 },
    ]);

    assert.deepEqual(balance, {
        allocatedHours: 6,
        usageLimitHours: 2,
        usedHours: 1.25,
        bookedHours: 1.75,
        pendingHours: 0.5,
        remainingHours: 0.25,
    });
});

test("unused Casual Leave carries one day into the next month", () => {
    const balance = getCasualLeaveMonthBalance([], []);

    assert.deepEqual(balance, {
        monthlyAllocation: 1,
        carryForwardDays: 1,
        allocatedDays: 2,
        bookedDays: 0,
        remainingDays: 2,
    });
});

test("Casual Leave taken in the previous month disables carry-forward", () => {
    const balance = getCasualLeaveMonthBalance(
        [{ status: "APPROVED", requestedDays: 0.5 }],
        [{ status: "APPROVED", requestedDays: 0.5 }]
    );

    assert.deepEqual(balance, {
        monthlyAllocation: 1,
        carryForwardDays: 0,
        allocatedDays: 1,
        bookedDays: 0.5,
        remainingDays: 0.5,
    });
});

test("a new hire is not eligible for carry-forward from before their joining month", () => {
    const balance = getCasualLeaveMonthBalance([], [], false);

    assert.equal(balance.carryForwardDays, 0);
    assert.equal(balance.allocatedDays, 1);
    assert.equal(balance.remainingDays, 1);
});
