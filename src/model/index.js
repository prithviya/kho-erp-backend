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

/*
|--------------------------------------------------------------------------
| USER / AUTH MODELS
|--------------------------------------------------------------------------
*/

db.User = require("./user.model")(sequelize, DataTypes);
db.UserRole = require("./userRole.model")(sequelize, DataTypes);
db.Role = require("./role.model")(sequelize, DataTypes);
db.Permission = require("./permission.model")(sequelize, DataTypes);
db.RolePermission = require("./rolePermission.model")(
    sequelize,
    DataTypes
);
db.Module = require("./module.model")(sequelize, DataTypes);
db.RefreshToken = require("./refreshToken.model")(
    sequelize,
    DataTypes
);
db.PasswordResetToken = require("./passwordResetToken.model")(
    sequelize,
    DataTypes
);

/*
|--------------------------------------------------------------------------
| LEAD MODELS
|--------------------------------------------------------------------------
*/

db.LeadSource = require("./leadSource.model")(
    sequelize,
    DataTypes
);

db.LeadStatus = require("./leadStatus.model")(
    sequelize,
    DataTypes
);

db.Lead = require("./lead.model")(sequelize, DataTypes);

db.LeadService = require("./leadService.model")(
    sequelize,
    DataTypes
);

db.LeadHistory = require("./leadHistory.model")(
    sequelize,
    DataTypes
);

/*
|--------------------------------------------------------------------------
| SERVICE MODELS
|--------------------------------------------------------------------------
*/

db.ServiceCategory = require("./serviceCategory.model")(
    sequelize,
    DataTypes
);

db.Service = require("./service.model")(
    sequelize,
    DataTypes
);

/*
|--------------------------------------------------------------------------
| MASTER
|--------------------------------------------------------------------------
*/

db.Department = require("./department.model")(
    sequelize,
    DataTypes
);

/*
|--------------------------------------------------------------------------
| CIF MODELS
|--------------------------------------------------------------------------
*/

db.CifPersonal = require("./cifPersonal.model")(
    sequelize,
    DataTypes
);

db.CifAcademic = require("./cifAcademic.model")(
    sequelize,
    DataTypes
);

db.CifExperience = require("./cifExperience.model")(
    sequelize,
    DataTypes
);

db.CifLanguage = require("./cifLanguage.model")(
    sequelize,
    DataTypes
);

db.CifReference = require("./cifReference.model")(
    sequelize,
    DataTypes
);

db.CifSkill = require("./cifSkill.model")(
    sequelize,
    DataTypes
);

db.CifSoftware = require("./cifSoftware.model")(
    sequelize,
    DataTypes
);

db.CifSubmission = require("./cifSubmission.model")(
    sequelize,
    DataTypes
);
/*
|--------------------------------------------------------------------------
| ONBOARDING MODELS
|--------------------------------------------------------------------------
*/

db.Onboarding = require("./onboarding.model")(
    sequelize,
    DataTypes
);

db.OnboardingInfo = require("./onboardinginfo.model")(
    sequelize,
    DataTypes
);

db.OnboardingHealth = require("./onboardingHealth.model")(
    sequelize,
    DataTypes
);

db.OnboardingBank = require("./onboardingBank.model")(
    sequelize,
    DataTypes
);

db.OnboardingDocument = require("./onboardingDocument.model")(
    sequelize,
    DataTypes
);

db.OnboardEquipment = require("./onboardEquipment.model")(
    sequelize,
    DataTypes
);

db.OnboardInduction = require("./onboardInduction.model")(
    sequelize,
    DataTypes
);

db.OnboardingOffice = require("./onboardingOfficeTour")(
    sequelize,
    DataTypes
);

/*
|--------------------------------------------------------------------------
| RECRUITMENT
|--------------------------------------------------------------------------
*/

db.Recruitment = require("./recruitment.model")(
    sequelize,
    DataTypes
);

/*
|--------------------------------------------------------------------------
| OTHER MODELS
|--------------------------------------------------------------------------
*/

db.Opening = require("./opening.model")(
    sequelize,
    DataTypes
);

db.ProjectOnboard = require("./projectOnboard.model")(
    sequelize,
    DataTypes
);

db.ProjectAssignment = require("./projectAssignment.model")(
    sequelize,
    DataTypes
);

db.Employee = require("./employee.model")(
    sequelize,
    DataTypes
);


