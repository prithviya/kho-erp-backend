const { Op } = require("sequelize");
const db = require("../model");

const APPROVER_ROLES = new Set(["hr", "manager", "superadmin"]);

function normalizeRole(value = "") {
    return String(value)
        .trim()
        .toLowerCase()
        .replace(/[\s_-]+/g, "");
}

function isApprover(user = {}) {
    if (user?.isSuperAdmin) {
        return true;
    }

    const roleSet = user?.roleSet;
    if (!roleSet || typeof roleSet.has !== "function") {
        return false;
    }

    return [...APPROVER_ROLES].some((role) => roleSet.has(normalizeRole(role)));
}

function toNumber(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
}

function toIsoDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return date.toISOString().slice(0, 10);
}

function inclusiveDiffDays(fromDate, toDate) {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diff = Math.floor((to - from) / (24 * 60 * 60 * 1000));
    return diff >= 0 ? diff + 1 : 0;
}

function timeToMinutes(value) {
    const [hh, mm] = String(value || "").split(":").map(Number);
    if (!Number.isInteger(hh) || !Number.isInteger(mm)) {
        return null;
    }

    return hh * 60 + mm;
}

function getYearRange(year) {
    return [`${year}-01-01`, `${year}-12-31`];
}

class LeaveService {
    async getCategoryBookingStats({ userId, categoryId, year, excludeRequestId = null }) {
        const [fromYearDate, toYearDate] = getYearRange(year);
        const where = {
            userId,
            categoryId,
            fromDate: { [Op.between]: [fromYearDate, toYearDate] },
            status: { [Op.in]: ["PENDING", "APPROVED"] },
        };

        if (excludeRequestId) {
            where.id = { [Op.ne]: excludeRequestId };
        }

        const requests = await db.LeaveRequest.findAll({ where });
        return requests.reduce(
            (acc, request) => {
                acc.days += toNumber(request.requestedDays);
                acc.hours += toNumber(request.requestedHours);
                return acc;
            },
            { days: 0, hours: 0 }
        );
    }

    async ensureBalanceAvailable({ category, userId, fromDate, requestedDays, requestedHours, excludeRequestId = null }) {
        const year = Number(String(fromDate).slice(0, 4)) || new Date().getFullYear();
        const stats = await this.getCategoryBookingStats({
            userId,
            categoryId: category.id,
            year,
            excludeRequestId,
        });

        const allocated = toNumber(category.allocatedValue);
        const alreadyBooked = category.unit === "HOUR" ? stats.hours : stats.days;
        const incoming = category.unit === "HOUR" ? toNumber(requestedHours) : toNumber(requestedDays);
        const remaining = Number((allocated - alreadyBooked).toFixed(2));

        if (incoming > remaining) {
            const unitLabel = category.unit === "HOUR" ? "hours" : "days";
            const error = new Error(
                `Insufficient leave balance. Available ${remaining.toFixed(2)} ${unitLabel}, requested ${incoming.toFixed(2)} ${unitLabel}.`
            );
            error.status = 400;
            throw error;
        }
    }

    async getCategories() {
        return db.LeaveCategory.findAll({
            where: { isActive: true },
            order: [["id", "ASC"]],
        });
    }

    async createCategory(payload = {}) {
        const code = String(payload.code || "")
            .trim()
            .toUpperCase();

        if (!code) {
            throw new Error("Leave category code is required.");
        }

        const existing = await db.LeaveCategory.findOne({ where: { code } });
        if (existing) {
            throw new Error("Leave category code already exists.");
        }

        return db.LeaveCategory.create({
            code,
            name: String(payload.name || code).trim(),
            unit: String(payload.unit || "DAY").toUpperCase() === "HOUR" ? "HOUR" : "DAY",
            allocatedValue: toNumber(payload.allocatedValue),
            isActive: payload.isActive !== false,
        });
    }

