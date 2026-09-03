const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("./src/model");
const logger = require("./src/helpers/logger");

const ROLE_SEEDS = [
    {
        code: "SUPER_ADMIN",
        name: "Super Admin",
        description: "Full system access",
    },
    {
        code: "CRM_EXECUTIVE",
        name: "CRM Executive",
        description: "Lead management for assigned users",
    },
    {
        code: "MANAGER",
        name: "Manager",
        description: "Project, task, and vendor operations",
    },
    {
        code: "HR",
        name: "HR",
        description: "Hiring, onboarding, payroll, and employee operations",
    },
    {
        code: "TEAM_MEMBER",
        name: "Team Member",
        description: "General team member role",
    },
];

const DEPARTMENT_SEEDS = [
    { name: "Operations" },
    { name: "Content" },
    { name: "Digital Marketing" },
    { name: "Web development" },
    { name: "Media" },
    { name: "Designs" },
];

const LEAD_SOURCE_SEEDS = [
    { name: "Email Campaign", code: "EMAIL_CAMPAIGN", description: "Lead generated from Email Campaign.", displayOrder: 2 },
    { name: "Whatsapp", code: "WHATSAPP", description: "", displayOrder: 1 },
    { name: "Instagram", code: "INSTA", description: "", displayOrder: 3 },
    { name: "Facebook", code: "FB", description: "", displayOrder: 4 },
    { name: "LinkedIn", code: "LINKEDIN", description: "", displayOrder: 5 },
];

const LEAD_STATUS_SEEDS = [
    { name: "On Hold", code: "ON_HOLD", color: "#9e9e9e", description: "Lead is temporarily on hold and will be revisited later.", isDefault: false, isClosed: false, displayOrder: 7 },
    { name: "New", code: "NEW", color: "#2563EB", description: "A new lead awaiting initial contact.", isDefault: true, isClosed: false, displayOrder: 1 },
    { name: "Contacted", code: "CONTACTED", color: "#eb9824", description: "Initial contact has been made with the lead.", isDefault: false, isClosed: false, displayOrder: 2 },
    { name: "Discussion", code: "DISCUSSION", color: "#eb248e", description: "", isDefault: false, isClosed: false, displayOrder: 3 },
    { name: "Proposal", code: "PROPOSAL", color: "#9124eb", description: "A quotation or proposal has been shared with the lead.", isDefault: false, isClosed: false, displayOrder: 4 },
    { name: "Negotiation", code: "NEGOTIATION", color: "#eb5524", description: "", isDefault: false, isClosed: false, displayOrder: 5 },
    { name: "Converted", code: "CONVERTED", color: "#24eb94", description: "", isDefault: false, isClosed: true, displayOrder: 6 },
];

const LEAVE_CATEGORY_SEEDS = [
    { code: "CASUAL_LEAVE", name: "Casual Leave", unit: "DAY", allocatedValue: 12 },
    { code: "LEAVE_WITHOUT_PAY", name: "Leave Without Pay", unit: "DAY", allocatedValue: 12 },
    { code: "PERMISSION", name: "Permission", unit: "HOUR", allocatedValue: 16 },
    { code: "ON_THE_DUTY", name: "On The Duty", unit: "DAY", allocatedValue: 0 },
];

const SERVICE_CATEGORY_SEEDS = [
    { name: "DM", code: "DM", color: "#2563EB", displayOrder: 1 },
    { name: "Operations", code: "OP", color: "#eb24e4", displayOrder: 3 },
    { name: "Web Development", code: "WEB", color: "#24e7eb", displayOrder: 4 },
    { name: "Content", code: "CONTENT", color: "#e9944e", displayOrder: 5 },
    { name: "Designer", code: "DESIGNER", color: "#eb4224", displayOrder: 6 },
];

const SERVICE_SEEDS = [
    { name: "Website", code: "SITE", serviceCategoryCode: "DM", displayOrder: 1 },
    { name: "SEO", code: "SEO", serviceCategoryCode: "DM", displayOrder: 2 },
    { name: "SMM", code: "SMM", serviceCategoryCode: "DM", displayOrder: 3 },
    { name: "Graphics Designer", code: "GD", serviceCategoryCode: "DESIGNER", displayOrder: 1 },
];

const LEAD_SERVICE_SEEDS = [
    { leadId: 2, serviceId: 1 },
    { leadId: 2, serviceId: 2 },
    { leadId: 3, serviceId: 1 },
    { leadId: 3, serviceId: 6 },
    { leadId: 4, serviceId: 1 },
    { leadId: 4, serviceId: 2 },
    { leadId: 4, serviceId: 7 },
    { leadId: 4, serviceId: 8 },
];

function getSeedPayload(item, extra = {}) {
    return { ...item, ...extra };
}

async function upsertByUnique(Model, item, fieldNames, extra = {}) {
    const where = [];
    for (const field of fieldNames) {
        if (item[field] !== undefined && item[field] !== null && String(item[field]).trim() !== "") {
            where.push({ [field]: item[field] });
        }
    }

    if (!where.length) {
        return { action: "skipped", record: null, reason: "No match fields" };
    }

    const existing = await Model.findOne({
        where: {
            [Op.or]: where,
        },
    });

    if (existing) {
        const payload = getSeedPayload(item, extra);
        await existing.update(payload);
        return { action: "updated", record: existing };
    }

    const created = await Model.create(getSeedPayload(item, extra));
    return { action: "created", record: created };
}

async function seedRoles() {
    for (const item of ROLE_SEEDS) {
        const result = await upsertByUnique(db.Role, item, ["code", "name"], { isActive: true });
        logger.info(`[seed] roles ${result.action}: ${item.code || item.name}`);
    }
}

