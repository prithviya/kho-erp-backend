const test = require('node:test');
const assert = require('node:assert/strict');

const db = require('../src/model');
const servicePath = require.resolve('../src/services/recruitment.service.js');
const repoPath = require.resolve('../src/repository/recruitment.repository.js');

const originalCandidateFindByPk = db.Candidate.findByPk;
const originalSequelizeQuery = db.sequelize.query;
const originalRepoCreate = require.cache[repoPath]?.exports?.create || null;

const repository = {
  findByCifId: async () => null,
  create: async (payload) => ({ ...payload, rid: 1 }),
};

require.cache[repoPath] = { exports: repository };

const service = (() => {
  delete require.cache[servicePath];
  return require(servicePath);
})();

test('recruitment create rejects a candidate ID that does not exist in the active candidate table', async () => {
  db.Candidate.findByPk = async () => null;
  db.sequelize.query = async () => [];

  await assert.rejects(
    () => service.create({ candidateId: 999, recruitmentStatus: 'Shortlisted' }),
    /Candidate not found for recruitment\./
  );
});

test('recruitment create uses the active Candidate table and never queries the removed legacy table', async () => {
  db.Candidate.findByPk = async (id) => (id === 15 ? {
    id,
    fullName: 'Nandhu',
    email: 'tony@gmail.com',
    phoneNumber: '9876543210',
    dob: '1995-02-01',
    currentAddress: 'Coimbatore',
    currentCity: 'Coimbatore',
    currentState: 'Tamil Nadu',
    currentPincode: '641001',
    gender: 'Male',
    maritalStatus: 'Single',
    portfolioLink: 'https://example.com',
    resumeUrl: '/assets/resume/sample.pdf',
    appliedPosition: 7,
  } : null);

  db.sequelize.query = async (sql) => {
    assert.ok(!String(sql).includes('cif_personals'), 'Legacy cif_personals table should not be queried');
    return [];
  };

  const record = await service.create({
    candidateId: 15,
    interviewDateTime: '2026-09-01T10:30:00.000Z',
    recruitmentStatus: 'Shortlisted',
  });

  assert.equal(record.cifid, 15);
  assert.equal(record.recruitmentStatus, 'Shortlisted');
  assert.equal(record.rid, 1);
});

process.on('exit', () => {
  db.Candidate.findByPk = originalCandidateFindByPk;
  db.sequelize.query = originalSequelizeQuery;
  if (originalRepoCreate) {
    require.cache[repoPath] = { exports: { create: originalRepoCreate } };
  } else {
    delete require.cache[repoPath];
  }
  delete require.cache[servicePath];
});
