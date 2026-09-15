const { Op } = require("sequelize");
const { ProjectOnboard, User } = require("../model");
const taskRepository = require("../repository/task.repository");
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
    /**
     * Visibility rules:
     *  - super admin: every task
     *  - manager: tasks where they are the reporting head (plus ones they
     *    created or were assigned)
     *  - everyone else: only tasks assigned to them
     */
    getVisibilityWhere(actor = {}) {
        if (actor.isSuperAdmin) return {};

        const me = Number(actor.id);
        if (isManager(actor)) {
            return {
                [Op.or]: [
                    { reportingHeadId: me },
                    { createdBy: me },
                    { assignedToId: me }
                ]
            };
        }

        return { assignedToId: me };
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
            ...this.getVisibilityWhere(actor)
        };
        return taskRepository.listTasks(where);
    }

    async getTaskById(id, actor = {}) {
        const task = await taskRepository.findOneById(id);
        if (!task) throw httpError("Task not found.", 404);

        const visible = actor.isSuperAdmin
            || Number(task.assignedToId) === Number(actor.id)
            || Number(task.reportingHeadId) === Number(actor.id)
            || Number(task.createdBy) === Number(actor.id);
        if (!visible) throw httpError("You do not have access to this task.", 403);

        return task;
    }

    async validateRefs(data, { requireProject = true } = {}) {
        if (requireProject || data.projectOnboardId !== undefined) {
            const project = await ProjectOnboard.findByPk(data.projectOnboardId);
            if (!project) throw httpError("Project not found.", 404);

            if (data.serviceId) {
                const serviceIds = Array.isArray(project.serviceIds) ? project.serviceIds.map(Number) : [];
                if (!serviceIds.includes(Number(data.serviceId))) {
                    throw httpError("Selected service is not part of this project.");
                }
            }
        }

        if (data.assignedToId !== undefined) {
            const assignee = await User.findByPk(data.assignedToId);
            if (!assignee || !assignee.isActive) throw httpError("Assignee not found or inactive.", 404);
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
        if (!payload.assignedToId) throw httpError("Assignee is required.");

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

        return taskRepository.findOneById(created.id);
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
        return taskRepository.findOneById(id);
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

        return taskRepository.findOneById(id);
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
