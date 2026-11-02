const test = require("node:test");
const assert = require("node:assert/strict");
const db = require("../src/model");
const employeeService = require("../src/services/employee.service");
const employeeRepository = require("../src/repository/employee.repository");

test("new employees receive the next KHO employee code", async () => {
    const originalFindAll = db.Employee.findAll;
    const originalOnboardingFindAll = db.Onboarding.findAll;
    const originalOnboardingInfoFindAll = db.OnboardingInfo.findAll;
    const originalFindByEmail = employeeRepository.findByEmail;
    const originalCreate = employeeRepository.create;

    db.Employee.findAll = async () => [
        { employeeCode: "KHO-014" },
        { employeeCode: "KHO015" },
        { employeeCode: "EMP-0001" },
    ];
    db.Onboarding.findAll = async () => [];
    db.OnboardingInfo.findAll = async () => [];
    employeeRepository.findByEmail = async () => null;
    employeeRepository.create = async (payload) => ({ toJSON: () => payload });

    try {
        const employee = await employeeService.createEmployee({
            fullName: "New Employee",
            email: "new.employee@example.com",
            phone: "1234567890",
            jobPosition: "Developer",
            consent: true,
        });

        assert.equal(employee.employeeCode, "KHO016");
    } finally {
        db.Employee.findAll = originalFindAll;
        db.Onboarding.findAll = originalOnboardingFindAll;
        db.OnboardingInfo.findAll = originalOnboardingInfoFindAll;
        employeeRepository.findByEmail = originalFindByEmail;
        employeeRepository.create = originalCreate;
    }
});

test("new employee creation retries after a concurrent employee-code collision", async () => {
    const originalFindAll = db.Employee.findAll;
    const originalOnboardingFindAll = db.Onboarding.findAll;
    const originalOnboardingInfoFindAll = db.OnboardingInfo.findAll;
    const originalFindByEmail = employeeRepository.findByEmail;
    const originalCreate = employeeRepository.create;
    let createAttempts = 0;

    db.Employee.findAll = async () => [
        { employeeCode: createAttempts ? "KHO016" : "KHO015" },
    ];
    db.Onboarding.findAll = async () => [];
    db.OnboardingInfo.findAll = async () => [];
    employeeRepository.findByEmail = async () => null;
    employeeRepository.create = async (payload) => {
        createAttempts += 1;
        if (createAttempts === 1) {
            const error = new Error("Duplicate employee code");
            error.name = "SequelizeUniqueConstraintError";
            throw error;
        }
        return { toJSON: () => payload };
    };

    try {
        const employee = await employeeService.createEmployee({
            fullName: "Concurrent Employee",
            email: "concurrent.employee@example.com",
            phone: "1234567890",
            jobPosition: "Developer",
            consent: true,
        });

        assert.equal(employee.employeeCode, "KHO017");
        assert.equal(createAttempts, 2);
    } finally {
        db.Employee.findAll = originalFindAll;
        db.Onboarding.findAll = originalOnboardingFindAll;
        db.OnboardingInfo.findAll = originalOnboardingInfoFindAll;
        employeeRepository.findByEmail = originalFindByEmail;
        employeeRepository.create = originalCreate;
    }
});
