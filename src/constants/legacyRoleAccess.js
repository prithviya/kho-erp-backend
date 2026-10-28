// Page access that existed before permissions were stored in the database (from the original sidebar role lists).
// Used only to prefill and backfill roles that have not been configured yet.
const legacyModuleRoles = {
    LEAD_MANAGEMENT: ["crmexecutive"],
    PROJECT_DETAILS: ["manager"],
    ASSIGN_BOARD: ["manager", "crmexecutive", "hr", "ceo", "teammember"],
    OPENING: ["hr"],
    APPLIED: ["hr"],
    RECRUITMENT: ["hr"],
    ONBOARDING: ["hr"],
    EMPLOYEE: ["hr"],
    PAYROLL_MANAGEMENT: ["hr"],
    LEAVE: ["hr", "crmexecutive", "ceo", "teammember", "manager"],
    VENDOR_MANAGEMENT: ["hr"],
};

const normalizeRoleKey = (value) => String(value || "").replace(/[\s_-]+/g, "").toLowerCase();

function getLegacyModuleCodes(role) {
    const keys = [normalizeRoleKey(role?.code), normalizeRoleKey(role?.name)];
    return Object.entries(legacyModuleRoles)
        .filter(([, roles]) => roles.some((legacyRole) => keys.includes(legacyRole)))
        .map(([moduleCode]) => moduleCode);
}

module.exports = { legacyModuleRoles, getLegacyModuleCodes, normalizeRoleKey };
