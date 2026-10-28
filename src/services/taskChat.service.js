const { Task, TaskChatMessage, ProjectAssignment, User } = require("../model");
const notificationService = require("./notification.service");
const { emitToUser } = require("../realtime/socket");

const EDIT_WINDOW_MS = 15 * 60 * 1000;

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
        ...ids(task.additionalAssigneeIds),
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

    async getOwnMessage(taskId, messageId, actor) {
        const task = await this.getTask(taskId, actor);
        const message = await TaskChatMessage.findOne({ where: { id: Number(messageId), taskId: Number(taskId) } });
        if (!message) {
            const error = new Error("Comment not found.");
            error.status = 404;
            throw error;
        }
        if (Number(message.senderId) !== Number(actor.id)) {
            const error = new Error("You can only change your own comments.");
            error.status = 403;
            throw error;
        }
        return { task, message };
    }

    async updateMessage(taskId, messageId, data, actor) {
        const { task, message } = await this.getOwnMessage(taskId, messageId, actor);
        if (Date.now() - new Date(message.createdAt).getTime() > EDIT_WINDOW_MS) {
            const error = new Error("Comments can only be edited within 15 minutes of sending.");
            error.status = 403;
            throw error;
        }
        const text = String(data.message || "").trim();
        const removed = new Set(Array.isArray(data.removedUrls) ? data.removedUrls : []);
        const existing = Array.isArray(message.attachments) ? message.attachments : [];
        const merged = [
            ...existing.filter((item) => !removed.has(item.url)),
            ...(Array.isArray(data.newAttachments) ? data.newAttachments : [])
        ];
        if (merged.length > 5) {
            const error = new Error("A comment can have at most 5 attachments.");
            error.status = 400;
            throw error;
        }
        if (!text && !merged.length) {
            const error = new Error("Message is required.");
            error.status = 400;
            throw error;
        }
        message.message = text;
        message.attachments = merged;
        message.editedAt = new Date();
        await message.save();
        const saved = await TaskChatMessage.findByPk(message.id, {
            include: [{ model: User, as: "sender", attributes: ["id", "firstName", "lastName", "email"] }]
        });
        const payload = { taskId: Number(taskId), projectOnboardId: Number(task.projectOnboardId), message: saved.toJSON() };
        memberUserIds(task).forEach((userId) => emitToUser(userId, "task-message-updated", payload));
        return saved;
    }

    async deleteMessage(taskId, messageId, actor) {
        const { task, message } = await this.getOwnMessage(taskId, messageId, actor);
        await message.destroy();
        const payload = { taskId: Number(taskId), projectOnboardId: Number(task.projectOnboardId), messageId: Number(messageId) };
        memberUserIds(task).forEach((userId) => emitToUser(userId, "task-message-deleted", payload));
        return true;
    }
}

module.exports = new TaskChatService();