    async updateCategory(id, payload = {}) {
        const category = await db.LeaveCategory.findByPk(id);
        if (!category) {
            return null;
        }

        const nextCode = payload.code
            ? String(payload.code).trim().toUpperCase()
            : category.code;

        if (nextCode !== category.code) {
            const existing = await db.LeaveCategory.findOne({ where: { code: nextCode } });
            if (existing) {
                throw new Error("Leave category code already exists.");
            }
        }

        await category.update({
            code: nextCode,
            name: payload.name !== undefined ? String(payload.name || "").trim() : category.name,
            unit:
                payload.unit !== undefined
                    ? String(payload.unit).toUpperCase() === "HOUR"
                        ? "HOUR"
                        : "DAY"
                    : category.unit,
            allocatedValue:
                payload.allocatedValue !== undefined
                    ? toNumber(payload.allocatedValue)
                    : category.allocatedValue,
            isActive: payload.isActive !== undefined ? Boolean(payload.isActive) : category.isActive,
        });

        return category;
    }

    getRequestWhere(filters = {}, actor = {}) {
        const where = {};

        if (!isApprover(actor)) {
            where.userId = actor.id;
        } else if (filters.userId) {
            where.userId = Number(filters.userId);
        }

        if (filters.status) {
            where.status = String(filters.status).toUpperCase();
        }

        if (filters.year) {
            const year = Number(filters.year);
            if (Number.isInteger(year) && year > 2000) {
                where.fromDate = {
                    [Op.between]: [`${year}-01-01`, `${year}-12-31`],
                };
            }
        }

        return where;
    }

    async listRequests(filters = {}, actor = {}) {
        return db.LeaveRequest.findAll({
            where: this.getRequestWhere(filters, actor),
            include: [
                {
                    model: db.LeaveCategory,
                    as: "category",
                    attributes: ["id", "code", "name", "unit", "allocatedValue"],
                },
            ],
            order: [["createdAt", "DESC"]],
        });
    }

    async getRequestById(id, actor = {}) {
        const request = await db.LeaveRequest.findByPk(id, {
            include: [
                {
                    model: db.LeaveCategory,
                    as: "category",
                    attributes: ["id", "code", "name", "unit", "allocatedValue"],
                },
            ],
        });

        if (!request) {
            return null;
        }

        if (!isApprover(actor) && Number(request.userId) !== Number(actor.id)) {
            const error = new Error("You can only view your own leave requests.");
            error.status = 403;
            throw error;
        }

        return request;
    }

    async computeAmount(category, payload = {}) {
        const fromDate = toIsoDate(payload.fromDate);
        const toDate = toIsoDate(payload.toDate || payload.fromDate);

        if (!fromDate || !toDate) {
            throw new Error("Valid fromDate and toDate are required.");
        }

        if (toDate < fromDate) {
            throw new Error("toDate must be greater than or equal to fromDate.");
        }

        const durationType = String(payload.durationType || "FULL_DAY").toUpperCase();

        let requestedDays = 0;
        let requestedHours = 0;

        if (category.unit === "HOUR") {
            if (durationType === "HOURS") {
                const start = timeToMinutes(payload.startTime);
                const end = timeToMinutes(payload.endTime);
                if (start === null || end === null || end <= start) {
                    throw new Error("Valid startTime and endTime are required for hour based leave.");
                }
                requestedHours = Number(((end - start) / 60).toFixed(2));
            } else {
                requestedHours = toNumber(payload.requestedHours);
            }

            if (requestedHours <= 0) {
                throw new Error("Requested permission hours must be greater than zero.");
            }
        } else {
            if (durationType === "HALF_DAY") {
                requestedDays = 0.5;
            } else if (durationType === "QUARTER_DAY") {
                requestedDays = 0.25;
            } else {
                requestedDays = inclusiveDiffDays(fromDate, toDate);
            }

            if (requestedDays <= 0) {
                throw new Error("Requested leave days must be greater than zero.");
            }
        }

        return {
            fromDate,
            toDate,
            durationType,
            requestedDays,
            requestedHours,
        };
    }

