/* eslint-disable no-console */
require("dotenv").config();

const db = require("../src/model");

const CANONICAL_ROLES = [
    {
        code: "SUPER_ADMIN",
        name: "Super Admin",
        description: "Full system access",
        aliases: ["superadmin", "super_admin", "super admin"],
    },
    {
        code: "CRM_EXECUTIVE",
        name: "CRM Executive",
        description: "Lead management for assigned users",
        aliases: ["crmexecutive", "crm_executive", "crm executive"],
    },
    {
        code: "MANAGER",
        name: "Manager",
        description: "Project, task, and vendor operations",
        aliases: ["manager"],
    },
    {
        code: "HR",
        name: "HR",
        description: "Hiring, onboarding, payroll, and employee operations",
        aliases: ["hr"],
    },
    {
        code: "TEAM_MEMBER",
        name: "Team Member",
        description: "General team member role",
        aliases: ["teammember", "team_member", "team member"],
    }
];

function normalizeRole(value = "") {
    return String(value)
        .trim()
        .toLowerCase()
        .replace(/[\s_-]+/g, "");
}

async function upsertCanonicalRole(roleDef) {
    const allRoles = await db.Role.findAll({ paranoid: false });

    const exact = allRoles.find((role) => role.code === roleDef.code);
    if (exact) {
        await exact.update({
            name: roleDef.name,
            description: roleDef.description,
            isActive: true,
        });
        return { action: "updated", role: exact };
    }

    const matchedAlias = allRoles.find((role) => {
        const code = normalizeRole(role.code);
        const name = normalizeRole(role.name);
        return roleDef.aliases.includes(code) || roleDef.aliases.includes(name);
    });

    if (matchedAlias) {
        await matchedAlias.update({
            code: roleDef.code,
            name: roleDef.name,
            description: roleDef.description,
            isActive: true,
            deletedAt: null,
        });
        return { action: "normalized", role: matchedAlias };
    }

    const created = await db.Role.create({
        code: roleDef.code,
        name: roleDef.name,
        description: roleDef.description,
        isActive: true,
    });
    return { action: "created", role: created };
}

async function run() {
    try {
        await db.sequelize.authenticate();

        console.log("[seedCanonicalRoles] connected");
        for (const roleDef of CANONICAL_ROLES) {
            const result = await upsertCanonicalRole(roleDef);
            console.log(
                `[seedCanonicalRoles] ${result.action}: ${result.role.code} (${result.role.name})`
            );
        }

        console.log("[seedCanonicalRoles] completed");
        await db.sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error("[seedCanonicalRoles] failed", error);
        try {
            await db.sequelize.close();
        } catch (_closeError) {
            // ignore close failures
        }
        process.exit(1);
    }
}

run();
