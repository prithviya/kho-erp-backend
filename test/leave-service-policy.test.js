const test = require("node:test");
const assert = require("node:assert/strict");
const db = require("../src/model");
const leaveService = require("../src/services/leave.service");

test("Permission validation enforces the monthly limit and rejects cross-month requests", async () => {
    const originalFindAll = db.LeaveRequest.findAll;
    db.LeaveRequest.findAll = async () => [
        { status: "APPROVED", requestedHours: 1.5 },
    ];

    try {
        await assert.rejects(
            leaveService.ensureBalanceAvailable({
                category: { code: "PERMISSION", unit: "HOUR", id: 1 },
                userId: 5,
                fromDate: "2026-10-10",
                toDate: "2026-10-10",
                requestedHours: 0.51,
            }),
            (error) => error.status === 400 && /exceeds 2 hours/.test(error.message)
        );
        await assert.doesNotReject(leaveService.ensureBalanceAvailable({
            category: { code: "PERMISSION", unit: "HOUR", id: 1 },
            userId: 5,
            fromDate: "2026-10-10",
            toDate: "2026-10-10",
            requestedHours: 0.5,
        }));
        await assert.rejects(
            leaveService.ensureBalanceAvailable({
                category: { code: "PERMISSION", unit: "HOUR", id: 1 },
                userId: 5,
                fromDate: "2026-10-31",
                toDate: "2026-11-01",
                requestedHours: 0.25,
            }),
            (error) => error.status === 400 && /within one calendar month/.test(error.message)
        );
    } finally {
        db.LeaveRequest.findAll = originalFindAll;
    }
});

test("Casual Leave validation permits one carried day only when previous month had no request", async () => {
    const originalFindAll = db.LeaveRequest.findAll;
    const originalUserFindByPk = db.User.findByPk;
    const originalOnboardingFindOne = db.OnboardingInfo.findOne;
    let existingRequests = [];
    db.LeaveRequest.findAll = async () => existingRequests;
    db.User.findByPk = async () => null;
    db.OnboardingInfo.findOne = async () => null;

    try {
        await assert.doesNotReject(leaveService.ensureCasualLeaveMonthsAvailable({
            userId: 5,
            categoryId: 2,
            fromDate: "2026-11-10",
            toDate: "2026-11-11",
            requestedDays: 2,
        }));
        await assert.rejects(
            leaveService.ensureCasualLeaveMonthsAvailable({
                userId: 5,
                categoryId: 2,
                fromDate: "2026-11-10",
                toDate: "2026-11-12",
                requestedDays: 3,
            }),
            (error) => error.status === 400 && /Insufficient Casual Leave balance/.test(error.message)
        );

        existingRequests = [{
            fromDate: "2026-12-15",
            toDate: "2026-12-15",
            durationType: "FULL_DAY",
            requestedDays: 1,
            status: "APPROVED",
        }];
        await assert.rejects(
            leaveService.ensureCasualLeaveMonthsAvailable({
                userId: 5,
                categoryId: 2,
                fromDate: "2027-01-10",
                toDate: "2027-01-11",
                requestedDays: 1.5,
            }),
            (error) => error.status === 400 && /Insufficient Casual Leave balance/.test(error.message)
        );

        existingRequests = [{
            fromDate: "2026-10-15",
            toDate: "2026-10-15",
            durationType: "FULL_DAY",
            requestedDays: 1,
            status: "APPROVED",
        }];
        await assert.rejects(
            leaveService.ensureCasualLeaveMonthsAvailable({
                userId: 5,
                categoryId: 2,
                fromDate: "2026-11-10",
                toDate: "2026-11-11",
                requestedDays: 1.5,
            }),
            (error) => error.status === 400 && /Insufficient Casual Leave balance/.test(error.message)
        );
    } finally {
        db.LeaveRequest.findAll = originalFindAll;
        db.User.findByPk = originalUserFindByPk;
        db.OnboardingInfo.findOne = originalOnboardingFindOne;
    }
});

test("new November hire gets no October carry-forward but can carry unused November leave to December", async () => {
    const originalFindAll = db.LeaveRequest.findAll;
    const originalUserFindByPk = db.User.findByPk;
    const originalOnboardingFindOne = db.OnboardingInfo.findOne;
    db.LeaveRequest.findAll = async () => [];
    db.User.findByPk = async () => ({ employeeRecord: "E-NOV" });
    db.OnboardingInfo.findOne = async () => ({ doj: "2026-11-03" });

    try {
        await assert.rejects(
            leaveService.ensureCasualLeaveMonthsAvailable({
                userId: 55,
                categoryId: 2,
                fromDate: "2026-11-10",
                toDate: "2026-11-11",
                requestedDays: 2,
            }),
            (error) => error.status === 400 && /Insufficient Casual Leave balance/.test(error.message)
        );
        await assert.doesNotReject(leaveService.ensureCasualLeaveMonthsAvailable({
            userId: 55,
            categoryId: 2,
            fromDate: "2026-11-10",
            toDate: "2026-11-10",
            requestedDays: 1,
        }));
        await assert.doesNotReject(leaveService.ensureCasualLeaveMonthsAvailable({
            userId: 55,
            categoryId: 2,
            fromDate: "2026-12-10",
            toDate: "2026-12-11",
            requestedDays: 2,
        }));
    } finally {
        db.LeaveRequest.findAll = originalFindAll;
        db.User.findByPk = originalUserFindByPk;
        db.OnboardingInfo.findOne = originalOnboardingFindOne;
    }
});