async function seedDepartments() {
    for (const item of DEPARTMENT_SEEDS) {
        const result = await upsertByUnique(db.Department, item, ["name"], { isActive: true });
        logger.info(`[seed] departments ${result.action}: ${item.name}`);
    }
}

async function seedLeadSources() {
    for (const item of LEAD_SOURCE_SEEDS) {
        const result = await upsertByUnique(db.LeadSource, item, ["code", "name"], { isActive: true });
        logger.info(`[seed] lead_sources ${result.action}: ${item.code || item.name}`);
    }
}

async function seedLeadStatuses() {
    for (const item of LEAD_STATUS_SEEDS) {
        const result = await upsertByUnique(db.LeadStatus, item, ["code", "name"], { isActive: true });
        logger.info(`[seed] lead_statuses ${result.action}: ${item.code || item.name}`);
    }
}

async function seedLeaveCategories() {
    for (const item of LEAVE_CATEGORY_SEEDS) {
        const result = await upsertByUnique(db.LeaveCategory, item, ["code", "name"], { isActive: true });
        logger.info(`[seed] leave_categories ${result.action}: ${item.code || item.name}`);
    }
}

async function seedServiceCategories() {
    for (const item of SERVICE_CATEGORY_SEEDS) {
        const result = await upsertByUnique(db.ServiceCategory, item, ["code", "name"], { isActive: true });
        logger.info(`[seed] service_categories ${result.action}: ${item.code || item.name}`);
    }
}

async function seedServices() {
    for (const item of SERVICE_SEEDS) {
        const category = await db.ServiceCategory.findOne({ where: { code: item.serviceCategoryCode } });
        if (!category) {
            logger.warn(`[seed] service category not found for service ${item.code || item.name}: ${item.serviceCategoryCode}`);
            continue;
        }

        const result = await upsertByUnique(
            db.Service,
            { ...item, serviceCategoryId: category.id },
            ["code", "name"],
            { isActive: true, serviceCategoryId: category.id }
        );

        logger.info(`[seed] services ${result.action}: ${item.code || item.name}`);
    }
}

async function seedLeadServices() {
    const leadCount = await db.Lead.count();
    const serviceCount = await db.Service.count();

    if (leadCount === 0 || serviceCount === 0) {
        logger.info("[seed] no leads/services available; skipping lead service links");
        return;
    }

    for (const item of LEAD_SERVICE_SEEDS) {
        const leadExists = await db.Lead.findByPk(item.leadId);
        const serviceExists = await db.Service.findByPk(item.serviceId);

        if (!leadExists || !serviceExists) {
            logger.warn(`[seed] skipping invalid lead_service link: leadId=${item.leadId}, serviceId=${item.serviceId}`);
            continue;
        }

        const [record, created] = await db.LeadService.findOrCreate({
            where: {
                 leadId: leadExists.id,
                serviceId: serviceExists.id,
            },
            defaults: {
                leadId: leadExists.id,
                serviceId: serviceExists.id,
            },
        });

        logger.info(`[seed] lead_services ${created ? "created" : "exists"}: leadId=${leadExists.id}, serviceId=${serviceExists.id}`);
        if (record) {
            // no-op for existing rows
        }
    }
}

async function seedDefaultAdminUser() {
    const adminEmail = "admin@gmail.com";
    const adminPassword = "admin";

    try {
        const role = await db.Role.findOne({ where: { code: "SUPER_ADMIN" } });
        if (!role) {
            logger.warn("[seed] SUPER_ADMIN role not found; skipping default admin user creation");
            return;
        }

        const passwordHash = await bcrypt.hash(adminPassword, 10);
        let user = await db.User.findOne({ where: { email: adminEmail } });

        if (!user) {
            user = await db.User.create({
                firstName: "Superadmin",
                lastName: "Admin",
                email: adminEmail,
                username: "admin",
                phone: "0000000000",
                password: passwordHash,
                isActive: true,
            });
            logger.info("[seed] default admin user created: admin@gmail.com");
        } else {
            await user.update({
                firstName: "Superadmin",
                lastName: "Admin",
                username: "admin",
                phone: "0000000000",
                password: passwordHash,
                isActive: true,
            });
            logger.info("[seed] default admin user normalized: admin@gmail.com");
        }

        const alreadyAssigned = await db.UserRole.findOne({
            where: { userId: user.id, roleId: role.id },
        });

        if (!alreadyAssigned) {
            await db.UserRole.create({ userId: user.id, roleId: role.id });
            logger.info("[seed] default admin role assigned: SUPER_ADMIN");
        }
    } catch (error) {
        logger.error("[seed] default admin seeding failed");
        logger.error(error?.stack || error?.message || String(error));
    }
}

async function seedStaticData() {
    try {
        logger.info("[seed] starting static data seeding");

        await seedRoles();
        await seedDepartments();
        await seedLeadSources();
        await seedLeadStatuses();
        await seedLeaveCategories();
        await seedServiceCategories();
        await seedServices();
        await seedLeadServices();
        await seedDefaultAdminUser();

        logger.info("[seed] static data seeding completed");
        return true;
    } catch (error) {
        logger.error("[seed] static data seeding failed");
        logger.error(error?.stack || error?.message || String(error));
        return false;
    }
}

module.exports = seedStaticData;
module.exports.seedStaticData = seedStaticData;

if (require.main === module) {
    db.sequelize.authenticate()
        .then(async () => {
            await seedStaticData();
            await db.sequelize.close();
            process.exit(0);
        })
        .catch(async (error) => {
            logger.error("[seed] failed to connect to database");
            logger.error(error?.stack || error?.message || String(error));
            try { await db.sequelize.close(); } catch (_) {}
            process.exit(1);
        });
}
