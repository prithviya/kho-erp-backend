const { Sequelize, DataTypes } = require("sequelize");
const sqlLogger = require("../helpers/sqlLogger");

require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_TYPE,

        logging:
            process.env.ENABLE_SQL_LOG === "true"
                ? (sql, timing) => {
                      sqlLogger.info(`[SQL] ${sql}`);
                      sqlLogger.info(`[TIME] ${timing} ms`);
                  }
                : false,

        benchmark: true,

        pool: {
            max: 20,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);

const db = {};

//  USER / AUTH MODELS

db.User = require("./user.model")(sequelize, DataTypes);
db.UserRole = require("./userRole.model")(sequelize, DataTypes);
db.Role = require("./role.model")(sequelize, DataTypes);
db.Permission = require("./permission.model")(sequelize, DataTypes);
db.RolePermission = require("./rolePermission.model")(  sequelize, DataTypes );
db.Module = require("./module.model")(sequelize, DataTypes)
db.RefreshToken = require("./refreshToken.model")( sequelize, DataTypes )
db.PasswordResetToken = require("./passwordResetToken.model")( sequelize, DataTypes );

//  LEAD MODELS
db.LeadSource = require("./leadSource.model")( sequelize, DataTypes );
db.LeadStatus = require("./leadStatus.model")( sequelize, DataTypes );

db.Lead = require("./lead.model")(sequelize, DataTypes);
db.LeadService = require("./leadService.model")( sequelize, DataTypes );
db.LeadHistory = require("./leadHistory.model")( sequelize, DataTypes );

//  SERVICE MODELS
db.ServiceCategory = require("./serviceCategory.model")( sequelize, DataTypes );
db.Service = require("./service.model")( sequelize, DataTypes );

//  MASTER
db.Department = require("./department.model")( sequelize, DataTypes );
db.Vendor = require("./vendor.model")( sequelize, DataTypes );

//  CIF MODELS
db.Candidate = require("./candidate.model")( sequelize, DataTypes );
db.CandidateAcademic = require("./candidateAcademic.model")( sequelize, DataTypes );
db.CandidateExperience = require("./candidateExperience.model")( sequelize, DataTypes );
db.CandidateLanguage = require("./candidateLanguage.model")( sequelize, DataTypes );
db.CandidateReference = require("./candidateReference.model")( sequelize, DataTypes );
db.CandidateSkill = require("./candidateSkill.model")( sequelize, DataTypes );
db.CandidateSoftware = require("./candidateSoftware.model")( sequelize, DataTypes );
db.CandidateDocument = require("./candidateDocument.model")( sequelize, DataTypes );
db.JobApplication = require("./jobApplication.model")( sequelize, DataTypes );

// Compatibility aliases for older request names
db.CifPersonal = db.Candidate;
db.CifAcademic = db.CandidateAcademic;
db.CifExperience = db.CandidateExperience;
db.CifLanguage = db.CandidateLanguage;
db.CifReference = db.CandidateReference;
db.CifSkill = db.CandidateSkill;
db.CifSoftware = db.CandidateSoftware;
db.CifSubmission = db.JobApplication;

//  ONBOARDING MODELS
db.Onboarding = require("./onboarding.model")( sequelize, DataTypes );
db.OnboardingInfo = require("./onboardinginfo.model")( sequelize, DataTypes );
db.OnboardingRecord = require("./onboardingRecord.model")( sequelize, DataTypes );
db.OnboardingEducation = require("./onboardingEducation.model")( sequelize, DataTypes );
db.OnboardingExperience = require("./onboardingExperience.model")( sequelize, DataTypes );
db.OnboardingHealth = require("./onboardingHealth.model")( sequelize, DataTypes );
db.OnboardingBank = require("./onboardingBank.model")( sequelize, DataTypes );
db.OnboardingDocument = require("./onboardingDocument.model")( sequelize, DataTypes );
db.OnboardEquipment = require("./onboardEquipment.model")( sequelize, DataTypes );
db.OnboardInduction = require("./onboardInduction.model")( sequelize, DataTypes );
db.OnboardingOffice = require("./onboardingOfficeTour")( sequelize, DataTypes );

