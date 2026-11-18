const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");
const {
    GroupChat,
    GroupChatMember,
    GroupChatMessage,
    Employee,
    Role,
    User,
    sequelize,
} = require("../model");
const { emitToUser } = require("../realtime/socket");
const notificationService = require("./notification.service");
const { normalizeRole } = require("../middleware/roleAccess.middleware");

const WELCOME_MESSAGE = "Welcome! A little space for friendly chats, updates, and discussions.";
const MAX_MESSAGE_LENGTH = 5000;
const MAX_ATTACHMENTS = 5;
const uploadsRoot = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, "../../uploads"));
const userAttributes = ["id", "firstName", "lastName", "email", "profileImage", "employeeRecord"];
const senderAttributes = ["id", "firstName", "lastName", "email", "profileImage"];
const userWithRoles = {
    model: User,
    as: "user",
    attributes: userAttributes,
    include: [{
        model: Role,
        as: "roles",
        attributes: ["id", "name", "code"],
        through: { attributes: [] },
    }],
};

function fail(message, status = 400) {
    const error = new Error(message);
    error.status = status;
    throw error;
}

function parseIds(value) {
    let values = value;
    if (typeof values === "string") {
        try {
            values = JSON.parse(values);
        } catch {
            fail("Member IDs must be a JSON array.");
        }
    }
    if (values === undefined || values === null) return [];
    if (!Array.isArray(values)) fail("Member IDs must be an array.");
    const ids = values.map(Number);
    if (ids.some((id) => !Number.isInteger(id) || id < 1)) fail("Member IDs contain an invalid user ID.");
    return [...new Set(ids)];
}

function canManage(actor = {}) {
    return Boolean(actor.isSuperAdmin || actor.roleSet?.has("manager"));
}

function memberIds(group) {
    return (group.members || []).map((member) => Number(member.userId));
}

function attachmentList(value) {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
        try {
            return attachmentList(JSON.parse(value));
        } catch {
            return [];
        }
    }
    if (value && typeof value === "object") {
        const keys = Object.keys(value);
        if (!keys.length) return [];
        if (["storedName", "originalName", "name", "url"].some((key) => key in value)) return [value];
        if (Array.isArray(value.attachments)) return value.attachments;
        const items = Object.values(value);
        if (items.every((item) => item && typeof item === "object"
            && ["storedName", "originalName", "name", "url"].some((key) => key in item))) return items;
    }
    return [];
}