test("calendar entries include the employee name and leave status", async () => {
    const originalFindAll = db.LeaveRequest.findAll;
    db.LeaveRequest.findAll = async () => [{
        toJSON: () => ({
            id: 21,
            employeeName: "Old Employee Name",
            fromDate: "2026-10-29",
            toDate: "2026-10-29",
            status: "APPROVED",
            category: { code: "CASUAL_LEAVE", name: "Casual Leave" },
            requester: { firstName: "Current", lastName: "Employee", email: "current@example.com" },
        }),
    }, {
        toJSON: () => ({
            id: 22,
            employeeName: null,
            fromDate: "2026-10-30",
            toDate: "2026-10-30",
            status: "PENDING",
            category: { code: "PERMISSION", name: "Permission" },
            requester: { firstName: "", lastName: "", email: "employee@example.com" },
        }),
    }];

    try {
        const calendar = await leaveService.listCalendarRequests(2026, 10, {
            id: 8,
            roleSet: new Set(["hr"]),
        });
        assert.equal(calendar[0].employeeName, "Current Employee");
        assert.equal(calendar[0].status, "APPROVED");
        assert.equal(calendar[1].employeeName, "employee@example.com");
        assert.equal(calendar[1].status, "PENDING");
    } finally {
        db.LeaveRequest.findAll = originalFindAll;
    }
});

test("leave request access is restricted to the employee and assigned approver unless HR", () => {
    const ownRequests = leaveService.getRequestAccessWhere({}, { id: 5, roleSet: new Set(["teammember"]) });
    assert.deepEqual(ownRequests[Object.getOwnPropertySymbols(ownRequests)[0]], [
        { userId: 5 },
        { designatedApproverId: 5 },
    ]);

    const hrRequests = leaveService.getRequestAccessWhere({}, { id: 9, roleSet: new Set(["hr"]) });
    assert.deepEqual(hrRequests, {});

    const filteredHrRequests = leaveService.getRequestAccessWhere({ userId: "5" }, {
        id: 9,
        roleSet: new Set(["hr"]),
    });
    assert.equal(filteredHrRequests.userId, 5);
});

test("leave summary resolves organization-admin access without breaking employee summaries", async () => {
    const originalCategoryFindAll = db.LeaveCategory.findAll;
    const originalRequestFindAll = db.LeaveRequest.findAll;
    const originalUserFindByPk = db.User.findByPk;
    const originalOnboardingFindOne = db.OnboardingInfo.findOne;
    db.LeaveCategory.findAll = async () => [
        { id: 1, code: "CASUAL_LEAVE", name: "Casual Leave", unit: "DAY", allocatedValue: 12 },
        { id: 2, code: "PERMISSION", name: "Permission", unit: "HOUR", allocatedValue: 6 },
    ];
    db.LeaveRequest.findAll = async () => [];
    db.User.findByPk = async () => null;
    db.OnboardingInfo.findOne = async () => null;

    try {
        const summary = await leaveService.getSummary({
            id: 5,
            roleSet: new Set(["teammember"]),
        });
        assert.equal(summary.userId, 5);
        assert.equal(summary.categories.length, 2);
    } finally {
        db.LeaveCategory.findAll = originalCategoryFindAll;
        db.LeaveRequest.findAll = originalRequestFindAll;
        db.User.findByPk = originalUserFindByPk;
        db.OnboardingInfo.findOne = originalOnboardingFindOne;
    }
});

test("team report employee filters cannot escape the assigned team", async () => {
    const originalOnboardingFindAll = db.OnboardingInfo.findAll;
    const originalUserFindAll = db.User.findAll;
    const originalRequestFindAll = db.LeaveRequest.findAll;
    db.OnboardingInfo.findAll = async () => [{
        employeeId: "E007",
        reportHead: "Team Lead",
        department: 4,
        onboardinginfoid: 1,
    }];
    db.User.findAll = async () => [{ id: 7, employeeRecord: "E007" }];
    db.LeaveRequest.findAll = async () => [];

    try {
        await assert.rejects(
            leaveService.getLeaveReport(
                { employeeId: "99" },
                {
                    id: 8,
                    email: "head@example.com",
                    firstName: "Team",
                    lastName: "Lead",
                    roleSet: new Set(["manager"]),
                }
            ),
            (error) => error.status === 403
        );
    } finally {
        db.OnboardingInfo.findAll = originalOnboardingFindAll;
        db.User.findAll = originalUserFindAll;
        db.LeaveRequest.findAll = originalRequestFindAll;
    }
});
