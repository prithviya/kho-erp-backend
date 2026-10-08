const { ProjectOnboard, ProjectChatMessage, User } = require("../model");

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
    return [
        ...ids(project.spocIds),
        ...ids(project.projectManagerIds),
        ...ids(project.assignedToIds)
    ].some((id) => id === userId);
}

class ProjectChatService {
    async getProject(projectId, actor) {
        const project = await ProjectOnboard.findByPk(projectId);
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
            ...ids(project.spocIds), ...ids(project.projectManagerIds), ...ids(project.assignedToIds)
        ]);
        const mentionedUserIds = [...new Set((Array.isArray(data.mentionedUserIds) ? data.mentionedUserIds : [])
            .map(Number).filter((id) => allowedIds.has(id)))];
        const created = await ProjectChatMessage.create({
            projectOnboardId: Number(projectId), senderId: Number(actor.id), message, mentionedUserIds
        });
        return ProjectChatMessage.findByPk(created.id, {
            include: [{ model: User, as: "sender", attributes: ["id", "firstName", "lastName", "email"] }]
        });
    }
}

module.exports = new ProjectChatService();
