const { Task, TaskChatMessage, ProjectAssignment, User } = require("../model");
const notificationService = require("./notification.service");
const { emitToUser } = require("../realtime/socket");

function ids(value) {
    if (Array.isArray(value)) return value.map(Number).filter(Number.isFinite);
    if (typeof value === "string") {
        try { return ids(JSON.parse(value)); } catch { return []; }
    }
    return value === undefined || value === null ? [] : [Number(value)].filter(Number.isFinite);
}

function memberUserIds(task) {
    const project = task.project || {};
    return [...new Set([
        ...ids(project.spocIds),
        ...ids(project.projectManagerIds),
        ...ids(project.assignedToIds),
        Number(project.reportingHeadId),
        Number(task.assignedToId),
        Number(task.reportingHeadId),
        Number(task.createdBy),
        ...(project.assignments || []).flatMap((assignment) => [assignment.assignedToId, assignment.reportingHeadId])
    ].filter((id) => Number.isFinite(id) && id > 0))];
}

class TaskChatService {
    async getTask(taskId, actor) {
        const task = await Task.findByPk(Number(taskId), {
            include: [{
                association: "project",
                include: [{
                    model: ProjectAssignment,
                    as: "assignments",
                    required: false,
                    attributes: ["assignedToId", "reportingHeadId"]
                }]
            }]
        });
        if (!task) {
            const error = new Error("Task not found.");
            error.status = 404;
            throw error;
        }
        const canAccess = actor.isSuperAdmin
            || actor.roleSet?.has("manager")
            || memberUserIds(task).includes(Number(actor.id));
        if (!canAccess) {
            const error = new Error("You do not have access to this task chat.");
            error.status = 403;
            throw error;
        }
        return task;
    }

    async listMessages(taskId, actor) {
        await this.getTask(taskId, actor);
        return TaskChatMessage.findAll({
            where: { taskId: Number(taskId) },
            include: [{ model: User, as: "sender", attributes: ["id", "firstName", "lastName", "email"] }],
            order: [["createdAt", "ASC"]]
        });
    }

    async createMessage(taskId, data, actor) {
        const task = await this.getTask(taskId, actor);
        const message = String(data.message || "").trim();
        const attachments = Array.isArray(data.attachments) ? data.attachments : [];
        if (!message && !attachments.length) {
            const error = new Error("Message is required.");
            error.status = 400;
            throw error;
        }
        const allowedIds = new Set(memberUserIds(task));
        const mentionedUserIds = [...new Set((Array.isArray(data.mentionedUserIds) ? data.mentionedUserIds : [])
            .map(Number).filter((id) => allowedIds.has(id)))];
        const created = await TaskChatMessage.create({
            taskId: Number(taskId),
            senderId: Number(actor.id),
            message,
            mentionedUserIds,
            attachments
        });
        const saved = await TaskChatMessage.findByPk(created.id, {
            include: [{ model: User, as: "sender", attributes: ["id", "firstName", "lastName", "email"] }]
        });
        const payload = {
            taskId: Number(taskId),
            projectOnboardId: Number(task.projectOnboardId),
            message: saved.toJSON()
        };
        memberUserIds(task).forEach((userId) => emitToUser(userId, "task-message", payload));

        const notifications = await notificationService.createTaskMentionNotifications({
            userIds: mentionedUserIds,
            task,
            message,
            sender: actor
        });
        notifications.forEach((notification) => emitToUser(notification.userId, "notification", notification.toJSON()));
        return saved;
    }
}

module.exports = new TaskChatService();
