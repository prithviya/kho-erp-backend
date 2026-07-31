const { Sequelize, DataTypes } = require('sequelize');
const sqlLogger = require("../helpers/sqlLogger");
require('dotenv').config();
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_TYPE,
        logging: process.env.ENABLE_SQL_LOG === "true"
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
            idle: 10000
        }
    }
);
const db = {};
db.User = require('./user.model')(sequelize, DataTypes);
db.UserRole = require('./userRole.model')(sequelize, DataTypes);
db.Role = require('./role.model')(sequelize, DataTypes);
db.Permission = require('./permission.model')(sequelize, DataTypes);
db.RolePermission = require('./rolePermission.model')(sequelize, DataTypes);
db.Module = require('./module.model')(sequelize, DataTypes);
db.RefreshToken = require("./refreshToken.model")(sequelize, DataTypes);
db.PasswordResetToken = require("./passwordResetToken.model")(sequelize, DataTypes); 
db.LeadSource = require("./leadSource.model")(sequelize, DataTypes);
db.LeadStatus = require("./leadStatus.model")(sequelize, DataTypes);
db.Lead = require("./lead.model")(sequelize, DataTypes);
db.LeadService = require("./leadService.model")(sequelize, DataTypes);
db.LeadHistory = require("./leadHistory.model")(sequelize, DataTypes);
db.ServiceCategory = require("./serviceCategory.model")(sequelize, DataTypes);
db.Service = require("./service.model")(sequelize, DataTypes);
db.ProjectOnboard = require("./projectOnboard.model")(sequelize, DataTypes);
db.ProjectAssignment = require("./projectAssignment.model")(sequelize, DataTypes);
db.Employee = require("./employee.model")(sequelize, DataTypes);
db.User.hasMany(db.PasswordResetToken, {
    foreignKey: "userId",
    as: "passwordResetTokens"
});
db.PasswordResetToken.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user"
});
db.User.hasMany(db.RefreshToken, {
    foreignKey: "userId",
    as: "refreshTokens"
});
db.RefreshToken.belongsTo(db.User, {
    foreignKey: "userId",
    as: "user"
});
db.User.belongsToMany(db.Role, {
    through: db.UserRole,
    foreignKey: "userId",
    otherKey: "roleId",
    as: "roles"
});
db.Role.belongsToMany(db.User, {
    through: db.UserRole,
    foreignKey: "roleId",
    otherKey: "userId",
    as: "users"
});
db.Role.belongsToMany(db.Permission, {
    through: db.RolePermission,
    foreignKey: "roleId",
    otherKey: "permissionId",
    as: "permissions"
});
db.Permission.belongsToMany(db.Role, {
    through: db.RolePermission,
    foreignKey: "permissionId",
    otherKey: "roleId",
    as: "roles"
});
db.Module.hasMany(db.Permission, {
    foreignKey: "moduleId"
});
db.Permission.belongsTo(db.Module, {
    foreignKey: "moduleId"
});
db.Lead.belongsTo(db.LeadSource,{
    foreignKey:"leadSourceId",
    as:"leadSource"
});
db.LeadSource.hasMany(db.Lead,{
    foreignKey:"leadSourceId",
    as:"leads"
});
db.Lead.belongsTo(db.LeadStatus,{
    foreignKey:"leadStatusId",
    as:"leadStatus"
});
db.LeadStatus.hasMany(db.Lead,{
    foreignKey:"leadStatusId",
    as:"leads"
});
db.Lead.belongsTo(db.User,{
    foreignKey:"assignedTo",
    as:"assignedUser"
});
db.User.hasMany(db.Lead,{
    foreignKey:"assignedTo",
    as:"assignedLeads"
});
db.Lead.hasMany(db.LeadHistory,{
    foreignKey:"leadId",
    as:"history"
});
db.LeadHistory.belongsTo(db.Lead,{
    foreignKey:"leadId",
    as:"lead"
});
db.LeadHistory.belongsTo(db.User,{
    foreignKey:"changedBy",
    as:"changedUser"
});
db.ServiceCategory.hasMany(db.Service,{
    foreignKey:"serviceCategoryId",
    as:"services"
});
db.Service.belongsTo(db.ServiceCategory,{
    foreignKey:"serviceCategoryId",
    as:"category"
});
db.Lead.belongsToMany(db.Service,{
    through:db.LeadService,
    foreignKey:"leadId",
    otherKey:"serviceId",
    as:"services"
});
db.Service.belongsToMany(db.Lead,{
    through:db.LeadService,
    foreignKey:"serviceId",
    otherKey:"leadId",
    as:"leads"
});
db.ProjectOnboard.belongsTo(db.Lead, {
    foreignKey: "leadId",
    as: "lead"
});
db.Lead.hasMany(db.ProjectOnboard, {
    foreignKey: "leadId",
    as: "projects"
});
db.ProjectOnboard.belongsTo(db.User, {
    foreignKey: "createdBy",
    as: "creator"
});
db.User.hasMany(db.ProjectOnboard, {
    foreignKey: "createdBy",
    as: "createdProjects"
});
db.ProjectOnboard.hasMany(db.ProjectAssignment, {
    foreignKey: "projectOnboardId",
    as: "assignments"
});
db.ProjectAssignment.belongsTo(db.ProjectOnboard, {
    foreignKey: "projectOnboardId",
    as: "project"
});
db.ProjectAssignment.belongsTo(db.User, {
    foreignKey: "assignedToId",
    as: "assignee"
});
db.User.hasMany(db.ProjectAssignment, {
    foreignKey: "assignedToId",
    as: "projectAssignments"
});
db.ProjectAssignment.belongsTo(db.User, {
    foreignKey: "reportingHeadId",
    as: "reportingHead"
});
db.ProjectAssignment.belongsTo(db.User, {
    foreignKey: "assignedBy",
    as: "assignedByUser"
});
db.Employee.belongsTo(db.User, {
    foreignKey: "createdBy",
    as: "creator"
});
db.User.hasMany(db.Employee, {
    foreignKey: "createdBy",
    as: "createdEmployees"
});
// SEQUELIZE
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;