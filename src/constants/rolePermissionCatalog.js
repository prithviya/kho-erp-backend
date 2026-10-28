const sections = [
    {
        name: "Main",
        code: "MAIN",
        children: [
            { name: "Dashboard", code: "DASHBOARD", route: "/dashboard", actions: ["VIEW"] },
        ],
    },
    {
        name: "CRM",
        code: "CRM",
        children: [
            { name: "Lead Management", code: "LEAD_MANAGEMENT", route: "/lead-overview" },
            { name: "Reports", code: "REPORTS", route: "/report", actions: ["VIEW"] },
        ],
    },
    {
        name: "Project",
        code: "PROJECT",
        children: [
            { name: "Project Onboard", code: "PROJECT_ONBOARD", route: "/onboard-prjt" },
            { name: "Project Details", code: "PROJECT_DETAILS", route: "/prjt-details" },
            { name: "Assign Board", code: "ASSIGN_BOARD", route: "/assign-board" },
            { name: "Tasks", code: "TASKS", route: "/tasks", hidden: true, mirrorOf: "ASSIGN_BOARD" },
            { name: "Task Board", code: "TASK_BOARD", route: "/task-board", hidden: true, mirrorOf: "ASSIGN_BOARD" },
            { name: "Task Schedule", code: "TASK_SCHEDULE", route: "/task-schedule", hidden: true, mirrorOf: "ASSIGN_BOARD" },
        ],
    },
    {
        name: "HRM",
        code: "HRM",
        children: [
            { name: "Opening", code: "OPENING", route: "/job" },
            { name: "Applied", code: "APPLIED", route: "/applied" },
            { name: "Recruitment", code: "RECRUITMENT", route: "/recruitment-process" },
            { name: "Onboarding", code: "ONBOARDING", route: "/onboarding" },
            { name: "Employee", code: "EMPLOYEE", route: "/employee" },
        ],
    },
    {
        name: "Payroll & Leave",
        code: "PAYROLL",
        children: [
            { name: "Payroll", code: "PAYROLL_MANAGEMENT", route: "/payroll" },
            { name: "Leave", code: "LEAVE", route: "/leave" },
        ],
    },
    {
        name: "System Admin",
        code: "SYSTEM_ADMIN",
        children: [
            { name: "User Management", code: "USER_MANAGEMENT", route: "/user-management" },
            { name: "Roles & Permissions", code: "ROLES_PERMISSIONS", route: "/role-permissions", superAdminOnly: true },
            { name: "Menu & Permissions", code: "MENU_PERMISSIONS", route: "/menu-management", superAdminOnly: true },
            { name: "Master", code: "MASTER", route: "/master" },
            { name: "Vendor Management", code: "VENDOR_MANAGEMENT", route: "/vendor-overview" },
            { name: "CIF Form", code: "CIF_FORM", route: "/cif-form" },
        ],
    },
];

const actions = [
    { code: "VIEW", name: "View" },
    { code: "CREATE", name: "Create" },
    { code: "EDIT", name: "Edit" },
    { code: "DELETE", name: "Delete" },
];

const permissionCatalog = sections.flatMap((section, sectionIndex) => [
    {
        name: section.name,
        code: section.code,
        route: null,
        parentCode: null,
        displayOrder: sectionIndex + 1,
        permissions: [],
    },
    ...section.children.map((module, moduleIndex) => ({
        ...module,
        parentCode: section.code,
        displayOrder: moduleIndex + 1,
        permissions: (module.superAdminOnly ? [] : actions.filter((action) => !module.actions || module.actions.includes(action.code))).map((action) => ({
            action: action.name,
            permissionKey: `${module.code.toLowerCase()}.${action.code.toLowerCase()}`,
            description: `${action.name} ${module.name}`,
        })),
    })),
]);

module.exports = permissionCatalog;