    async createRequest(payload = {}, actor = {}) {
        const categoryId = Number(payload.categoryId);
        if (!categoryId) {
            throw new Error("categoryId is required.");
        }

        const category = await db.LeaveCategory.findByPk(categoryId);
        if (!category || !category.isActive) {
            throw new Error("Leave category not found.");
        }

        const requesterId = isApprover(actor) && payload.userId
            ? Number(payload.userId)
            : Number(actor.id);

        if (!requesterId) {
            throw new Error("Requester is required.");
        }

        const requester = await db.User.findByPk(requesterId);
        if (!requester) {
            throw new Error("Requester user not found.");
        }

        const calculated = await this.computeAmount(category, payload);

        await this.ensureBalanceAvailable({
            category,
            userId: requesterId,
            fromDate: calculated.fromDate,
            requestedDays: calculated.requestedDays,
            requestedHours: calculated.requestedHours,
        });

        return db.LeaveRequest.create({
            userId: requesterId,
            employeeCode: requester.employeeRecord || null,
            employeeName: `${requester.firstName || ""} ${requester.lastName || ""}`.trim() || requester.email,
            categoryId,
            fromDate: calculated.fromDate,
            toDate: calculated.toDate,
            durationType: calculated.durationType,
            session: payload.session ? String(payload.session).toUpperCase() : null,
            quarterSlot: payload.quarterSlot ? Number(payload.quarterSlot) : null,
            startTime: payload.startTime || null,
            endTime: payload.endTime || null,
            requestedDays: calculated.requestedDays,
            requestedHours: calculated.requestedHours,
            reason: payload.reason || null,
            status: "PENDING",
        });
    }

    async updateRequest(id, payload = {}, actor = {}) {
        const request = await db.LeaveRequest.findByPk(id, {
            include: [{ model: db.LeaveCategory, as: "category" }],
        });

        if (!request) {
            return null;
        }

        const approver = isApprover(actor);
        const owner = Number(request.userId) === Number(actor.id);
        if (!approver && !owner) {
            const error = new Error("You can only edit your own leave request.");
            error.status = 403;
            throw error;
        }

        if (!approver && request.status !== "PENDING") {
            const error = new Error("Only pending requests can be edited.");
            error.status = 400;
            throw error;
        }

        const categoryId = payload.categoryId ? Number(payload.categoryId) : request.categoryId;
        const category = categoryId === request.categoryId
            ? request.category
            : await db.LeaveCategory.findByPk(categoryId);

        if (!category || !category.isActive) {
            throw new Error("Leave category not found.");
        }

        const calculated = await this.computeAmount(category, {
            fromDate: payload.fromDate || request.fromDate,
            toDate: payload.toDate || request.toDate,
            durationType: payload.durationType || request.durationType,
            startTime: payload.startTime || request.startTime,
            endTime: payload.endTime || request.endTime,
            requestedHours: payload.requestedHours,
        });

        await this.ensureBalanceAvailable({
            category,
            userId: request.userId,
            fromDate: calculated.fromDate,
            requestedDays: calculated.requestedDays,
            requestedHours: calculated.requestedHours,
            excludeRequestId: request.id,
        });

        await request.update({
            categoryId,
            fromDate: calculated.fromDate,
            toDate: calculated.toDate,
            durationType: calculated.durationType,
            session: payload.session ? String(payload.session).toUpperCase() : request.session,
            quarterSlot:
                payload.quarterSlot !== undefined
                    ? Number(payload.quarterSlot || 0) || null
                    : request.quarterSlot,
            startTime: payload.startTime !== undefined ? payload.startTime : request.startTime,
            endTime: payload.endTime !== undefined ? payload.endTime : request.endTime,
            requestedDays: calculated.requestedDays,
            requestedHours: calculated.requestedHours,
            reason: payload.reason !== undefined ? payload.reason : request.reason,
        });

        return request;
    }

    async deleteRequest(id, actor = {}) {
        const request = await db.LeaveRequest.findByPk(id);
        if (!request) {
            return false;
        }

        const approver = isApprover(actor);
        const owner = Number(request.userId) === Number(actor.id);
        if (!approver && !owner) {
            const error = new Error("You can only delete your own leave request.");
            error.status = 403;
            throw error;
        }

        if (!approver && request.status !== "PENDING") {
            const error = new Error("Only pending requests can be deleted.");
            error.status = 400;
            throw error;
        }

        await request.destroy();
        return true;
    }

