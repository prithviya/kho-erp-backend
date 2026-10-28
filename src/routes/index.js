const router = require("express").Router();
const requireModulePermission = require("../middleware/modulePermission.middleware");

const requireTrustedOrigin = require("../middleware/trustedOrigin.middleware");

router.use("/auth", require("./auth.routes"));
router.use("/roles", requireTrustedOrigin, require("./role.routes"));
router.use("/permissions", requireTrustedOrigin, require("./permission.routes"));

router.use("/modules", requireTrustedOrigin, require("./module.routes"));
router.use("/menus", requireTrustedOrigin, require("./menu.routes"));
router.use("/users", requireTrustedOrigin, require("./user.routes"));
router.use("/user-roles", requireTrustedOrigin, require("./userRole.routes"));

const permissionedRoutes = [
    ["/lead", (req, action) => (
        action === "view"
            ? ["lead_management.view", "reports.view"]
            : [`lead_management.${action}`]
    ), "./lead.routes"],
    ["/lead-sources", (req, action) => (
        action === "view"
            ? ["master.view", "lead_management.view", "reports.view"]
            : [`master.${action}`]
    ), "./leadSource.routes"],
    ["/lead-statuses", (req, action) => (
        action === "view"
            ? ["master.view", "lead_management.view", "reports.view"]
            : [`master.${action}`]
    ), "./leadStatus.routes"],
    ["/services", "master", "./service.routes"],
    ["/departments", (req, action) => (
        action === "view"
            ? ["master.view", "opening.view", "onboarding.view", "employee.view"]
            : [`master.${action}`]
    ), "./department.routes"],
    ["/service-categories", (req, action) => (
        action === "view"
            ? ["master.view", "lead_management.view", "vendor_management.view", "project_onboard.view", "project_details.view", "tasks.view", "assign_board.view"]
            : [`master.${action}`]
    ), "./serviceCategory.routes"],
    ["/vendor", (req, action) => (
        action === "view"
            ? ["vendor_management.view", "project_details.view", "project_onboard.view", "assign_board.view", "tasks.view"]
            : [`vendor_management.${action}`]
    ), "./vendor.routes"],
    ["/openings", "opening", "./opening.routes", [
        { method: "GET", path: /^\/public(?:\/|$)/ },
    ]],
    ["/cif-personals", "cif_form", "./cifPersonal.routes"],
    ["/cif-academics", "cif_form", "./cifAcademic.routes"],
    ["/cif-experiences", "cif_form", "./cifExperience.routes"],
    ["/cif-languages", "cif_form", "./cifLanguage.routes"],
    ["/cif-references", "cif_form", "./cifReference.routes"],
    ["/cif-skills", "cif_form", "./cifSkill.routes"],
    ["/cif-software", "cif_form", "./cifSoftware.routes"],
    ["/cif-submissions", (req, action) => {
        if (action === "view") return ["applied.view", "recruitment.view", "onboarding.view"];
        if (action === "edit") return ["applied.edit", "recruitment.edit"];
        if (action === "delete") return ["applied.delete", "recruitment.delete", "onboarding.delete"];
        return [];
    }, "./cifSubmission.routes", [
        { method: "POST", path: "/" },
    ]],
    ["/project-onboards", (req, action) => {
        if (action === "view") {
            return ["project_onboard", "project_details", "tasks", "assign_board"]
                .map((moduleCode) => `${moduleCode}.view`);
        }
        if (action === "create") return ["project_onboard.create"];
        if (action === "edit") return ["project_onboard.edit", "project_details.edit"];
        if (action === "delete") return ["project_onboard.delete", "project_details.delete"];
        return [];
    }, "./projectOnboard.routes"],
    ["/tasks", (req, action) => {
        if (action === "view") {
            return ["tasks", "task_board", "task_schedule", "assign_board"]
                .map((moduleCode) => `${moduleCode}.view`);
        }
        if (action === "create") return ["tasks.create", "assign_board.create"];
        if (action === "edit") return ["tasks.edit", "task_board.edit", "assign_board.edit"];
        if (action === "delete") return ["tasks.delete"];
        return [];
    }, "./task.routes"],
    ["/task-chat", (req, action) => (
        // Editing or deleting your own comment only needs the same access as posting one.
        ["tasks", "task_board", "task_schedule", "assign_board"]
            .map((moduleCode) => `${moduleCode}.${action === "edit" || action === "delete" ? "create" : action}`)
    ), "./taskChat.routes"],
    ["/project-chat", (req, action) => (
        ["project_details", "project_onboard"]
            .map((moduleCode) => `${moduleCode}.${action}`)
    ), "./projectChat.routes"],
    ["/notifications", (req, action) => (
        ["tasks", "task_board", "task_schedule", "assign_board", "project_details", "project_onboard"]
            .map((moduleCode) => `${moduleCode}.${action}`)
    ), "./notification.routes"],
    ["/dashboard", "dashboard", "./dashboard.routes"],
    ["/employees", (req, action) => (
        action === "view"
            ? ["employee.view", "onboarding.view", "payroll_management.view", "project_details.view", "project_onboard.view", "tasks.view", "assign_board.view"]
                        : [`employee.${action}`]
                ), "./employee.routes"],
    ["/recruitments", "recruitment", "./recruitment.routes"],
    ["/onboardings", (req, action) => (
        action === "view"
            ? ["onboarding.view", "employee.view", "payroll_management.view"]
            : [`onboarding.${action}`]
    ), "./onboarding.routes"],
    ["/leaves", "leave", "./leave.routes"],
    ["/payrolls", "payroll_management", "./payroll.routes"],
];

for (const [prefix, moduleCode, routeFile, publicRoutes = []] of permissionedRoutes) {
    const permissionMiddleware = requireModulePermission(moduleCode);
    const moduleAccessMiddleware = publicRoutes.length
        ? (req, res, next) => {
            const isPublicRoute = publicRoutes.some(({ method, path }) => (
                req.method === method
                && (typeof path === "string" ? req.path === path : path.test(req.path))
            ));
            return isPublicRoute
                ? next()
                : permissionMiddleware(req, res, next);
        }
        : permissionMiddleware;

    router.use(prefix, moduleAccessMiddleware, require(routeFile));
}

module.exports = router; 
