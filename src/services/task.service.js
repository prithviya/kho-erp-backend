const { Op } = require("sequelize");
const { sequelize, Task, TaskActivity, TaskChatMessage, ProjectOnboard, ProjectAssignment, User, Vendor } = require("../model");
const taskRepository = require("../repository/task.repository");
const notificationService = require("./notification.service");
const { emitToUser } = require("../realtime/socket");
const { normalizeRole } = require("../middleware/roleAccess.middleware");

const TASK_STATUSES = ["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"];
const TASK_PRIORITIES = ["LOW", "MEDIUM", "HIGH"];
const TASK_STATUS_LABELS = {
    TODO: "Open",
    IN_PROGRESS: "In Progress",
    REVIEW: "Review",
    COMPLETED: "Completed"
};

function httpError(message, status = 400) {
    const error = new Error(message);
    error.status = status;
    return error;
}

function formatDue(date, time) {
    if (!date) return "Not set";
    const [year, month, day] = String(date).slice(0, 10).split("-").map(Number);
    const label = new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric", timeZone: "UTC"
    });
    if (!time) return label;
    const [hour, minute] = String(time).split(":").map(Number);
    return `${label}, ${String(hour % 12 || 12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
}

function isManager(actor) {
    return Boolean(actor?.roleSet?.has(normalizeRole("manager")));
}

class TaskService {
    async getAccessibleProjectIds(actor = {}) {
        const me = Number(actor.id);
        const projects = await ProjectOnboard.findAll({
            attributes: ["id", "projectManagerIds", "spocIds", "assignedToIds", "reportingHeadId"]
        });
        const assignments = await ProjectAssignment.findAll({
            where: {
                [Op.or]: [{ assignedToId: me }, { reportingHeadId: me }]
            },
            attributes: ["projectOnboardId"]
        });
        const parseIds = (value) => {
            if (Array.isArray(value)) return value;
            if (typeof value !== "string") return value === null || value === undefined ? [] : [value];
            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed : parsed ? [parsed] : [];
            } catch {
                return value.trim() ? [value] : [];
            }
        };
        const projectIds = new Set(assignments.map((item) => Number(item.projectOnboardId)));
        projects.forEach((project) => {
            const memberIds = [
                ...parseIds(project.projectManagerIds),
                ...parseIds(project.spocIds),
                ...parseIds(project.assignedToIds),
                project.reportingHeadId
            ];
            if (memberIds.some((id) => Number(id) === me)) projectIds.add(Number(project.id));
        });

        return [...projectIds];
    }

    /**
     * Visibility rules:
     *  - super admin: every task
     *  - project members: every task in their projects
     *  - everyone else: tasks they created, report, or are assigned to
     */
    async getVisibilityWhere(actor = {}) {
        if (actor.isSuperAdmin) return {};

        const me = Number(actor.id);
        const projectIds = await this.getAccessibleProjectIds(actor);

        const visibility = [
            { reportingHeadId: me },
            { createdBy: me },
            { assignedToId: me }
        ];
        if (projectIds.length) {
            visibility.push({ projectOnboardId: { [Op.in]: projectIds } });
        }
        return { [Op.or]: visibility };
    }

    canManage(task, actor = {}) {
        if (actor.isSuperAdmin) return true;
        if (!isManager(actor)) return false;
        const me = Number(actor.id);
        return Number(task.reportingHeadId) === me || Number(task.createdBy) === me;
    }

    canEditTaskDetails(task, actor = {}) {
        return Boolean(
            actor.isSuperAdmin
            || isManager(actor)
            || Number(task.createdBy) === Number(actor.id)
        );
    }

    canChangeStatus(task, actor = {}) {
        if (this.canManage(task, actor)) return true;
        const me = Number(actor.id);
        if (Number(task.assignedToId) === me) return true;
        if (Number(task.reportingHeadId) === me || Number(task.createdBy) === me) return true;
        if (Array.isArray(task.additionalAssigneeIds) && task.additionalAssigneeIds.some((id) => Number(id) === me)) return true;

        const project = task.project || {};
        const toIds = (value) => {
            if (Array.isArray(value)) return value;
            if (typeof value !== "string") return value === null || value === undefined ? [] : [value];
            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed : parsed ? [parsed] : [];
            } catch {
                return [];
            }
        };
        return Number(project.reportingHeadId) === me
            || toIds(project.spocIds).some((id) => Number(id) === me)
            || toIds(project.projectManagerIds).some((id) => Number(id) === me);
    }

    buildFilters(filters = {}) {
        const where = {};

        if (filters.projectOnboardId) where.projectOnboardId = Number(filters.projectOnboardId);
        if (filters.assignedToId) where.assignedToId = Number(filters.assignedToId);
        if (filters.reportingHeadId) where.reportingHeadId = Number(filters.reportingHeadId);
        if (filters.status && TASK_STATUSES.includes(String(filters.status).toUpperCase())) {
            where.status = String(filters.status).toUpperCase();
        }
        if (filters.search && String(filters.search).trim()) {
            where.title = { [Op.like]: `%${String(filters.search).trim()}%` };
        }

        return where;
    }

    async listTasks(filters = {}, actor = {}) {
        const where = {
            ...this.buildFilters(filters),
            ...(await this.getVisibilityWhere(actor))
        };
        const tasks = await taskRepository.listTasks(where);
        const taskIds = tasks.map((task) => task.id);
        if (!taskIds.length) return tasks;
        const counts = await TaskChatMessage.findAll({
            attributes: ["taskId", [sequelize.fn("COUNT", sequelize.col("id")), "total"]],
            where: { taskId: { [Op.in]: taskIds } },
            group: ["taskId"],
            raw: true
        });
        const countByTask = new Map(counts.map((row) => [Number(row.taskId), Number(row.total)]));
        return tasks.map((task) => ({ ...task.toJSON(), commentsCount: countByTask.get(Number(task.id)) || 0 }));
    }

    async getTaskById(id, actor = {}) {
        const task = await taskRepository.findOneById(id);
        if (!task) throw httpError("Task not found.", 404);

        const projectIds = actor.isSuperAdmin ? [] : await this.getAccessibleProjectIds(actor);
        const visible = actor.isSuperAdmin
            || Number(task.assignedToId) === Number(actor.id)
            || Number(task.reportingHeadId) === Number(actor.id)
            || Number(task.createdBy) === Number(actor.id)
            || projectIds.includes(Number(task.projectOnboardId));
        if (!visible) throw httpError("You do not have access to this task.", 403);

        return task;
    }

    async listActivities(id, actor = {}) {
        await this.getTaskById(id, actor);
        return TaskActivity.findAll({
            where: { taskId: Number(id) },
            include: [{ model: User, as: "actor", attributes: ["id", "firstName", "lastName"] }],
            order: [["createdAt", "ASC"], ["id", "ASC"]]
        });
    }

    async validateRefs(data, { requireProject = true } = {}) {
        if (requireProject || data.projectOnboardId !== undefined) {
            const project = await ProjectOnboard.findByPk(data.projectOnboardId);
            if (!project) throw httpError("Project not found.", 404);

            if (data.serviceId) {
                let storedServiceIds = project.serviceIds;
                if (typeof storedServiceIds === "string") {
                    try {
                        storedServiceIds = JSON.parse(storedServiceIds);
                    } catch {
                        storedServiceIds = [];
                    }
                }
                const serviceIds = Array.isArray(storedServiceIds)
                    ? storedServiceIds.map((service) => Number(typeof service === "object" ? service.id ?? service.serviceId : service)).filter(Number.isFinite)
                    : [];
                if (!serviceIds.includes(Number(data.serviceId))) {
                    throw httpError("Selected service is not part of this project.");
                }
            }
        }

        if (data.assignedToId !== undefined && data.assignedToId !== null) {
            const assignee = await User.findByPk(data.assignedToId);
            if (!assignee || !assignee.isActive) throw httpError("Assignee not found or inactive.", 404);
        }
        if (data.assignedVendorId !== undefined) {
            const vendor = await Vendor.findOne({ where: { vendorId: data.assignedVendorId } });
            if (!vendor) throw httpError("Vendor not found.", 404);
        }

        if (data.reportingHeadId) {
            const head = await User.findByPk(data.reportingHeadId);
            if (!head || !head.isActive) throw httpError("Reporting head not found or inactive.", 404);
        }
    }

    normalizePayload(data = {}) {
        const payload = {};

        if (data.projectOnboardId !== undefined) payload.projectOnboardId = Number(data.projectOnboardId);
        if (data.serviceId !== undefined) payload.serviceId = data.serviceId ? Number(data.serviceId) : null;
        if (data.title !== undefined) payload.title = String(data.title).trim();
        if (data.description !== undefined) payload.description = data.description ? String(data.description).trim() : null;
        if (data.assignedToId !== undefined) payload.assignedToId = data.assignedToId === null ? null : Number(data.assignedToId);
        if (data.additionalAssigneeIds !== undefined) {
            payload.additionalAssigneeIds = [...new Set((data.additionalAssigneeIds || []).map(Number).filter((id) => Number.isInteger(id) && id > 0))];
        }
        if (data.assignedVendorId !== undefined) payload.assignedVendorId = Number(data.assignedVendorId);
        if (data.reportingHeadId !== undefined) payload.reportingHeadId = data.reportingHeadId ? Number(data.reportingHeadId) : null;
        if (data.priority !== undefined) {
            const priority = String(data.priority).toUpperCase();
            if (!TASK_PRIORITIES.includes(priority)) throw httpError("Invalid priority.");
            payload.priority = priority;
        }
        if (data.dueDate !== undefined) payload.dueDate = data.dueDate || null;
        if (data.dueTime !== undefined) payload.dueTime = data.dueTime || null;
        if (data.reminderAt !== undefined) payload.reminderAt = data.reminderAt || null;

        return payload;
    }

    async createTask(data, actor = {}) {
        const payload = this.normalizePayload(data);
        if (!payload.title) throw httpError("Task title is required.");
        if (!payload.projectOnboardId) throw httpError("Project is required.");
        if (!payload.assignedToId && !payload.assignedVendorId) throw httpError("Assignee is required.");

        const project = await ProjectOnboard.findByPk(payload.projectOnboardId);
        if (!project) throw httpError("Project not found.", 404);

        const parseIds = (value) => {
            if (Array.isArray(value)) return value;
            if (typeof value !== "string") return value === undefined || value === null ? [] : [value];
            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed : parsed ? [parsed] : [];
            } catch {
                return value.trim() ? [value] : [];
            }
        };
        const isSpoc = parseIds(project.spocIds).some((id) => Number(id) === Number(actor.id));
        if (!actor.isSuperAdmin && !isManager(actor) && !isSpoc) {
            throw httpError("Only the project SPOC can create tasks for this project.", 403);
        }

        const assignedToIds = parseIds(project.assignedToIds);
        const assignedVendorIds = parseIds(project.assignedVendorIds);
        if (payload.assignedToId && assignedToIds.length && !assignedToIds.some((id) => Number(id) === Number(payload.assignedToId))) {
            throw httpError("The selected assignee is not assigned to this project.", 403);
        }
        if (payload.additionalAssigneeIds?.length) {
            payload.additionalAssigneeIds = payload.additionalAssigneeIds.filter((id) => id !== payload.assignedToId);
            if (assignedToIds.length && payload.additionalAssigneeIds.some((id) => !assignedToIds.some((memberId) => Number(memberId) === id))) {
                throw httpError("The selected assignee is not assigned to this project.", 403);
            }
            const extraUsers = await User.findAll({ where: { id: payload.additionalAssigneeIds } });
            if (extraUsers.length !== payload.additionalAssigneeIds.length || extraUsers.some((user) => !user.isActive)) {
                throw httpError("Assignee not found or inactive.", 404);
            }
        }
        if (payload.assignedVendorId && assignedVendorIds.length && !assignedVendorIds.some((id) => Number(id) === Number(payload.assignedVendorId))) {
            throw httpError("The selected vendor is not assigned to this project.", 403);
        }

        // A manager creating a task is the reporting head by default.
        if (!payload.reportingHeadId && !actor.isSuperAdmin) {
            payload.reportingHeadId = Number(actor.id);
        }

        await this.validateRefs(payload);

        const created = await taskRepository.create({
            ...payload,
            status: "TODO",
            createdBy: actor.id || null
        });

        const saved = await taskRepository.findOneById(created.id);
        await this.recordCreationActivities(saved, actor);
        const notifications = await notificationService.createTaskNotifications({ task: saved, actor, event: "created" });
        notifications.forEach((notification) => emitToUser(notification.userId, "notification", notification.toJSON()));
        return saved;
    }

    async recordCreationActivities(task, actor = {}) {
        try {
            const actorRecord = await User.findByPk(actor.id, { attributes: ["firstName", "lastName", "email"] });
            const actorName = actorRecord
                ? `${actorRecord.firstName || ""} ${actorRecord.lastName || ""}`.trim() || actorRecord.email
                : actor.email || "Unknown user";

            const extraIds = Array.isArray(task.additionalAssigneeIds) ? task.additionalAssigneeIds : [];
            const names = [];
            if (task.assignee) names.push(`${task.assignee.firstName || ""} ${task.assignee.lastName || ""}`.trim());
            if (extraIds.length) {
                const extras = await User.findAll({ where: { id: extraIds }, attributes: ["firstName", "lastName"] });
                extras.forEach((user) => names.push(`${user.firstName || ""} ${user.lastName || ""}`.trim()));
            }
            if (!names.length && task.assignedVendorId) names.push("Vendor");

            const entries = [{ action: "TASK_CREATED", previousValue: null, newValue: task.title }];
            if (names.length) entries.push({ action: "ASSIGNED", previousValue: null, newValue: names.join(", ").slice(0, 255) });
            if (task.dueDate) entries.push({ action: "DUE_DATE_SET", previousValue: null, newValue: formatDue(task.dueDate, task.dueTime) });

            for (const entry of entries) {
                const activity = await TaskActivity.create({
                    taskId: Number(task.id),
                    actorId: actor.id || null,
                    actorName,
                    ...entry
                });
                emitTaskActivity(task, activity);
            }
        } catch (error) {
            // Activity logging must never fail task creation.
            console.error("Failed to record task creation activities:", error.message);
        }
    }

    async updateTask(id, data, actor = {}) {
        const task = await this.getTaskById(id, actor);
        const metadataFields = new Set(["dueDate", "dueTime", "priority", "reminderAt"]);
        const isMetadataOnlyUpdate = Object.keys(data).length > 0
            && Object.keys(data).every((field) => metadataFields.has(field));
        const canEditMetadata = isMetadataOnlyUpdate
            && this.canEditTaskDetails(task, actor);
        if (!canEditMetadata && !this.canManage(task, actor)) {
            throw httpError("You cannot edit this task.", 403);
        }

        const payload = this.normalizePayload(data);
        if (payload.title !== undefined && !payload.title) throw httpError("Task title is required.");

        await this.validateRefs(
            { ...payload, projectOnboardId: payload.projectOnboardId ?? task.projectOnboardId },
            { requireProject: payload.projectOnboardId !== undefined || payload.serviceId !== undefined }
        );

        const assignmentChanged = payload.assignedToId !== undefined
            && (payload.assignedToId === null
                ? task.assignedToId !== null
                : Number(payload.assignedToId) !== Number(task.assignedToId));
        const changedFields = [];
        if ((payload.dueDate !== undefined && String(payload.dueDate || "") !== String(task.dueDate || ""))
            || (payload.dueTime !== undefined && String(payload.dueTime || "") !== String(task.dueTime || ""))) {
            const nextDate = payload.dueDate !== undefined ? payload.dueDate : task.dueDate;
            const nextTime = payload.dueTime !== undefined ? payload.dueTime : task.dueTime;
            changedFields.push({
                action: "DUE_DATE_CHANGED",
                previousValue: formatDue(task.dueDate, task.dueTime),
                newValue: formatDue(nextDate, nextTime)
            });
        }
        if (payload.priority !== undefined && payload.priority !== task.priority) {
            changedFields.push({
                action: "PRIORITY_CHANGED",
                previousValue: task.priority || "Not set",
                newValue: payload.priority || "Not set"
            });
        }
        if (payload.reminderAt !== undefined
            && new Date(payload.reminderAt || 0).getTime() !== new Date(task.reminderAt || 0).getTime()) {
            changedFields.push({
                action: "REMINDER_CHANGED",
                previousValue: task.reminderAt ? new Date(task.reminderAt).toISOString() : "Not set",
                newValue: payload.reminderAt ? new Date(payload.reminderAt).toISOString() : "Not set"
            });
        }
        const removedAssigneeName = task.assignee
            ? `${task.assignee.firstName || ""} ${task.assignee.lastName || ""}`.trim()
            : "Unassigned";
        let newAssigneeName = null;
        if (assignmentChanged) {
            if (payload.assignedToId === null) {
                newAssigneeName = removedAssigneeName;
            } else {
                const assignee = await User.findByPk(payload.assignedToId, { attributes: ["firstName", "lastName"] });
                newAssigneeName = assignee
                    ? `${assignee.firstName || ""} ${assignee.lastName || ""}`.trim()
                    : "Unknown user";
            }
        }
        let actorName;
        if (assignmentChanged || changedFields.length) {
            const actorRecord = await User.findByPk(actor.id, { attributes: ["firstName", "lastName", "email"] });
            actorName = actorRecord
                ? `${actorRecord.firstName || ""} ${actorRecord.lastName || ""}`.trim() || actorRecord.email
                : actor.email || "Unknown user";
        }

        const activities = await sequelize.transaction(async (transaction) => {
            await Task.update(payload, { where: { id }, transaction });
            const createdActivities = [];
            if (assignmentChanged) {
                createdActivities.push(await TaskActivity.create({
                    taskId: Number(id),
                    actorId: actor.id || null,
                    actorName,
                    action: payload.assignedToId === null ? "ASSIGNEE_REMOVED" : "ASSIGNED",
                    previousValue: removedAssigneeName,
                    newValue: newAssigneeName
                }, { transaction }));
            }
            for (const field of changedFields) {
                createdActivities.push(await TaskActivity.create({
                    taskId: Number(id),
                    actorId: actor.id || null,
                    actorName,
                    ...field
                }, { transaction }));
            }
            return createdActivities;
        });
        const saved = await taskRepository.findOneById(id);
        activities.forEach((activity) => emitTaskActivity(saved, activity));
        const notifications = await notificationService.createTaskNotifications({ task: saved, actor, event: "updated" });
        notifications.forEach((notification) => emitToUser(notification.userId, "notification", notification.toJSON()));
        return saved;
    }

    async updateStatus(id, status, actor = {}) {
        const task = await this.getTaskById(id, actor);
        if (!this.canChangeStatus(task, actor)) {
            throw httpError("You cannot change the status of this task.", 403);
        }

        const nextStatus = String(status || "").toUpperCase();
        if (!TASK_STATUSES.includes(nextStatus)) throw httpError("Invalid status.");

        const previousStatus = String(task.status || "TODO").toUpperCase();
        if (previousStatus === nextStatus) return task;
        const actorRecord = await User.findByPk(actor.id, { attributes: ["firstName", "lastName", "email"] });
        const actorName = actorRecord
            ? `${actorRecord.firstName || ""} ${actorRecord.lastName || ""}`.trim() || actorRecord.email
            : actor.email || "Unknown user";

        const activity = await sequelize.transaction(async (transaction) => {
            await Task.update({
                status: nextStatus,
                completedAt: nextStatus === "COMPLETED" ? new Date() : null
            }, { where: { id }, transaction });
            return TaskActivity.create({
                taskId: Number(id),
                actorId: actor.id || null,
                actorName,
                action: "STATUS_CHANGED",
                previousValue: TASK_STATUS_LABELS[previousStatus] || previousStatus,
                newValue: TASK_STATUS_LABELS[nextStatus]
            }, { transaction });
        });

        const saved = await taskRepository.findOneById(id);
        emitTaskActivity(saved, activity);
        const notifications = await notificationService.createTaskNotifications({ task: saved, actor, event: "changed status for" });
        notifications.forEach((notification) => emitToUser(notification.userId, "notification", notification.toJSON()));
        return saved;
    }

    async deleteTask(id) {
        const task = await taskRepository.findOneById(id);
        if (!task) throw httpError("Task not found.", 404);
        await taskRepository.delete(id);
        return true;
    }
}

function emitTaskActivity(task, activity) {
    if (!task || !activity) return;
    const parseIds = (value) => {
        if (Array.isArray(value)) return value;
        if (typeof value !== "string") return value === undefined || value === null ? [] : [value];
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : parsed ? [parsed] : [];
        } catch {
            return value.trim() ? [value] : [];
        }
    };
    const project = task.project || {};
    const userIds = new Set([
        task.assignedToId,
        ...(Array.isArray(task.additionalAssigneeIds) ? task.additionalAssigneeIds : []),
        task.reportingHeadId,
        task.createdBy,
        activity.actorId,
        project.reportingHeadId,
        ...parseIds(project.projectManagerIds),
        ...parseIds(project.spocIds),
        ...parseIds(project.assignedToIds)
    ].map(Number).filter((id) => Number.isFinite(id) && id > 0));
    userIds.forEach((userId) => emitToUser(userId, "task-activity", {
        taskId: Number(task.id),
        activity: activity.toJSON()
    }));
}

module.exports = new TaskService();
module.exports.TASK_STATUSES = TASK_STATUSES;
module.exports.TASK_PRIORITIES = TASK_PRIORITIES;