//  RECRUITMENT
db.Recruitment = require("./recruitment.model")( sequelize, DataTypes );

//  OTHER MODELS
db.Opening = require("./opening.model")( sequelize, DataTypes );
db.ProjectOnboard = require("./projectOnboard.model")( sequelize, DataTypes );
db.ProjectAssignment = require("./projectAssignment.model")( sequelize, DataTypes );
db.Employee = require("./employee.model")( sequelize, DataTypes );
db.Payroll = require("./payroll.model")( sequelize, DataTypes );
db.LeaveCategory = require("./leaveCategory.model")( sequelize, DataTypes );
db.LeaveRequest = require("./leaveRequest.model")( sequelize, DataTypes );


//  USER / AUTH RELATIONSHIPS

// User -> Password Reset Tokens
db.User.hasMany(db.PasswordResetToken, {
    foreignKey: "userId",
    as: "passwordResetTokens",
});

db.PasswordResetToken.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
});

// User -> Refresh Tokens
db.User.hasMany(db.RefreshToken, {
    foreignKey: "userId",
    as: "refreshTokens",
});

db.RefreshToken.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user",
});

// User <-> Role
db.User.belongsToMany(db.Role, {
    through: db.UserRole,
    foreignKey: "userId",
    otherKey: "roleId",
    as: "roles",
});

db.Role.belongsToMany(db.User, {
    through: db.UserRole,
    foreignKey: "roleId",
    otherKey: "userId",
    as: "users",
});

// Role <-> Permission
db.Role.belongsToMany(db.Permission, {
    through: db.RolePermission,
    foreignKey: "roleId",
    otherKey: "permissionId",
    as: "permissions",
});

db.Permission.belongsToMany(db.Role, {
    through: db.RolePermission,
    foreignKey: "permissionId",
    otherKey: "roleId",
    as: "roles",
});

// Module -> Permissions
db.Module.hasMany(db.Permission, {
    foreignKey: "moduleId",
});

db.Permission.belongsTo(db.Module, {
    foreignKey: "moduleId",
});


//  LEAD RELATIONSHIPS

// Lead -> Lead Source
db.Lead.belongsTo(db.LeadSource, {
    foreignKey: "leadSourceId",
    as: "leadSource",
});

db.LeadSource.hasMany(db.Lead, {
    foreignKey: "leadSourceId",
    as: "leads",
});

// Lead -> Lead Status
db.Lead.belongsTo(db.LeadStatus, {
    foreignKey: "leadStatusId",
    as: "leadStatus",
});

db.LeadStatus.hasMany(db.Lead, {
    foreignKey: "leadStatusId",
    as: "leads",
});

// Lead -> Assigned User
db.Lead.belongsTo(db.User, {
    foreignKey: "assignedTo",
    as: "assignedUser",
});

db.User.hasMany(db.Lead, {
    foreignKey: "assignedTo",
    as: "assignedLeads",
});

// Lead -> Lead History
db.Lead.hasMany(db.LeadHistory, {
    foreignKey: "leadId",
    as: "history",
});

db.LeadHistory.belongsTo(db.Lead, {
    foreignKey: "leadId",
    as: "lead",
});

// Lead History -> User
db.LeadHistory.belongsTo(db.User, {
    foreignKey: "changedBy",
    as: "changedUser",
});


//  SERVICE RELATIONSHIPS

// Service Category -> Services
db.ServiceCategory.hasMany(db.Service, {
    foreignKey: "serviceCategoryId",
    as: "services",
});

db.Service.belongsTo(db.ServiceCategory, {
    foreignKey: "serviceCategoryId",
    as: "category",
});

// Lead <-> Service
db.Lead.belongsToMany(db.Service, {
    through: db.LeadService,
    foreignKey: "leadId",
    otherKey: "serviceId",
    as: "services",
});

