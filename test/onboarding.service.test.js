const test = require('node:test');
const assert = require('node:assert/strict');

const db = require('../src/model');
const servicePath = require.resolve('../src/services/onboarding.service.js');

const original = {
  CifAcademicCreate: db.CifAcademic.create,
  CifExperienceCreate: db.CifExperience.create,
  CifAcademicFindOne: db.CifAcademic.findOne,
  CifExperienceFindOne: db.CifExperience.findOne,
  DepartmentFindOne: db.Department.findOne,
  OnboardingFindOne: db.Onboarding.findOne,
  OnboardingInfoCreate: db.OnboardingInfo.create,
  OnboardingInfoFindByPk: db.OnboardingInfo.findByPk,
};

const service = (() => {
  delete require.cache[servicePath];
  return require(servicePath);
})();

test('persistLinkedOnboardingSections creates valid fallback rows when candidate history is missing', async () => {
  const fakePersonal = { city: 'Coimbatore', fullName: 'Nandhu' };
  const createdAcademic = [];
  const createdExperience = [];
  const createdOnboardingInfo = [];

  db.CifAcademic.findOne = async () => null;
  db.CifExperience.findOne = async () => null;
  db.Department.findOne = async () => ({ id: 7 });
  db.Onboarding.findOne = async () => null;
  db.OnboardingInfo.findByPk = async () => null;
  db.OnboardingInfo.create = async (payload) => {
    createdOnboardingInfo.push(payload);
    return { ...payload, onboardinginfoid: 999 };
  };
  db.CifAcademic.create = async (payload) => {
    createdAcademic.push(payload);
    return { ...payload, academicid: 101, id: 101 };
  };
  db.CifExperience.create = async (payload) => {
    createdExperience.push(payload);
    return { ...payload, eid: 202, id: 202 };
  };

  service.upsertSectionRecord = async (_model, _where, payload) => ({ ...payload });
  service.onboardingDocumentSupportsFileUrl = async () => false;
  service.getOnboardingDocumentRows = async () => [];
  db.OnboardingDocument.create = async () => ({});

  await service.persistLinkedOnboardingSections(
    15,
    {
      education: [{ qualification: 'BAS', institution: 'asd', board: 'asd', year: '2020', percentage: '90' }],
      experience: [{ company: 'nandhu', designation: 'General team member role', startDate: '2026-01-01', totalExp: '1' }],
      currentAddress: { city: 'CBE' },
      health: {},
      bankDetails: {},
      officeTour: {},
      induction: {},
      kit: {},
      documents: [],
    },
    fakePersonal,
    { LOCK: { UPDATE: 'UPDATE' } }
  );

  assert.equal(createdAcademic.length, 1);
  assert.equal(createdExperience.length, 1);
  assert.equal(createdAcademic[0].candidateId, 15);
  assert.equal(createdAcademic[0].institution, 'asd');
  assert.equal(createdExperience[0].candidateId, 15);
  assert.equal(createdExperience[0].companyName, 'nandhu');
  assert.equal(createdOnboardingInfo[0].eid, 202);
  assert.equal(createdOnboardingInfo[0].academicid, 101);
});

test('persistLinkedOnboardingSections keeps existing academic and experience ids when records already exist', async () => {
  const fakePersonal = { city: 'Coimbatore', fullName: 'Nandhu' };
  const createdOnboardingInfo = [];

  db.CifAcademic.findOne = async () => ({ academicid: 10, cifid: 15 });
  db.CifExperience.findOne = async () => ({ eid: 20, cifid: 15 });
  db.Department.findOne = async () => ({ id: 7 });
  db.Onboarding.findOne = async () => null;
  db.OnboardingInfo.findByPk = async () => null;
  db.OnboardingInfo.create = async (payload) => {
    createdOnboardingInfo.push(payload);
    return { ...payload, onboardinginfoid: 1001 };
  };
  db.CifAcademic.create = async () => { throw new Error('Academic create should not run'); };
  db.CifExperience.create = async () => { throw new Error('Experience create should not run'); };

  service.upsertSectionRecord = async (_model, _where, payload) => ({ ...payload });
  service.onboardingDocumentSupportsFileUrl = async () => false;
  service.getOnboardingDocumentRows = async () => [];
  db.OnboardingDocument.create = async () => ({});

  await service.persistLinkedOnboardingSections(
    15,
    {
      education: [{ qualification: 'BAS', institution: 'ABC College', year: '2020', percentage: '90' }],
      experience: [{ company: 'Tech Co', designation: 'Developer', startDate: '2025-01-01', totalExp: '1' }],
      currentAddress: { city: 'CBE' },
      health: {},
      bankDetails: {},
      officeTour: {},
      induction: {},
      kit: {},
      documents: [],
    },
    fakePersonal,
    { LOCK: { UPDATE: 'UPDATE' } }
  );

  assert.equal(createdOnboardingInfo.length, 1);
  assert.equal(createdOnboardingInfo[0].eid, 20);
  assert.equal(createdOnboardingInfo[0].academicid, 10);
});

