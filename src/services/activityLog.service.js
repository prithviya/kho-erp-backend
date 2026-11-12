const { Op, fn, col, where, literal } = require("sequelize");
const { ActivityLog, ProjectOnboard, Task, User } = require("../model");
const logger = require("../helpers/logger");

const DISPLAY_OFFSET = process.env.ACTIVITY_LOG_TZ_OFFSET || "+05:30";
const RETENTION_MONTHS = Number(process.env.ACTIVITY_LOG_RETENTION_MONTHS || 6);
const EXPORT_LIMIT = 50000;

function offsetMinutes() {
    const match = /^([+-])(\d{2}):(\d{2})$/.exec(DISPLAY_OFFSET);
    if (!match) return 330;
    return (match[1] === "-" ? -1 : 1) * (Number(match[2]) * 60 + Number(match[3]));
}

function formatLocal(date) {
    const shifted = new Date(new Date(date).getTime() + offsetMinutes() * 60000);
    const iso = shifted.toISOString();
    return { date: iso.slice(0, 10), time: iso.slice(11, 19) };
}

function userDisplayName(user) {
    if (!user) return "System";
    const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
    return name || user.email || `User ${user.id}`;
}

class ActivityLogService {
    // Never throws: logging must not break the action being logged.
    async log(entry) {
        try {
            let { actorName, projectName } = entry;
            if (!actorName && entry.actorId) {
                const user = await User.findByPk(entry.actorId, { attributes: ["id", "firstName", "lastName", "email"] });
                actorName = userDisplayName(user);
            }
            if (!projectName && entry.projectId) {
                const project = await ProjectOnboard.findByPk(entry.projectId, { attributes: ["id", "projectName"] });
                projectName = project?.projectName || null;
            }
            await ActivityLog.create({
                actorId: entry.actorId || null,
                actorName: String(actorName || "System").slice(0, 255),
                projectId: entry.projectId || null,
                projectName: projectName ? String(projectName).slice(0, 255) : null,
                module: String(entry.module || "system").slice(0, 64),
                action: String(entry.action || "ACTION").slice(0, 32),
                entityType: entry.entityType ? String(entry.entityType).slice(0, 64) : null,
                entityId: entry.entityId != null ? String(entry.entityId).slice(0, 64) : null,
                description: String(entry.description || entry.action || "Activity").slice(0, 500),
                method: entry.method || null,
                route: entry.route ? String(entry.route).slice(0, 255) : null,
                statusCode: entry.statusCode || null,
                ipAddress: entry.ipAddress ? String(entry.ipAddress).slice(0, 64) : null,
                metadata: entry.metadata || null
            });
        } catch (error) {
            logger.error(`Activity log write failed: ${error.message}`);
        }
    }

    async resolveProjectId(projectId, taskId) {
        if (projectId) return Number(projectId) || null;
        if (taskId) {
            const task = await Task.findByPk(Number(taskId), { attributes: ["id", "projectOnboardId"] });
            return task?.projectOnboardId || null;
        }
        return null;
    }