db.Service.belongsToMany(db.Lead, {
    through: db.LeadService,
    foreignKey: "serviceId",
    otherKey: "leadId",
    as: "leads",
});

    
// | PRJECT RELATIONSHIPS
// Project Onboard -> Lead
db.ProjectOnboard.belongsTo(db.Lead, {
    foreignKey: "leadId",
    as: "lead",
});

db.Lead.hasMany(db.ProjectOnboard, {
    foreignKey: "leadId",
    as: "projects",
});

// Project Onboard -> User
db.ProjectOnboard.belongsTo(db.User, {
    foreignKey: "createdBy",
    as: "creator",
});

db.User.hasMany(db.ProjectOnboard, {
    foreignKey: "createdBy",
    as: "createdProjects",
});

// Project Onboard -> Assignments
db.ProjectOnboard.hasMany(db.ProjectAssignment, {
    foreignKey: "projectOnboardId",
    as: "assignments",
});

db.ProjectAssignment.belongsTo(db.ProjectOnboard, {
    foreignKey: "projectOnboardId",
    as: "project",
});

// Project Assignment -> Assignee
db.ProjectAssignment.belongsTo(db.User, {
    foreignKey: "assignedToId",
    as: "assignee",
});

db.User.hasMany(db.ProjectAssignment, {
    foreignKey: "assignedToId",
    as: "projectAssignments",
});

// Project Assignment -> Reporting Head
db.ProjectAssignment.belongsTo(db.User, {
    foreignKey: "reportingHeadId",
    as: "reportingHead",
});

// Project Assignment -> Assigned By
db.ProjectAssignment.belongsTo(db.User, {
    foreignKey: "assignedBy",
    as: "assignedByUser",
});


//  EMPLOYEE RELATIONSHIPS

db.Employee.belongsTo(db.User, {
    foreignKey: "createdBy",
    as: "creator",
});

db.User.hasMany(db.Employee, {
    foreignKey: "createdBy",
    as: "createdEmployees",
});

db.Employee.hasMany(db.Payroll, {
    foreignKey: "employeeId",
    as: "payrolls",
});

db.Payroll.belongsTo(db.Employee, {
    foreignKey: "employeeId",
    as: "employee",
});

db.User.hasMany(db.Payroll, {
    foreignKey: "createdBy",
    as: "createdPayrolls",
});

db.Payroll.belongsTo(db.User, {
    foreignKey: "createdBy",
    as: "creator",
});

db.LeaveCategory.hasMany(db.LeaveRequest, {
    foreignKey: "categoryId",
    as: "requests",
});

db.LeaveRequest.belongsTo(db.LeaveCategory, {
    foreignKey: "categoryId",
    as: "category",
});

db.User.hasMany(db.LeaveRequest, {
    foreignKey: "userId",
    as: "leaveRequests",
});

db.LeaveRequest.belongsTo(db.User, {
    foreignKey: "userId",
    as: "requester",
});

db.User.hasMany(db.LeaveRequest, {
    foreignKey: "approverId",
    as: "approvedLeaveRequests",
});

db.LeaveRequest.belongsTo(db.User, {
    foreignKey: "approverId",
    as: "approver",
});


db.Opening.belongsTo(db.Department, {
    foreignKey: "departmentId",
    targetKey: "id",
    as: "department",
});

db.Department.hasMany(db.Opening, {
    foreignKey: "departmentId",
    sourceKey: "id",
    as: "openings",
});

//  CIF RELATIONSHIPS

// Candidate -> Academic
db.Candidate.hasMany(db.CandidateAcademic, {
    foreignKey: "candidateId",
    sourceKey: "id",
    as: "academics",
});

db.CandidateAcademic.belongsTo(db.Candidate, {
    foreignKey: "candidateId",
    targetKey: "id",
    as: "candidate",
});

