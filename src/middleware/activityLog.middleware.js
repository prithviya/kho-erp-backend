const activityLogService = require("../services/activityLog.service");
const { Task } = require("../model");

const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const SKIPPED_PREFIXES = new Set(["auth", "activity-logs", "notifications"]);
const VERBS = { POST: "CREATE", PUT: "UPDATE", PATCH: "UPDATE", DELETE: "DELETE" };
const PAST = { CREATE: "Created", UPDATE: "Updated", DELETE: "Deleted" };

const MODULE_LABELS = {
    "project-library": "project library",
    "task-chat": "task chat",
    "project-chat": "project chat",
    "project-onboards": "project",
    tasks: "task",
    lead: "lead",
    "lead-sources": "lead source",
    "lead-statuses": "lead status",
    services: "service",
    departments: "department",
    "service-categories": "service category",
    vendor: "vendor",
    openings: "opening",
    employees: "employee",
    recruitments: "recruitment",
    onboardings: "onboarding",
    leaves: "leave",
    payrolls: "payroll",
    users: "user",
    roles: "role",
    permissions: "permission",
    "user-roles": "user role"
};

const numericId = (value) => (/^\d+$/.test(String(value || "")) ? Number(value) : null);
const clip = (value, max = 120) => String(value || "").trim().slice(0, max);

async function taskTitle(taskId) {
    if (!taskId) return "";
    const task = await Task.findByPk(taskId, { attributes: ["id", "title"] }).catch(() => null);
    return task?.title ? ` "${clip(task.title, 80)}"` : ` #${taskId}`;
}

async function describe(req, segments) {
    const [root, second, third, fourth] = segments;
    const verb = VERBS[req.method];
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const info = {
        module: root,
        action: verb,
        entityType: MODULE_LABELS[root] || root,
        entityId: numericId(second),
        projectId: null,
        taskId: null,
        description: null
    };

    if (root === "project-library") {
        info.module = "project_library";
        info.projectId = numericId(second);
        if (third === "folders") {
            info.entityType = "library folder";
            info.entityId = numericId(fourth);
            info.description = req.method === "POST"
                ? `Created library folder "${clip(body.name)}"`
                : req.method === "PUT"
                    ? `Renamed library folder to "${clip(body.name)}"`
                    : "Deleted a library folder";
        } else if (third === "files" && fourth === "archive") {
            info.action = "DOWNLOAD";
            info.description = `Downloaded ${Array.isArray(body.files) ? body.files.length : 0} library file(s) as ZIP`;
        } else if (third === "files" && req.method === "DELETE") {
            const count = (Array.isArray(body.ids) ? body.ids.length : 0)
                + (Array.isArray(body.chatFiles) ? body.chatFiles.length : 0);
            info.description = `Deleted ${count} file(s) from the library`;
        } else if (third === "files" && req.method === "POST") {
            const names = (req.files || []).map((file) => clip(file.originalname, 80));
            info.action = "UPLOAD";
            info.description = `Uploaded ${names.length || 1} file(s) to the library${names.length ? `: ${names.join(", ")}` : ""}`;
        }
    } else if (root === "tasks") {
        info.module = "task";
        info.taskId = numericId(second);
        info.entityType = "task";
        const title = await taskTitle(info.taskId);
        if (req.method === "POST") {
            info.projectId = numericId(body.projectOnboardId || body.projectId);
            info.description = `Created task "${clip(body.title)}"`;
        } else if (third === "status") {
            info.action = "STATUS_CHANGE";
            info.description = `Changed status of task${title} to "${clip(body.status, 40)}"`;
        } else if (req.method === "DELETE") {
            info.description = `Deleted task #${second}`;
        } else {
            info.description = `Updated task${title}`;
        }
    } else if (root === "task-chat") {
        info.module = "task_chat";
        info.taskId = numericId(second);
        info.entityType = "chat message";
        const title = await taskTitle(info.taskId);
        const files = (req.files || []).length;
        info.description = `${PAST[verb]} a chat message on task${title}${files ? ` with ${files} attachment(s)` : ""}`;
        info.action = req.method === "POST" ? "MESSAGE" : verb;
    } else if (root === "project-chat") {
        info.module = "project_chat";
        info.projectId = numericId(second);
        info.action = "MESSAGE";
        info.entityType = "chat message";
        info.description = "Posted a project chat message";
    } else if (root === "project-onboards") {
        info.module = "project";
        info.projectId = numericId(second);
        if (third === "assign") {
            info.action = "ASSIGN";
            info.description = "Updated project assignments";
        } else if (req.method === "POST") {
            info.description = `Created project "${clip(body.projectName)}"`;
        } else {
            info.description = `${PAST[verb]} the project`;
        }
    } else {
        info.module = String(root || "system").replace(/-/g, "_");
        info.description = `${PAST[verb]} ${info.entityType}${info.entityId ? ` #${info.entityId}` : ""}`;
    }

    if (!info.description) info.description = `${PAST[verb]} ${info.entityType}`;
    return info;
}

module.exports = (req, res, next) => {
    const isDownload = req.method === "GET"
        && req.query?.download === "1"
        && /^\/project-library\/\d+\/(files|chat-files)\//.test(req.path);

    if (!WRITE_METHODS.has(req.method) && !isDownload) return next();

    res.on("finish", () => {
        if (res.statusCode >= 400 || !req.user?.id) return;
        const segments = req.originalUrl.split("?")[0].replace(/^\/api\/?/, "").split("/").filter(Boolean);
        if (!segments.length || SKIPPED_PREFIXES.has(segments[0])) return;

        (async () => {
            let info;
            if (isDownload) {
                info = {
                    module: "project_library",
                    action: "DOWNLOAD",
                    entityType: "library file",
                    entityId: null,
                    projectId: numericId(segments[1]),
                    taskId: null,
                    description: "Downloaded a library file"
                };
            } else {
                info = await describe(req, segments);
            }
            const projectId = await activityLogService.resolveProjectId(info.projectId, info.taskId);
            await activityLogService.log({
                actorId: req.user.id,
                projectId,
                module: info.module,
                action: info.action,
                entityType: info.entityType,
                entityId: info.entityId,
                description: res.locals.activityDescription || info.description,
                method: req.method,
                route: req.originalUrl.split("?")[0],
                statusCode: res.statusCode,
                ipAddress: req.ip
            });
        })().catch(() => {});
    });
    next();
};