    async updateRequestStatus(id, payload = {}, actor = {}) {
        if (!isApprover(actor)) {
            const error = new Error("Only HR, Manager, or Super Admin can approve/reject leave requests.");
            error.status = 403;
            throw error;
        }

        const request = await db.LeaveRequest.findByPk(id);
        if (!request) {
            return null;
        }

        const status = String(payload.status || "")
            .trim()
            .toUpperCase();

        if (!["APPROVED", "REJECTED"].includes(status)) {
            const error = new Error("Status must be APPROVED or REJECTED.");
            error.status = 400;
            throw error;
        }

        const approverRemarks = String(payload.approverRemarks || "").trim();
        if (status === "REJECTED" && !approverRemarks) {
            const error = new Error("Approver remarks are required when rejecting a leave request.");
            error.status = 400;
            throw error;
        }

        await request.update({
            status,
            approverId: actor.id,
            approverRemarks: approverRemarks || null,
            approvedAt: new Date(),
        });

        return request;
    }

    async getSummary(actor = {}, query = {}) {
        const year = Number(query.year) || new Date().getFullYear();
        const targetUserId = isApprover(actor) && query.userId
            ? Number(query.userId)
            : Number(actor.id);

        if (!targetUserId) {
            throw new Error("User context is required.");
        }

        const [categories, requests] = await Promise.all([
            this.getCategories(),
            db.LeaveRequest.findAll({
                where: {
                    userId: targetUserId,
                    fromDate: {
                        [Op.between]: [`${year}-01-01`, `${year}-12-31`],
                    },
                    status: {
                        [Op.in]: ["PENDING", "APPROVED"],
                    },
                },
            }),
        ]);

        const byCategory = new Map();
        categories.forEach((category) => {
            byCategory.set(category.id, {
                categoryId: category.id,
                code: category.code,
                name: category.name,
                unit: category.unit,
                allocated: toNumber(category.allocatedValue),
                booked: 0,
                taken: 0,
                pending: 0,
                available: toNumber(category.allocatedValue),
            });
        });

        requests.forEach((request) => {
            const entry = byCategory.get(request.categoryId);
            if (!entry) return;

            const amount = entry.unit === "HOUR"
                ? toNumber(request.requestedHours)
                : toNumber(request.requestedDays);

            entry.booked += amount;
            if (request.status === "APPROVED") {
                entry.taken += amount;
            }
            if (request.status === "PENDING") {
                entry.pending += amount;
            }
            entry.available = Number((entry.allocated - entry.booked).toFixed(2));
        });

        const list = [...byCategory.values()];
        const totals = list.reduce(
            (acc, item) => {
                if (item.unit === "HOUR") {
                    acc.totalBookedHours += item.booked;
                    acc.totalTakenHours += item.taken;
                } else {
                    acc.totalBookedDays += item.booked;
                    acc.totalTakenDays += item.taken;
                }
                return acc;
            },
            {
                totalBookedDays: 0,
                totalBookedHours: 0,
                totalTakenDays: 0,
                totalTakenHours: 0,
            }
        );

        return {
            userId: targetUserId,
            year,
            categories: list.map((item) => ({
                ...item,
                booked: Number(item.booked.toFixed(2)),
                taken: Number(item.taken.toFixed(2)),
                pending: Number(item.pending.toFixed(2)),
                available: Number(item.available.toFixed(2)),
            })),
            totals: {
                totalBookedDays: Number(totals.totalBookedDays.toFixed(2)),
                totalBookedHours: Number(totals.totalBookedHours.toFixed(2)),
                totalTakenDays: Number(totals.totalTakenDays.toFixed(2)),
                totalTakenHours: Number(totals.totalTakenHours.toFixed(2)),
            },
        };
    }

    isApproverUser(user = {}) {
        return isApprover(user);
    }
}

module.exports = new LeaveService();
