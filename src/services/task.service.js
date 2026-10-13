const { Op } = require("sequelize");
const { ProjectOnboard, ProjectAssignment, User, Vendor } = require("../model");
const taskRepository = require("../repository/task.repository");
const notificationService = require("./notification.service");
const { emitToUser } = require("../realtime/socket");
const { normalizeRole } = require("../middleware/roleAccess.middleware");

const TASK_STATUSES = ["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"];
const TASK_PRIORITIES = ["LOW", "MEDIUM", "HIGH"];

function httpError(message, status = 400) {
    const error = new Error(message);
    error.status = status;
    return error;
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

    canChangeStatus(task, actor = {}) {
        if (this.canManage(task, actor)) return true;
        return Number(task.assignedToId) === Number(actor.id);
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
        return taskRepository.listTasks(where);
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

        if (data.assignedToId !== undefined) {
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
        if (data.assignedToId !== undefined) payload.assignedToId = Number(data.assignedToId);
        if (data.assignedVendorId !== undefined) payload.assignedVendorId = Number(data.assignedVendorId);
        if (data.reportingHeadId !== undefined) payload.reportingHeadId = data.reportingHeadId ? Number(data.reportingHeadId) : null;
        if (data.priority !== undefined) {
            const priority = String(data.priority).toUpperCase();
            if (!TASK_PRIORITIES.includes(priority)) throw httpError("Invalid priority.");
            payload.priority = priority;
        }
        if (data.dueDate !== undefined) payload.dueDate = data.dueDate || null;

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
        const notifications = await notificationService.createTaskNotifications({ task: saved, actor, event: "created" });
        notifications.forEach((notification) => emitToUser(notification.userId, "notification", notification.toJSON()));
        return saved;
    }

    async updateTask(id, data, actor = {}) {
        const task = await this.getTaskById(id, actor);
        if (!this.canManage(task, actor)) {
            throw httpError("Only the reporting manager or a super admin can edit this task.", 403);
        }

        const payload = this.normalizePayload(data);
        if (payload.title !== undefined && !payload.title) throw httpError("Task title is required.");

        await this.validateRefs(
            { ...payload, projectOnboardId: payload.projectOnboardId ?? task.projectOnboardId },
            { requireProject: payload.projectOnboardId !== undefined || payload.serviceId !== undefined }
        );

        await taskRepository.update(id, payload);
        const saved = await taskRepository.findOneById(id);
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

        await taskRepository.update(id, {
            status: nextStatus,
            completedAt: nextStatus === "COMPLETED" ? new Date() : null
        });

        const saved = await taskRepository.findOneById(id);
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

module.exports = new TaskService();
module.exports.TASK_STATUSES = TASK_STATUSES;
module.exports.TASK_PRIORITIES = TASK_PRIORITIES;