test('isEmployeeIdDuplicate returns false when the duplicate employee belongs to the same candidate email', async () => {
  const duplicateEmployee = {
    employeeCode: 'KHO-003',
    email: 'nandhu@example.com',
  };
  const duplicateOnboarding = {
    cifid: 15,
    employeeId: 'KHO-003',
  };

  const result = service.isEmployeeIdDuplicate({
    candidateEmployeeId: 'KHO-003',
    currentOfficialEmail: 'nandhu@example.com',
    cifid: 15,
    duplicateEmployee,
    duplicateOnboarding,
  });

  assert.equal(result, false);
});

test('validateFinalFormData ignores UI-optional fields like officePhone, UAN, and icebreaker data', () => {
  const formData = {
    fullName: 'Nandhu',
    employeeId: 'KHO-003',
    personalEmail: 'nandhu@example.com',
    personalPhone: '9876543210',
    officialEmail: 'nandhu@company.com',
    gender: 'Male',
    maritalStatus: 'Single',
    dateOfBirth: '2008-09-01',
    dateOfJoining: '2026-09-11',
    employeeType: 'Permanent',
    erpRole: 'TEAM_MEMBER',
    sourceOfHire: 'Naukri',
    department: 'Designs',
    designation: 'Graphics Designer',
    reportingHead: 'nandhu',
    panNumber: 'ABCDE1234F',
    currentSalary: '963521',
    currentAddress: { line1: 'CBE', city: 'CBE', state: 'CBE', pincode: '666666' },
    permanentAddress: { line1: 'CBE', city: 'CBE', state: 'CBE', pincode: '666666' },
    education: [{ qualification: 'BAS', institution: 'asd', board: 'asd', year: '2020', percentage: '90' }],
    experience: [{ company: 'nandhu', designation: 'General team member role', startDate: '2026-01-01', totalExp: '1' }],
    icebreaker: {},
  };

  assert.doesNotThrow(() => service.validateFinalFormData(formData));
});

test('ensureEmployeeUserRecord creates a user with a random password for the mapped ERP role', async () => {
  const createdUsers = [];
  const createdLinks = [];

  const originalUserFindOne = db.User.findOne;
  const originalUserCreate = db.User.create;
  const originalRoleFindOne = db.Role.findOne;
  const originalUserRoleCreate = db.UserRole.create;

  db.User.findOne = async () => null;
  db.User.create = async (payload) => {
    createdUsers.push(payload);
    return { id: 77, ...payload };
  };
  db.Role.findOne = async () => ({ id: 9, code: 'MANAGER', name: 'Manager' });
  db.UserRole.create = async (payload) => {
    createdLinks.push(payload);
    return payload;
  };

  try {
    const result = await service.ensureEmployeeUserRecord({
      email: 'manager@example.com',
      fullName: 'Manager User',
      employeeCode: 'KHO-025',
      erpRole: 'Manager',
      transaction: {},
    });

    assert.equal(result.user.id, 77);
    assert.equal(createdUsers.length, 1);
    assert.equal(createdUsers[0].email, 'manager@example.com');
    assert.equal(createdUsers[0].employeeRecord, 'KHO-025');
    assert.equal(createdUsers[0].username, 'manager');
    assert.equal(createdLinks[0].roleId, 9);
    assert.notEqual(createdUsers[0].password, '');
    assert.match(createdUsers[0].password, /^\$2[aby]\$/);
  } finally {
    db.User.findOne = originalUserFindOne;
    db.User.create = originalUserCreate;
    db.Role.findOne = originalRoleFindOne;
    db.UserRole.create = originalUserRoleCreate;
  }
});

process.on('exit', () => {
  db.CifAcademic.create = original.CifAcademicCreate;
  db.CifExperience.create = original.CifExperienceCreate;
  db.CifAcademic.findOne = original.CifAcademicFindOne;
  db.CifExperience.findOne = original.CifExperienceFindOne;
  db.Department.findOne = original.DepartmentFindOne;
  db.Onboarding.findOne = original.OnboardingFindOne;
  db.OnboardingInfo.create = original.OnboardingInfoCreate;
  db.OnboardingInfo.findByPk = original.OnboardingInfoFindByPk;
  delete require.cache[servicePath];
});