function userFullName(user) {
    return `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.email || "A teammate";
}

function groupJson(group) {
    const json = group.toJSON();
    json.members = (json.members || []).map((member) => ({
        ...member.user,
        addedBy: member.addedBy,
        joinedAt: member.createdAt,
    })).filter(Boolean);
    json.memberIds = json.members.map((member) => member.id);
    json.memberCount = json.memberIds.length;
    json.lastMessage = json.messages?.[0] || null;
    delete json.messages;
    return json;
}

async function addDesignations(users) {
    const plainUsers = users.map((user) => (typeof user.toJSON === "function" ? user.toJSON() : user));
    const employeeCodes = [...new Set(plainUsers.map((user) => String(user.employeeRecord || "").trim()).filter(Boolean))];
    const emails = [...new Set(plainUsers.map((user) => String(user.email || "").trim()).filter(Boolean))];
    const conditions = [];
    if (employeeCodes.length) conditions.push({ employeeCode: { [Op.in]: employeeCodes } });
    if (emails.length) conditions.push({ email: { [Op.in]: emails } });
    const employees = conditions.length
        ? await Employee.findAll({
            where: { [Op.or]: conditions },
            attributes: ["employeeCode", "email", "jobPosition"],
        })
        : [];
    const byCode = new Map(employees.map((employee) => [String(employee.employeeCode || "").trim().toLowerCase(), employee.jobPosition]));
    const byEmail = new Map(employees.map((employee) => [String(employee.email || "").trim().toLowerCase(), employee.jobPosition]));

    return plainUsers.map((user) => {
        const code = String(user.employeeRecord || "").trim().toLowerCase();
        const email = String(user.email || "").trim().toLowerCase();
        const { employeeRecord, ...publicUser } = user;
        return {
            ...publicUser,
            designation: String(user.designation || byCode.get(code) || byEmail.get(email) || "").trim() || "Designation not set",
        };
    });
}

async function serializeGroups(groups) {
    const serialized = groups.map(groupJson);
    const members = await addDesignations(serialized.flatMap((group) => group.members));
    const membersById = new Map(members.map((member) => [String(member.id), member]));
    return serialized.map((group) => ({
        ...group,
        members: group.members.map((member) => membersById.get(String(member.id)) || member),
    }));
}

class GroupChatService {
    async getGroup(groupId, actor, { includeMessages = false } = {}) {
        const includes = [{
            model: GroupChatMember,
            as: "members",
            include: [userWithRoles],
        }];
        if (includeMessages) {
            includes.push({
                model: GroupChatMessage,
                as: "messages",
                separate: true,
                limit: 1,
                order: [["createdAt", "DESC"]],
                include: [{ model: User, as: "sender", attributes: senderAttributes }],
            });
        }
        const group = await GroupChat.findByPk(Number(groupId), { include: includes });
        if (!group) fail("Group not found.", 404);
        if (!canManage(actor) && !memberIds(group).includes(Number(actor.id))) {
            fail("You are not a member of this group.", 403);
        }
        return group;
    }

    async requireAccess(groupId, actor) {
        return this.getGroup(groupId, actor);
    }

    async requireManager(actor) {
        if (!canManage(actor)) fail("Only Super Admins and Managers can manage groups.", 403);
    }

    async validateActiveUsers(ids) {
        if (!ids.length) return [];
        const users = await User.findAll({
            where: { id: { [Op.in]: ids }, isActive: true },
            attributes: userAttributes,
        });
        if (users.length !== ids.length) fail("One or more selected users are unavailable.", 400);
        return users;
    }

    async listMemberOptions(actor) {
        await this.requireManager(actor);
        const users = await User.findAll({
            where: { isActive: true },
            attributes: userAttributes,
            include: [{
                model: Role,
                as: "roles",
                attributes: ["id", "name", "code"],
                through: { attributes: [] },
            }],
            order: [["firstName", "ASC"], ["lastName", "ASC"]],
        });
        const selectableUsers = users.filter((user) => !(user.roles || []).some((role) => (
            [role.code, role.name].some((value) => normalizeRole(value) === "superadmin")
        )));
        return addDesignations(selectableUsers);
    }

    async listGroups(actor) {
        const where = {};
        if (!canManage(actor)) {
            const memberships = await GroupChatMember.findAll({
                where: { userId: Number(actor.id) },
                attributes: ["groupId"],
            });
            const groupIds = memberships.map((item) => item.groupId);
            if (!groupIds.length) return [];
            where.id = { [Op.in]: groupIds };
        }
        const groups = await GroupChat.findAll({
            where,
            include: [{
                model: GroupChatMember,
                as: "members",
                include: [userWithRoles],
            }, {
                model: GroupChatMessage,
                as: "messages",
                separate: true,
                limit: 1,
                order: [["createdAt", "DESC"]],
                include: [{ model: User, as: "sender", attributes: senderAttributes }],
            }],
            order: [["updatedAt", "DESC"]],
        });
        return serializeGroups(groups);
    }

    async createGroup(data, actor) {
        await this.requireManager(actor);
        const name = String(data.name || "").trim();
        if (!name) fail("Group name is required.");
        if (name.length > 100) fail("Group name must be 100 characters or fewer.");
        const selectedIds = parseIds(data.memberIds);
        const requestedIds = [...new Set([...selectedIds, Number(actor.id)])];
        const selectedUsers = (await this.validateActiveUsers(requestedIds))
            .filter((user) => Number(user.id) !== Number(actor.id));

        const group = await sequelize.transaction(async (transaction) => {
            const created = await GroupChat.create({
                name,
                profileImage: data.profileImage || null,
                createdBy: Number(actor.id),
            }, { transaction });
            await GroupChatMember.bulkCreate(requestedIds.map((userId) => ({
                groupId: created.id,
                userId,
                addedBy: Number(actor.id),
            })), { transaction });
            const createdAt = created.createdAt || new Date();
            await GroupChatMessage.bulkCreate([
                {
                    groupId: created.id,
                    senderId: Number(actor.id),
                    message: `${userFullName(actor)} created the group${selectedUsers.length ? ` and added ${selectedUsers.map(userFullName).join(", ")}` : ""}.`,
                    isSystem: true,
                },
                {
                    groupId: created.id,
                    senderId: null,
                    message: WELCOME_MESSAGE,
                    isSystem: true,
                    isPinned: true,
                    createdAt,
                    updatedAt: createdAt,
                },
            ], { transaction });
            return created;
        });
        const saved = await this.getGroup(group.id, actor, { includeMessages: true });
        const payload = { group: (await serializeGroups([saved]))[0] };
        requestedIds.forEach((userId) => emitToUser(userId, "group-chat-updated", payload));
        return payload.group;
    }

    async listMessages(groupId, actor) {
        await this.getGroup(groupId, actor);
        const messages = await GroupChatMessage.findAll({
            where: { groupId: Number(groupId) },
            include: [{ model: User, as: "sender", attributes: senderAttributes }],
            order: [["createdAt", "DESC"]],
            limit: 250,
        });
        return messages.reverse();
    }

    async createMessage(groupId, data, actor) {
        const group = await this.getGroup(groupId, actor);
        const attachments = Array.isArray(data.attachments) ? data.attachments : [];
        const message = String(data.message || "").trim();
        if (!message && !attachments.length) fail("Message or an attachment is required.");
        if (message.length > MAX_MESSAGE_LENGTH) fail(`Messages must be ${MAX_MESSAGE_LENGTH} characters or fewer.`);
        if (attachments.length > MAX_ATTACHMENTS) fail(`A message can have at most ${MAX_ATTACHMENTS} attachments.`);

        const members = group.members || [];
        const mentionedUsers = members
            .map((member) => member.user)
            .filter((user) => user && Number(user.id) !== Number(actor.id))
            .filter((user) => message.includes(`@${userFullName(user)}`));
        const mentionedUserIds = [...new Set(mentionedUsers.map((user) => Number(user.id)))];
        const { created, notifications } = await sequelize.transaction(async (transaction) => {
            const savedMessage = await GroupChatMessage.create({
                groupId: Number(groupId),
                senderId: Number(actor.id),
                message,
                mentionedUserIds,
                attachments,
            }, { transaction });
            await group.update({ updatedAt: new Date() }, { transaction });
            const savedNotifications = mentionedUserIds.length
                ? await notificationService.createGroupMentionNotifications({
                    userIds: mentionedUserIds,
                    groupId,
                    groupName: group.name,
                    message,
                    sender: actor,
                    transaction,
                })
                : [];
            return { created: savedMessage, notifications: savedNotifications };
        });
        const saved = await GroupChatMessage.findByPk(created.id, {
            include: [{ model: User, as: "sender", attributes: senderAttributes }],
        });
        const payload = { groupId: Number(groupId), message: saved.toJSON() };
        memberIds(group).forEach((userId) => emitToUser(userId, "group-chat-message", payload));

        if (notifications.length) {
            notifications.forEach((notification) => emitToUser(notification.userId, "group-chat-mention", {
                notification: notification.toJSON(),
                groupId: Number(groupId),
                groupName: group.name,
                senderName: userFullName(actor),
                message,
                snippet: message.slice(0, 160),
            }));
        }
        return saved;
    }

    async addMembers(groupId, values, actor) {
        await this.requireManager(actor);
        const group = await this.getGroup(groupId, actor);
        const selectedIds = parseIds(values);
        const existingIds = new Set(memberIds(group));
        const additions = selectedIds.filter((id) => !existingIds.has(id));
        if (!additions.length) return (await serializeGroups([group]))[0];
        const users = await this.validateActiveUsers(additions);
        await sequelize.transaction(async (transaction) => {
            await GroupChatMember.bulkCreate(additions.map((userId) => ({
                groupId: Number(groupId),
                userId,
                addedBy: Number(actor.id),
            })), { transaction });
            await GroupChatMessage.create({
                groupId: Number(groupId),
                senderId: Number(actor.id),
                message: `${userFullName(actor)} added ${users.map(userFullName).join(", ")} to the group.`,
                isSystem: true,
            }, { transaction });
            await GroupChat.update({ updatedAt: new Date() }, { where: { id: Number(groupId) }, transaction });
        });
        const updated = await this.getGroup(groupId, actor);
        const payload = { group: (await serializeGroups([updated]))[0] };
        [...memberIds(updated)].forEach((userId) => emitToUser(userId, "group-chat-updated", payload));
        return payload.group;
    }

    async removeMember(groupId, targetUserId, actor) {
        await this.requireManager(actor);
        const group = await this.getGroup(groupId, actor);
        const membership = await GroupChatMember.findOne({
            where: { groupId: Number(groupId), userId: Number(targetUserId) },
        });
        if (!membership) fail("That user is not a member of this group.", 404);
        const target = await User.findByPk(Number(targetUserId), {
            attributes: senderAttributes,
            include: [{
                model: Role,
                as: "roles",
                attributes: ["name", "code"],
                through: { attributes: [] },
            }],
        });
        if (!target) fail("User not found.", 404);
        const protectedMember = (target.roles || []).some((role) => (
            [role.code, role.name].some((value) => ["superadmin", "manager"].includes(normalizeRole(value)))
        ));
        if (protectedMember) fail("Super Admins and Managers cannot be removed from groups.", 403);

        await sequelize.transaction(async (transaction) => {
            await membership.destroy({ transaction });
            await GroupChatMessage.create({
                groupId: Number(groupId),
                senderId: Number(actor.id),
                message: `${userFullName(actor)} removed ${userFullName(target)} from the group.`,
                isSystem: true,
            }, { transaction });
            await GroupChat.update({ updatedAt: new Date() }, { where: { id: Number(groupId) }, transaction });
        });
        const updated = await this.getGroup(groupId, actor);
        const payload = { group: (await serializeGroups([updated]))[0] };
        memberIds(updated).forEach((userId) => emitToUser(userId, "group-chat-updated", payload));
        emitToUser(Number(targetUserId), "group-chat-removed", { groupId: Number(groupId) });
        return payload.group;
    }

    async updateProfileImage(groupId, profileImage, actor) {
        await this.requireManager(actor);
        const group = await this.getGroup(groupId, actor);
        await group.update({ profileImage });
        const updated = await this.getGroup(groupId, actor);
        const payload = { group: (await serializeGroups([updated]))[0] };
        memberIds(updated).forEach((userId) => emitToUser(userId, "group-chat-updated", payload));
        return payload.group;
    }

    async deleteGroup(groupId, actor) {
        await this.requireManager(actor);
        const group = await this.getGroup(groupId, actor);
        const recipients = memberIds(group);
        await sequelize.transaction(async (transaction) => {
            await GroupChatMessage.destroy({ where: { groupId: Number(groupId) }, transaction });
            await GroupChatMember.destroy({ where: { groupId: Number(groupId) }, transaction });
            await group.destroy({ transaction });
        });
        const assetsDirectory = path.join(uploadsRoot, "group-chat", String(Number(groupId)));
        await fs.promises.rm(assetsDirectory, { recursive: true, force: true });
        recipients.forEach((userId) => emitToUser(userId, "group-chat-deleted", { groupId: Number(groupId) }));
        return true;
    }

    async getAttachment(groupId, fileName, actor) {
        await this.getGroup(groupId, actor);
        if (path.basename(fileName) !== fileName || !/^[a-z0-9-]+\.(jpe?g|png|webp|docx?|pdf)$/i.test(fileName)) {
            fail("Attachment not found.", 404);
        }
        const messages = await GroupChatMessage.findAll({
            where: { groupId: Number(groupId) },
            attributes: ["attachments"],
        });
        const attachment = messages
            .flatMap((message) => attachmentList(message.attachments))
            .find((item) => item.storedName === fileName);
        if (!attachment) fail("Attachment not found.", 404);
        const filePath = path.resolve(uploadsRoot, "group-chat", String(Number(groupId)), fileName);
        if (!filePath.startsWith(`${path.resolve(uploadsRoot)}${path.sep}`)) fail("Attachment not found.", 404);
        return { filePath, attachment };
    }
}

module.exports = new GroupChatService();