    buildWhere(query = {}) {
        const clauses = [];
        const localTs = literal(`CONVERT_TZ(\`ActivityLog\`.\`createdAt\`, '+00:00', '${DISPLAY_OFFSET}')`);

        if (query.projectId) clauses.push({ projectId: Number(query.projectId) });
        if (query.employeeId) clauses.push({ actorId: Number(query.employeeId) });
        if (query.module) clauses.push({ module: String(query.module) });
        if (query.action) clauses.push({ action: String(query.action).toUpperCase() });

        const dateOk = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value || ""));
        const timeOk = (value) => /^\d{2}:\d{2}(:\d{2})?$/.test(String(value || ""));
        const fromDate = dateOk(query.fromDate) ? query.fromDate : null;
        const toDate = dateOk(query.toDate) ? query.toDate : null;
        if (fromDate) clauses.push(where(fn("DATE", localTs), { [Op.gte]: fromDate }));
        if (toDate) clauses.push(where(fn("DATE", localTs), { [Op.lte]: toDate }));

        const fromTime = timeOk(query.fromTime) ? query.fromTime : null;
        const toTime = timeOk(query.toTime) ? query.toTime : null;
        const timeOf = fn("TIME", localTs);
        if (fromTime && toTime && fromTime > toTime) {
            clauses.push({
                [Op.or]: [
                    where(timeOf, { [Op.gte]: fromTime }),
                    where(timeOf, { [Op.lte]: toTime })
                ]
            });
        } else {
            if (fromTime) clauses.push(where(timeOf, { [Op.gte]: fromTime }));
            if (toTime) clauses.push(where(timeOf, { [Op.lte]: toTime.length === 5 ? `${toTime}:59` : toTime }));
        }

        const search = String(query.search || "").trim();
        if (search) {
            const like = `%${search.replace(/[%_\\]/g, "\\$&")}%`;
            clauses.push({
                [Op.or]: [
                    { description: { [Op.like]: like } },
                    { actorName: { [Op.like]: like } },
                    { projectName: { [Op.like]: like } }
                ]
            });
        }
        return clauses.length ? { [Op.and]: clauses } : {};
    }

    serialize(row) {
        const plain = row.toJSON ? row.toJSON() : row;
        const local = formatLocal(plain.createdAt);
        return { ...plain, localDate: local.date, localTime: local.time };
    }

    async list(query = {}) {
        const page = Math.max(1, Number(query.page) || 1);
        const limit = Math.min(200, Math.max(1, Number(query.limit) || 25));
        const sortableColumns = {
            createdAt: "createdAt",
            actorName: "actorName",
            action: "action",
            projectName: "projectName",
            description: "description"
        };
        const sortColumn = sortableColumns[query.sortBy] || "createdAt";
        const sortDirection = String(query.sortDirection || "desc").toLowerCase() === "asc" ? "ASC" : "DESC";
        const { rows, count } = await ActivityLog.findAndCountAll({
            where: this.buildWhere(query),
            order: [[sortColumn, sortDirection], ["id", sortDirection]],
            limit,
            offset: (page - 1) * limit
        });
        return {
            items: rows.map((row) => this.serialize(row)),
            pagination: { page, limit, total: count, totalPages: Math.max(1, Math.ceil(count / limit)) }
        };
    }

    async filterOptions() {
        const [projects, actors] = await Promise.all([
            ProjectOnboard.findAll({ attributes: ["id", "projectName"], order: [["projectName", "ASC"]] }),
            ActivityLog.findAll({
                attributes: ["actorId", "actorName"],
                where: { actorId: { [Op.ne]: null } },
                group: ["actorId", "actorName"],
                order: [["actorName", "ASC"]]
            })
        ]);
        const seen = new Set();
        const employees = [];
        for (const actor of actors) {
            if (seen.has(actor.actorId)) continue;
            seen.add(actor.actorId);
            employees.push({ id: actor.actorId, name: actor.actorName });
        }
        return {
            projects: projects.map((project) => ({ id: project.id, name: project.projectName })),
            employees
        };
    }

    async exportRows(query = {}) {
        const rows = await ActivityLog.findAll({
            where: this.buildWhere(query),
            order: [["createdAt", "DESC"], ["id", "DESC"]],
            limit: EXPORT_LIMIT
        });
        return rows.map((row) => this.serialize(row));
    }

    // Removes everything older than the retention window (6 months by default).
    async purgeExpired() {
        const cutoff = new Date();
        cutoff.setMonth(cutoff.getMonth() - RETENTION_MONTHS);
        const removed = await ActivityLog.destroy({ where: { createdAt: { [Op.lt]: cutoff } } });
        if (removed) logger.info(`Activity log cleanup removed ${removed} entries older than ${RETENTION_MONTHS} months.`);
        return removed;
    }
}

module.exports = new ActivityLogService();
module.exports.userDisplayName = userDisplayName;