// Candidate -> Experience
db.Candidate.hasMany(db.CandidateExperience, {
    foreignKey: "candidateId",
    sourceKey: "id",
    as: "experiences",
});

db.CandidateExperience.belongsTo(db.Candidate, {
    foreignKey: "candidateId",
    targetKey: "id",
    as: "candidate",
});

// Candidate -> Language
db.Candidate.hasMany(db.CandidateLanguage, {
    foreignKey: "candidateId",
    sourceKey: "id",
    as: "languages",
});

db.CandidateLanguage.belongsTo(db.Candidate, {
    foreignKey: "candidateId",
    targetKey: "id",
    as: "candidate",
});

// Candidate -> Software
db.Candidate.hasMany(db.CandidateSoftware, {
    foreignKey: "candidateId",
    sourceKey: "id",
    as: "softwares",
});

db.CandidateSoftware.belongsTo(db.Candidate, {
    foreignKey: "candidateId",
    targetKey: "id",
    as: "candidate",
});

// Candidate -> Skills
db.Candidate.hasMany(db.CandidateSkill, {
    foreignKey: "candidateId",
    sourceKey: "id",
    as: "skills",
});

db.CandidateSkill.belongsTo(db.Candidate, {
    foreignKey: "candidateId",
    targetKey: "id",
    as: "candidate",
});

// Candidate -> References
db.Candidate.hasMany(db.CandidateReference, {
    foreignKey: "candidateId",
    sourceKey: "id",
    as: "references",
});

db.CandidateReference.belongsTo(db.Candidate, {
    foreignKey: "candidateId",
    targetKey: "id",
    as: "candidate",
});

// Candidate -> Documents
db.Candidate.hasMany(db.CandidateDocument, {
    foreignKey: "candidateId",
    sourceKey: "id",
    as: "documents",
});

db.CandidateDocument.belongsTo(db.Candidate, {
    foreignKey: "candidateId",
    targetKey: "id",
    as: "candidate",
});

// Candidate -> Job Applications
db.Candidate.hasMany(db.JobApplication, {
    foreignKey: "candidateId",
    sourceKey: "id",
    as: "jobApplications",
});

// Backward-compatibility alias for older submission queries
db.Candidate.hasMany(db.JobApplication, {
    foreignKey: "candidateId",
    sourceKey: "id",
    as: "submission",
});

db.JobApplication.belongsTo(db.Candidate, {
    foreignKey: "candidateId",
    targetKey: "id",
    as: "candidate",
});

// Candidate -> Opening
db.Candidate.belongsTo(db.Opening, {
    foreignKey: "appliedPosition",
    targetKey: "jobid",
    as: "opening",
});

db.Opening.hasMany(db.Candidate, {
    foreignKey: "appliedPosition",
    sourceKey: "jobid",
    as: "applications",
});

// Job Application -> Onboarding

db.JobApplication.hasOne(db.Onboarding, {
    foreignKey: "jobApplicationId",
    sourceKey: "id",
    as: "onboarding",
});

db.Onboarding.belongsTo(db.JobApplication, {
    foreignKey: "jobApplicationId",
    targetKey: "id",
    as: "jobApplication",
});

// Candidate -> Onboarding
db.Candidate.hasOne(db.Onboarding, {
    foreignKey: "candidateId",
    sourceKey: "id",
    as: "onboarding",
});

db.Onboarding.belongsTo(db.Candidate, {
    foreignKey: "candidateId",
    targetKey: "id",
    as: "candidate",
});

// Candidate -> Recruitment
db.Candidate.hasOne(db.Recruitment, {
    foreignKey: "cifid",
    sourceKey: "id",
    as: "recruitment",
});

db.Candidate.hasMany(db.Recruitment, {
    foreignKey: "cifid",
    sourceKey: "id",
    as: "recruitmentHistory",
});

db.Recruitment.belongsTo(db.Candidate, {
    foreignKey: "cifid",
    targetKey: "id",
    as: "candidate",
});

//  SEQUELIZE

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