/*
|--------------------------------------------------------------------------
| USER / AUTH RELATIONSHIPS
|--------------------------------------------------------------------------
*/

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


/*
|--------------------------------------------------------------------------
| LEAD RELATIONSHIPS
|--------------------------------------------------------------------------
*/

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


/*
|--------------------------------------------------------------------------
| SERVICE RELATIONSHIPS
|--------------------------------------------------------------------------
*/

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

    
/*
|--------------------------------------------------------------------------
| PROJECT RELATIONSHIPS
|--------------------------------------------------------------------------
*/

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


/*
|--------------------------------------------------------------------------
| EMPLOYEE RELATIONSHIPS
|--------------------------------------------------------------------------
*/

db.Employee.belongsTo(db.User, {
    foreignKey: "createdBy",
    as: "creator",
});

db.User.hasMany(db.Employee, {
    foreignKey: "createdBy",
    as: "createdEmployees",
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

/*
|--------------------------------------------------------------------------
| CIF RELATIONSHIPS
|--------------------------------------------------------------------------
*/

// Personal -> Academic
db.CifPersonal.hasMany(db.CifAcademic, {
    foreignKey: "cifid",
    sourceKey: "cifid",
    as: "academics",
});

db.CifAcademic.belongsTo(db.CifPersonal, {
    foreignKey: "cifid",
    targetKey: "cifid",
    as: "Personal",
});


// Personal -> Experience
db.CifPersonal.hasMany(db.CifExperience, {
    foreignKey: "cifid",
    sourceKey: "cifid",
    as: "experiences",
});

db.CifExperience.belongsTo(db.CifPersonal, {
    foreignKey: "cifid",
    targetKey: "cifid",
    as: "Personal",
});


// Personal -> Language
db.CifPersonal.hasMany(db.CifLanguage, {
    foreignKey: "cifid",
    sourceKey: "cifid",
    as: "languages",
});

db.CifLanguage.belongsTo(db.CifPersonal, {
    foreignKey: "cifid",
    targetKey: "cifid",
    as: "Personal",
});


// Personal -> Software
db.CifPersonal.hasMany(db.CifSoftware, {
    foreignKey: "cifid",
    sourceKey: "cifid",
    as: "softwares",
});

db.CifSoftware.belongsTo(db.CifPersonal, {
    foreignKey: "cifid",
    targetKey: "cifid",
    as: "Personal",
});


// Personal -> Skills
db.CifPersonal.hasMany(db.CifSkill, {
    foreignKey: "cifid",
    sourceKey: "cifid",
    as: "skills",
});

db.CifSkill.belongsTo(db.CifPersonal, {
    foreignKey: "cifid",
    targetKey: "cifid",
    as: "Personal",
});


// Personal -> Reference
db.CifPersonal.hasMany(db.CifReference, {
    foreignKey: "cifid",
    sourceKey: "cifid",
    as: "references",
});

db.CifReference.belongsTo(db.CifPersonal, {
    foreignKey: "cifid",
    targetKey: "cifid",
    as: "Personal",
});

// ============================================================
// CIF PERSONAL -> SUBMISSION
// ============================================================

db.CifPersonal.hasOne(db.CifSubmission, {
    foreignKey: "cifid",
    sourceKey: "cifid",
    as: "submission",
});

db.CifSubmission.belongsTo(db.CifPersonal, {
    foreignKey: "cifid",
    targetKey: "cifid",
    as: "Personal",
});

// ============================================================
// CIF PERSONAL -> OPENING
// ============================================================

db.CifPersonal.belongsTo(db.Opening, {
    foreignKey: "appliedPosition",
    targetKey: "jobid",
    as: "opening",
});

db.Opening.hasMany(db.CifPersonal, {
    foreignKey: "appliedPosition",
    sourceKey: "jobid",
    as: "applications",
});

// ============================================================
// CIF PERSONAL -> RECRUITMENT
// ============================================================

db.CifPersonal.hasOne(db.Recruitment, {
    foreignKey: "cifid",
    sourceKey: "cifid",
    as: "recruitment",
});

db.CifPersonal.hasMany(db.Recruitment, {
    foreignKey: "cifid",
    sourceKey: "cifid",
    as: "recruitmentHistory",
});

db.Recruitment.belongsTo(db.CifPersonal, {
    foreignKey: "cifid",
    targetKey: "cifid",
    as: "Personal",
});



/*
|--------------------------------------------------------------------------
| SEQUELIZE
|--------------------------------------------------------------------------
*/

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
