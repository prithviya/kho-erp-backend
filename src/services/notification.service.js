const { Notification, ProjectOnboard, ProjectAssignment, Service, ServiceCategory } = require("../model");

function ids(value) {
    if (Array.isArray(value)) return value.map(Number).filter(Number.isFinite);
    if (typeof value === "string") {
        try { return ids(JSON.parse(value)); } catch { return []; }
    }
    return value === undefined || value === null ? [] : [Number(value)].filter(Number.isFinite);
}

class NotificationService {
    async listForUser(userId) {
        return Notification.findAll({
            where: { userId: Number(userId) },
            order: [["createdAt", "DESC"]],
            limit: 50
        });
    }

    async unreadCount(userId) {
        return Notification.count({ where: { userId: Number(userId), readAt: null } });
    }

    async markRead(id, userId) {
        await Notification.update(
            { readAt: new Date() },
            { where: { id: Number(id), userId: Number(userId), readAt: null } }
        );
    }

    async markAllRead(userId) {
        await Notification.update(
            { readAt: new Date() },
            { where: { userId: Number(userId), readAt: null } }
        );
    }

    async createMentionNotifications({ userIds, projectOnboardId, message, sender }) {
        const uniqueIds = [...new Set(userIds.map(Number).filter((id) => id && id !== Number(sender.id)))];
        if (!uniqueIds.length) return [];

        return Notification.bulkCreate(uniqueIds.map((userId) => ({
            userId,
            type: "PROJECT_MENTION",
            projectOnboardId: Number(projectOnboardId),
            message: `${sender.firstName || "A teammate"} mentioned you in project chat.`,
            metadata: { projectOnboardId: Number(projectOnboardId), message }
        })));
    }

    async createTaskNotifications({ task, actor, event = "updated" }) {
        const project = await ProjectOnboard.findByPk(task.projectOnboardId, {
            include: [{
                model: ProjectAssignment,
                as: "assignments",
                required: false,
                attributes: ["assignedToId", "reportingHeadId"]
            }]
        });
        if (!project) return [];

        const service = task.serviceId
            ? await Service.findByPk(task.serviceId, {
                include: [{ model: ServiceCategory, as: "category", attributes: ["id", "name"] }]
            })
            : null;
        const recipients = [...new Set([
            ...ids(project.spocIds),
            ...ids(project.projectManagerIds),
            ...ids(project.assignedToIds),
            Number(project.reportingHeadId),
            ...(project.assignments || []).flatMap((assignment) => [assignment.assignedToId, assignment.reportingHeadId])
        ].filter((id) => Number.isFinite(id) && id > 0 && Number(id) !== Number(actor.id)))];
        if (!recipients.length) return [];

        const metadata = {
            taskId: Number(task.id),
            projectOnboardId: Number(task.projectOnboardId),
            category: service?.category?.name || "Uncategorized",
            taskName: task.title,
            deadline: task.dueDate || null,
            status: task.status
        };
        const notifications = await Notification.bulkCreate(recipients.map((userId) => ({
            userId,
            type: `TASK_${String(event).toUpperCase()}`,
            projectOnboardId: Number(task.projectOnboardId),
            message: `${actor.firstName || "A teammate"} ${event} task "${task.title}".`,
            metadata
        })));
        return notifications;
    }

    async createTaskMentionNotifications({ userIds, task, message, sender }) {
        const uniqueIds = [...new Set(userIds.map(Number).filter((id) => id && id !== Number(sender.id)))];
        if (!uniqueIds.length) return [];

        const service = task.serviceId
            ? await Service.findByPk(task.serviceId, {
                include: [{ model: ServiceCategory, as: "category", attributes: ["id", "name"] }]
            })
            : null;
        const metadata = {
            taskId: Number(task.id),
            projectOnboardId: Number(task.projectOnboardId),
            category: service?.category?.name || "Uncategorized",
            taskName: task.title,
            deadline: task.dueDate || null,
            message
        };
        return Notification.bulkCreate(uniqueIds.map((userId) => ({
            userId,
            type: "TASK_MENTION",
            projectOnboardId: Number(task.projectOnboardId),
            message: `${sender.firstName || "A teammate"} mentioned you in task chat.`,
            metadata
        })));
    }
}

module.exports = new NotificationService();
