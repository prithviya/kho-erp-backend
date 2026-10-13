const { ProjectOnboard, ProjectChatMessage, ProjectAssignment, User } = require("../model");
const notificationService = require("./notification.service");
const { emitToUser } = require("../realtime/socket");

function ids(value) {
    if (Array.isArray(value)) return value.map(Number).filter(Number.isFinite);
    if (typeof value === "string") {
        try { return ids(JSON.parse(value)); } catch { return []; }
    }
    return value === undefined || value === null ? [] : [Number(value)].filter(Number.isFinite);
}

function canAccess(project, actor = {}) {
    if (actor.isSuperAdmin || actor.roleSet?.has("manager")) return true;
    const userId = Number(actor.id);
    return memberUserIds(project).some((id) => id === userId);
}

function memberUserIds(project) {
    return [...new Set([
        ...ids(project.spocIds),
        ...ids(project.projectManagerIds),
        ...ids(project.assignedToIds),
        Number(project.reportingHeadId),
        ...(project.assignments || []).flatMap((assignment) => [assignment.assignedToId, assignment.reportingHeadId])
    ].filter((id) => Number.isFinite(id) && id > 0))];
}

class ProjectChatService {
    async getProject(projectId, actor) {
        const project = await ProjectOnboard.findByPk(projectId, {
            include: [{
                model: ProjectAssignment,
                as: "assignments",
                required: false,
                attributes: ["assignedToId", "reportingHeadId"]
            }]
        });
        if (!project) { const error = new Error("Project not found."); error.status = 404; throw error; }
        if (!canAccess(project, actor)) { const error = new Error("You do not have access to this project chat."); error.status = 403; throw error; }
        return project;
    }

    async listMessages(projectId, actor) {
        await this.getProject(projectId, actor);
        return ProjectChatMessage.findAll({
            where: { projectOnboardId: Number(projectId) },
            include: [{ model: User, as: "sender", attributes: ["id", "firstName", "lastName", "email"] }],
            order: [["createdAt", "ASC"]]
        });
    }

    async createMessage(projectId, data, actor) {
        const project = await this.getProject(projectId, actor);
        const message = String(data.message || "").trim();
        if (!message) { const error = new Error("Message is required."); error.status = 400; throw error; }
        const allowedIds = new Set([
            ...memberUserIds(project)
        ]);
        const mentionedUserIds = [...new Set((Array.isArray(data.mentionedUserIds) ? data.mentionedUserIds : [])
            .map(Number).filter((id) => allowedIds.has(id)))];
        const created = await ProjectChatMessage.create({
            projectOnboardId: Number(projectId), senderId: Number(actor.id), message, mentionedUserIds
        });
        const saved = await ProjectChatMessage.findByPk(created.id, {
            include: [{ model: User, as: "sender", attributes: ["id", "firstName", "lastName", "email"] }]
        });

        const payload = { projectId: Number(projectId), message: saved.toJSON() };
        memberUserIds(project).forEach((userId) => emitToUser(userId, "project-message", payload));

        const notifications = await notificationService.createMentionNotifications({
            userIds: mentionedUserIds,
            projectOnboardId: projectId,
            message,
            sender: actor
        });
        notifications.forEach((notification) => emitToUser(notification.userId, "notification", notification.toJSON()));

        return saved;
    }
}

module.exports = new ProjectChatService();
