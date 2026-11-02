const { Op } = require("sequelize");
const db = require("../model");
const { normalizeEmployeeCode } = require("../helpers/employeeCode");
const {
    PERMISSION_MONTHLY_USAGE_LIMIT_HOURS,
    getPermissionMonthBalance,
    getCasualLeaveMonthBalance,
} = require("./leave.policy");

const APPROVER_ROLES = new Set(["hr", "manager", "superadmin"]);
const CONFLICTING_LEAVE_CODES = new Set([
    "CASUAL_LEAVE",
    "LEAVE_WITHOUT_PAY",
    "PERMISSION",
]);

function normalizeRole(value = "") {
    return String(value)
        .trim()
        .toLowerCase()
        .replace(/[\s_-]+/g, "");
}

function isOrganizationLeaveAdmin(user = {}) {
    return Boolean(
        user?.isSuperAdmin
        || user?.roleSet?.has(normalizeRole("hr"))
    );
}

function isTeamLeaveReportViewer(user = {}) {
    const roleSet = user?.roleSet;
    return Boolean(
        roleSet
        && typeof roleSet.has === "function"
        && ["manager", "head", "teamlead", "reportinghead", "departmenthead", "ceo"]
            .some((role) => roleSet.has(normalizeRole(role)))
    );
}

function normalizeReportValue(value) {
    return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
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

function getTodayIsoDate() {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${today.getFullYear()}-${month}-${day}`;
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

function getMonthDateRange(year, month) {
    const monthValue = String(month).padStart(2, "0");
    const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
    return [`${year}-${monthValue}-01`, `${year}-${monthValue}-${String(lastDay).padStart(2, "0")}`];
}

function getPreviousMonth(year, month) {
    return month === 1
        ? { year: year - 1, month: 12 }
        : { year, month: month - 1 };
}

function getCasualRequestDaysInMonth(request, monthStart, monthEnd) {
    const requestStart = String(request.fromDate);
    const requestEnd = String(request.toDate || request.fromDate);
    if (requestStart > monthEnd || requestEnd < monthStart) return 0;
    if (String(request.durationType).toUpperCase() === "HALF_DAY") {
        return requestStart >= monthStart && requestStart <= monthEnd
            ? toNumber(request.requestedDays)
            : 0;
    }

    const overlapStart = requestStart > monthStart ? requestStart : monthStart;
    const overlapEnd = requestEnd < monthEnd ? requestEnd : monthEnd;
    return Math.min(
        toNumber(request.requestedDays),
        inclusiveDiffDays(overlapStart, overlapEnd)
    );
}

function getMonthKeys(fromDate, toDate) {
    const keys = [];
    let year = Number(String(fromDate).slice(0, 4));
    let month = Number(String(fromDate).slice(5, 7));
    const endYear = Number(String(toDate).slice(0, 4));
    const endMonth = Number(String(toDate).slice(5, 7));

    while (year < endYear || (year === endYear && month <= endMonth)) {
        keys.push({ year, month });
        month += 1;
        if (month === 13) {
            month = 1;
            year += 1;
        }
    }

    return keys;
}

function validateCategoryDuration(category, durationType) {
    const allowedDurations = {
        CASUAL_LEAVE: ["FULL_DAY", "HALF_DAY"],
        ON_THE_DUTY: ["FULL_DAY", "HALF_DAY", "QUARTER_DAY", "HOURS"],
        LEAVE_WITHOUT_PAY: ["FULL_DAY", "HALF_DAY", "HOURS"],
        PERMISSION: ["HOURS"],
    }[category.code];

    if (allowedDurations && !allowedDurations.includes(durationType)) {
        throw new Error(`${category.name} does not support ${durationType.replace("_", " ").toLowerCase()}.`);
    }
}

class LeaveService {
    async getEmployeeJoiningDate(userId, actor = {}) {
        let employeeRecord = Number(actor.id) === Number(userId)
            ? normalizeEmployeeCode(actor.employeeRecord)
            : null;
        if (!employeeRecord) {
            const user = await db.User.findByPk(userId, { attributes: ["employeeRecord"] });
            employeeRecord = normalizeEmployeeCode(user?.employeeRecord);
        }
        if (!employeeRecord) return null;

        const onboardingInfo = await db.OnboardingInfo.findOne({
            where: { employeeId: employeeRecord },
            attributes: ["doj"],
            order: [["onboardinginfoid", "DESC"]],
        });
        return onboardingInfo?.doj ? String(onboardingInfo.doj).slice(0, 10) : null;
    }

    async getTeamUserIds(actor = {}, existingOnboardingInfos = null) {
        const onboardingInfos = existingOnboardingInfos || await db.OnboardingInfo.findAll({
            attributes: ["employeeId", "reportHead"],
            order: [["onboardinginfoid", "DESC"]],
        });
        const actorIdentifiers = new Set([
            actor.id,
            actor.email,
            actor.employeeRecord,
            `${actor.firstName || ""} ${actor.lastName || ""}`.trim(),
        ].map(normalizeReportValue).filter(Boolean));
        const teamEmployeeCodes = new Set();
        onboardingInfos.forEach((info) => {
            const employeeCode = String(info.employeeId || "").trim();
            if (employeeCode && actorIdentifiers.has(normalizeReportValue(info.reportHead))) {
                teamEmployeeCodes.add(employeeCode);
            }
        });

        const [teamUsers, assignedRequests] = await Promise.all([
            teamEmployeeCodes.size
                ? db.User.findAll({
                    where: { employeeRecord: { [Op.in]: [...teamEmployeeCodes] } },
                    attributes: ["id"],
                })
                : [],
            db.LeaveRequest.findAll({
                where: { designatedApproverId: Number(actor.id) },
                attributes: ["userId"],
                group: ["userId"],
            }),
        ]);
        return [...new Set([
            ...teamUsers.map((user) => Number(user.id)),
            ...assignedRequests.map((request) => Number(request.userId)),
        ])];
    }

    async resolveDesignatedApprover(requester) {
        if (!requester?.employeeRecord) {
            return null;
        }

        const onboardingInfo = await db.OnboardingInfo.findOne({
            where: { employeeId: normalizeEmployeeCode(requester.employeeRecord) },
            attributes: ["reportHead"],
            order: [["onboardinginfoid", "DESC"]],
        });
        const configuredHead = String(onboardingInfo?.reportHead || "").trim();
        if (!configuredHead) {
            return null;
        }

        if (/^\d+$/.test(configuredHead)) {
            const byId = await db.User.findOne({
                where: { id: Number(configuredHead), isActive: true },
            });
            if (byId && Number(byId.id) !== Number(requester.id)) {
                return byId;
            }
        }

        const users = await db.User.findAll({
            where: { isActive: true },
            attributes: ["id", "firstName", "lastName", "email", "employeeRecord"],
        });
        const normalizedHead = configuredHead.toLowerCase().replace(/\s+/g, " ");
        return users.find((user) => {
            if (Number(user.id) === Number(requester.id)) return false;
            const displayName = `${user.firstName || ""} ${user.lastName || ""}`.trim().toLowerCase();
            return [user.email, user.employeeRecord, displayName]
                .filter(Boolean)
                .some((value) => String(value).trim().toLowerCase() === normalizedHead);
        }) || null;
    }

    getRequestAccessWhere(filters = {}, actor = {}) {
        const actorId = Number(actor.id);
        const where = isOrganizationLeaveAdmin(actor)
            ? {}
            : {
                [Op.or]: [
                    { userId: actorId },
                    { designatedApproverId: actorId },
                ],
            };

        if (filters.userId) where.userId = Number(filters.userId);

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

    async getLeaveReport(filters = {}, actor = {}) {
        const globalAccess = isOrganizationLeaveAdmin(actor);
        const year = Number(filters.year);
        if (filters.year && (!Number.isInteger(year) || year < 1900 || year > 9999)) {
            const error = new Error("A valid report year is required.");
            error.status = 400;
            throw error;
        }
        const fromDate = filters.fromDate ? toIsoDate(filters.fromDate) : null;
        const toDate = filters.toDate ? toIsoDate(filters.toDate) : null;
        if ((filters.fromDate && !fromDate) || (filters.toDate && !toDate) || (fromDate && toDate && fromDate > toDate)) {
            const error = new Error("A valid report date range is required.");
            error.status = 400;
            throw error;
        }

        let allowedUserIds = null;
        const onboardingInfos = await db.OnboardingInfo.findAll({
            attributes: ["employeeId", "reportHead", "department", "firstName", "lastName", "onboardinginfoid"],
            order: [["onboardinginfoid", "DESC"]],
        });
        const onboardingByEmployeeCode = new Map();
        onboardingInfos.forEach((info) => {
            const employeeCode = String(info.employeeId || "").trim();
            if (employeeCode && !onboardingByEmployeeCode.has(employeeCode)) {
                onboardingByEmployeeCode.set(employeeCode, info);
            }
        });
        if (!globalAccess) {
            if (!isTeamLeaveReportViewer(actor)) {
                const error = new Error("You do not have access to team leave reports.");
                error.status = 403;
                throw error;
            }
            allowedUserIds = await this.getTeamUserIds(actor, onboardingInfos);
            if (!allowedUserIds.length) {
                const error = new Error("You do not have access to team leave reports.");
                error.status = 403;
                throw error;
            }
        }

        const where = {};
        if (allowedUserIds) where.userId = { [Op.in]: allowedUserIds };
        if (filters.employeeId) {
            const requestedUserId = Number(filters.employeeId);
            if (!Number.isInteger(requestedUserId) || requestedUserId < 1) {
                const error = new Error("A valid employee filter is required.");
                error.status = 400;
                throw error;
            }
            if (allowedUserIds && !allowedUserIds.includes(requestedUserId)) {
                const error = new Error("You do not have access to this employee's leave report.");
                error.status = 403;
                throw error;
            }
            where.userId = requestedUserId;
        }
        if (filters.status) where.status = String(filters.status).toUpperCase();
        if (filters.leaveType) {
            where.categoryId = (await db.LeaveCategory.findOne({
                where: { code: String(filters.leaveType).toUpperCase() },
                attributes: ["id"],
            }))?.id || -1;
        }
        const rangeStartCandidates = [year ? `${year}-01-01` : null, fromDate].filter(Boolean).sort();
        const rangeStart = rangeStartCandidates[rangeStartCandidates.length - 1];
        const rangeEnd = [year ? `${year}-12-31` : null, toDate].filter(Boolean).sort()[0];
        if (rangeStart) where.toDate = { [Op.gte]: rangeStart };
        if (rangeEnd) where.fromDate = { [Op.lte]: rangeEnd };

        const [requests, departments] = await Promise.all([
            db.LeaveRequest.findAll({
                where,
                include: [
                    { model: db.LeaveCategory, as: "category", attributes: ["code", "name", "unit"] },
                    { model: db.User, as: "requester", attributes: ["id", "firstName", "lastName", "email", "employeeRecord"] },
                    { model: db.User, as: "approver", attributes: ["id", "firstName", "lastName", "email"], required: false },
                    { model: db.User, as: "designatedApprover", attributes: ["id", "firstName", "lastName", "email"], required: false },
                ],
                order: [["fromDate", "DESC"], ["createdAt", "DESC"]],
            }),
            db.Department.findAll({ attributes: ["id", "name"] }),
        ]);
        const departmentsById = new Map(departments.map((department) => [Number(department.id), department.name]));

        return requests.map((request) => {
            const data = request.toJSON();
            const requester = data.requester || {};
            const fullName = `${requester.firstName || ""} ${requester.lastName || ""}`.trim();
            const onboarding = onboardingByEmployeeCode.get(String(requester.employeeRecord || ""));
            const approver = data.approver || data.designatedApprover;
            return {
                id: data.id,
                userId: Number(data.userId),
                employeeName: fullName || data.employeeName || requester.email || "Employee",
                employeeId: requester.employeeRecord || data.employeeCode || onboarding?.employeeId || "",
                departmentId: onboarding?.department || null,
                departmentName: departmentsById.get(Number(onboarding?.department)) || "",
                leaveType: data.category?.name || "Leave",
                leaveTypeCode: data.category?.code || "",
                unit: data.category?.unit || "DAY",
                fromDate: data.fromDate,
                toDate: data.toDate,
                requestedDays: toNumber(data.requestedDays),
                requestedHours: toNumber(data.requestedHours),
                reason: data.reason || "",
                status: data.status,
                approverName: approver
                    ? `${approver.firstName || ""} ${approver.lastName || ""}`.trim() || approver.email
                    : "",
                approverEmail: approver?.email || "",
                approvedAt: data.approvedAt,
            };
        }).filter((row) => (
            !filters.departmentId || Number(row.departmentId) === Number(filters.departmentId)
        ));
    }

    async ensureConflictingLeaveOverlap({ userId, category, fromDate, toDate, excludeRequestId = null }) {
        if (!CONFLICTING_LEAVE_CODES.has(category.code)) {
            return;
        }

        const where = {
            userId,
            fromDate: { [Op.lte]: toDate },
            toDate: { [Op.gte]: fromDate },
            status: { [Op.in]: ["PENDING", "APPROVED"] },
        };

        if (excludeRequestId) {
            where.id = { [Op.ne]: excludeRequestId };
        }

        const existingRequests = await db.LeaveRequest.findAll({
            where,
            include: [{
                model: db.LeaveCategory,
                as: "category",
                attributes: ["code", "name"],
            }],
        });

        const conflictingCodes = {
            CASUAL_LEAVE: ["LEAVE_WITHOUT_PAY", "PERMISSION"],
            LEAVE_WITHOUT_PAY: ["CASUAL_LEAVE", "PERMISSION"],
            PERMISSION: ["CASUAL_LEAVE", "LEAVE_WITHOUT_PAY"],
        };
        const conflictingRequest = existingRequests.find((request) =>
            conflictingCodes[category.code]?.includes(request.category?.code)
        );

        if (conflictingRequest) {
            const error = new Error(
                `${conflictingRequest.category.name} is already booked for an overlapping date.`
            );
            error.status = 400;
            throw error;
        }
    }

    async ensureCasualLeaveMonthsAvailable({ userId, categoryId, fromDate, toDate, requestedDays, excludeRequestId = null }) {
        const joiningDate = await this.getEmployeeJoiningDate(userId);
        const monthKeys = getMonthKeys(fromDate, toDate);
        const firstMonth = monthKeys[0];
        const previousMonth = getPreviousMonth(firstMonth.year, firstMonth.month);
        const [previousMonthStart] = getMonthDateRange(previousMonth.year, previousMonth.month);
        const [, finalMonthEnd] = getMonthDateRange(
            monthKeys[monthKeys.length - 1].year,
            monthKeys[monthKeys.length - 1].month
        );
        const where = {
            userId,
            categoryId,
            fromDate: { [Op.lte]: finalMonthEnd },
            toDate: { [Op.gte]: previousMonthStart },
            status: { [Op.in]: ["PENDING", "APPROVED"] },
        };
        if (excludeRequestId) where.id = { [Op.ne]: excludeRequestId };
        const existingRequests = await db.LeaveRequest.findAll({ where });
        let remainingIncomingDays = toNumber(requestedDays);

        for (const { year, month } of monthKeys) {
            const [monthStart, monthEnd] = getMonthDateRange(year, month);
            const previous = getPreviousMonth(year, month);
            const [previousStart, previousEnd] = getMonthDateRange(previous.year, previous.month);
            const wasOnboardedInPreviousMonth = !joiningDate || joiningDate <= previousEnd;
            const previousRequests = wasOnboardedInPreviousMonth ? existingRequests.filter((request) => (
                String(request.fromDate) <= previousEnd && String(request.toDate) >= previousStart
            )) : [];
            const currentRequests = existingRequests.filter((request) => (
                String(request.fromDate) <= monthEnd && String(request.toDate) >= monthStart
            ));
            const balance = getCasualLeaveMonthBalance(
                previousRequests,
                currentRequests,
                wasOnboardedInPreviousMonth
            );
            const requestSegmentStart = String(fromDate) > monthStart ? String(fromDate) : monthStart;
            const requestSegmentEnd = String(toDate) < monthEnd ? String(toDate) : monthEnd;
            let incomingDays = 0;

            if (String(requestSegmentStart) <= String(requestSegmentEnd) && remainingIncomingDays > 0) {
                incomingDays = String(requestedDays) === "0.5"
                    ? (String(fromDate) >= monthStart && String(fromDate) <= monthEnd ? remainingIncomingDays : 0)
                    : Math.min(remainingIncomingDays, inclusiveDiffDays(requestSegmentStart, requestSegmentEnd));
            }

            const existingBookedDays = currentRequests.reduce(
                (sum, request) => sum + getCasualRequestDaysInMonth(request, monthStart, monthEnd),
                0
            );
            if (existingBookedDays + incomingDays > balance.allocatedDays) {
                const error = new Error(
                    `Insufficient Casual Leave balance for ${year}-${String(month).padStart(2, "0")}. Available ${Number(Math.max(0, balance.allocatedDays - existingBookedDays).toFixed(2))} day(s).`
                );
                error.status = 400;
                throw error;
            }

            remainingIncomingDays = Number(Math.max(0, remainingIncomingDays - incomingDays).toFixed(2));
        }

        if (remainingIncomingDays > 0) {
            const error = new Error("Requested Casual Leave days do not fit within the selected date range.");
            error.status = 400;
            throw error;
        }
    }

    async getCategoryBookingStats({ userId, categoryId, year, throughDate = null, excludeRequestId = null }) {
        const [fromYearDate, toYearDate] = getYearRange(year);
        const where = {
            userId,
            categoryId,
            fromDate: { [Op.between]: [fromYearDate, throughDate || toYearDate] },
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

    async ensureBalanceAvailable({ category, userId, fromDate, toDate, requestedDays, requestedHours, excludeRequestId = null }) {
        if (["LEAVE_WITHOUT_PAY", "ON_THE_DUTY"].includes(category.code)) {
            return;
        }

        const year = Number(String(fromDate).slice(0, 4)) || new Date().getFullYear();
        let allocated = toNumber(category.allocatedValue);

        if (category.code === "CASUAL_LEAVE") {
            await this.ensureCasualLeaveMonthsAvailable({
                userId,
                categoryId: category.id,
                fromDate,
                toDate: toDate || fromDate,
                requestedDays,
                excludeRequestId,
            });
            return;
        } else if (category.code === "PERMISSION") {
            if (String(fromDate).slice(0, 7) !== String(toDate || fromDate).slice(0, 7)) {
                const error = new Error("Permission requests must be within one calendar month.");
                error.status = 400;
                throw error;
            }
            const month = Number(String(fromDate).slice(5, 7));
            const [fromMonthDate, toMonthDate] = getMonthDateRange(year, month);
            
            const where = {
                userId,
                categoryId: category.id,
                fromDate: { [Op.lte]: toMonthDate },
                toDate: { [Op.gte]: fromMonthDate },
                status: { [Op.in]: ["PENDING", "APPROVED"] },
            };
            if (excludeRequestId) {
                where.id = { [Op.ne]: excludeRequestId };
            }
            
            const monthRequests = await db.LeaveRequest.findAll({ where });
            const monthBookedHours = getPermissionMonthBalance(monthRequests).bookedHours;
            const incoming = toNumber(requestedHours);
            
            if (monthBookedHours + incoming > PERMISSION_MONTHLY_USAGE_LIMIT_HOURS) {
                const error = new Error(`Permission exceeds ${PERMISSION_MONTHLY_USAGE_LIMIT_HOURS} hours per month. Available ${Number((PERMISSION_MONTHLY_USAGE_LIMIT_HOURS - monthBookedHours).toFixed(2))} hours.`);
                error.status = 400;
                throw error;
            }
            return;
        }

        const stats = await this.getCategoryBookingStats({
            userId,
            categoryId: category.id,
            year,
            throughDate:
                category.code === "CASUAL_LEAVE"
                    ? `${year}-${String(Number(String(fromDate).slice(5, 7))).padStart(2, "0")}-${new Date(year, Number(String(fromDate).slice(5, 7)), 0).getDate()}`
                    : null,
            excludeRequestId,
        });

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
            where: this.getRequestAccessWhere(filters, actor),
            include: [
                {
                    model: db.LeaveCategory,
                    as: "category",
                    attributes: ["id", "code", "name", "unit", "allocatedValue"],
                },
                {
                    model: db.User,
                    as: "designatedApprover",
                    attributes: ["id", "firstName", "lastName", "email"],
                },
                {
                    model: db.User,
                    as: "approver",
                    attributes: ["id", "firstName", "lastName", "email"],
                    required: false,
                },
            ],
            order: [["createdAt", "DESC"]],
        });
    }

    async listCalendarRequests(year, month, actor = {}) {
        const calendarYear = Number(year);
        const calendarMonth = Number(month);
        if (
            !Number.isInteger(calendarYear)
            || calendarYear < 1900
            || calendarYear > 9999
            || !Number.isInteger(calendarMonth)
            || calendarMonth < 1
            || calendarMonth > 12
        ) {
            const error = new Error("A valid calendar year and month are required.");
            error.status = 400;
            throw error;
        }

        const monthStart = `${calendarYear}-${String(calendarMonth).padStart(2, "0")}-01`;
        const monthEnd = `${calendarYear}-${String(calendarMonth).padStart(2, "0")}-${String(
            new Date(Date.UTC(calendarYear, calendarMonth, 0)).getUTCDate()
        ).padStart(2, "0")}`;

        const where = {
            fromDate: { [Op.lte]: monthEnd },
            toDate: { [Op.gte]: monthStart },
            status: { [Op.in]: ["PENDING", "APPROVED"] },
        };
        if (!isOrganizationLeaveAdmin(actor) && isTeamLeaveReportViewer(actor)) {
            const teamUserIds = await this.getTeamUserIds(actor);
            where.userId = { [Op.in]: [...new Set([Number(actor.id), ...teamUserIds])] };
        }

        const requests = await db.LeaveRequest.findAll({
            where,
            attributes: [
                "id",
                "userId",
                "employeeName",
                "clientName",
                "fromDate",
                "toDate",
                "durationType",
                "session",
                "quarterSlot",
                "status",
            ],
            include: [
                {
                    model: db.LeaveCategory,
                    as: "category",
                    attributes: ["code", "name"],
                },
                {
                    model: db.User,
                    as: "requester",
                    attributes: ["id", "firstName", "lastName", "email"],
                },
            ],
            order: [["fromDate", "ASC"], ["createdAt", "ASC"]],
        });

        return requests.map((request) => {
            const data = request.toJSON();
            const requesterName = [data.requester?.firstName, data.requester?.lastName]
                .filter(Boolean)
                .join(" ")
                .trim();
            const employeeName = requesterName
                || data.employeeName
                || data.requester?.email
                || "Employee";

            return {
                id: data.id,
                employeeName,
                categoryName: data.category?.name || "Leave",
                categoryCode: data.category?.code || null,
                clientName: data.category?.code === "ON_THE_DUTY" ? data.clientName : null,
                fromDate: data.fromDate,
                toDate: data.toDate,
                durationType: data.durationType,
                session: data.session,
                quarterSlot: data.quarterSlot,
                status: data.status,
            };
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
                {
                    model: db.User,
                    as: "designatedApprover",
                    attributes: ["id", "firstName", "lastName", "email"],
                },
            ],
        });

        if (!request) {
            return null;
        }

        if (
            Number(request.userId) !== Number(actor.id) &&
            Number(request.designatedApproverId) !== Number(actor.id) &&
            !isOrganizationLeaveAdmin(actor)
        ) {
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
        validateCategoryDuration(category, durationType);

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

    async applyLeaveRules(category, userId, calculated, excludeRequestId = null) {
        let finalCategory = category;
        let adjustedCalculated = { ...calculated };

        if (finalCategory.code === "CASUAL_LEAVE") {
            const today = new Date(`${getTodayIsoDate()}T00:00:00`);
            const fromDateObj = new Date(`${adjustedCalculated.fromDate}T00:00:00`);
            const diffInDays = Math.floor((fromDateObj - today) / (1000 * 60 * 60 * 24));
            
            if (diffInDays < 2) {
                const lopCategory = await db.LeaveCategory.findOne({ where: { code: "LEAVE_WITHOUT_PAY" } });
                if (lopCategory) {
                    finalCategory = lopCategory;
                }
            }
        }

        await this.ensureConflictingLeaveOverlap({
            userId,
            category: finalCategory,
            fromDate: adjustedCalculated.fromDate,
            toDate: adjustedCalculated.toDate,
            excludeRequestId,
        });

        await this.ensureBalanceAvailable({
            category: finalCategory,
            userId,
            fromDate: adjustedCalculated.fromDate,
            toDate: adjustedCalculated.toDate,
            requestedDays: adjustedCalculated.requestedDays,
            requestedHours: adjustedCalculated.requestedHours,
            excludeRequestId
        });

        return { finalCategory, adjustedCalculated };
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

        const clientName = String(payload.clientName || "").trim();
        if (category.code === "ON_THE_DUTY" && !clientName) {
            const error = new Error("Client name is required for On The Duty leave.");
            error.status = 400;
            throw error;
        }

        const requesterId = isOrganizationLeaveAdmin(actor) && payload.userId
            ? Number(payload.userId)
            : Number(actor.id);

        if (!requesterId) {
            throw new Error("Requester is required.");
        }

        const requester = await db.User.findByPk(requesterId);
        if (!requester) {
            throw new Error("Requester user not found.");
        }

        const designatedApprover = await this.resolveDesignatedApprover(requester);

        const calculated = await this.computeAmount(category, payload);

        const { finalCategory, adjustedCalculated } = await this.applyLeaveRules(
            category,
            requesterId,
            calculated
        );

        return db.LeaveRequest.create({
            userId: requesterId,
            employeeCode: normalizeEmployeeCode(requester.employeeRecord) || null,
            employeeName: `${requester.firstName || ""} ${requester.lastName || ""}`.trim() || requester.email,
            clientName: finalCategory.code === "ON_THE_DUTY" ? clientName : null,
            categoryId: finalCategory.id,
            fromDate: adjustedCalculated.fromDate,
            toDate: adjustedCalculated.toDate,
            durationType: adjustedCalculated.durationType,
            session: payload.session ? String(payload.session).toUpperCase() : null,
            quarterSlot: payload.quarterSlot ? Number(payload.quarterSlot) : null,
            startTime: payload.startTime || null,
            endTime: payload.endTime || null,
            requestedDays: adjustedCalculated.requestedDays,
            requestedHours: adjustedCalculated.requestedHours,
            reason: payload.reason || null,
            status: "PENDING",
            designatedApproverId: designatedApprover?.id || null,
        });
    }

    async updateRequest(id, payload = {}, actor = {}) {
        const request = await db.LeaveRequest.findByPk(id, {
            include: [{ model: db.LeaveCategory, as: "category" }],
        });

        if (!request) {
            return null;
        }

        const approver = isOrganizationLeaveAdmin(actor) || Number(request.designatedApproverId) === Number(actor.id);
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

        const clientName = payload.clientName === undefined
            ? String(request.clientName || "").trim()
            : String(payload.clientName || "").trim();
        if (category.code === "ON_THE_DUTY" && !clientName) {
            const error = new Error("Client name is required for On The Duty leave.");
            error.status = 400;
            throw error;
        }

        const calculated = await this.computeAmount(category, {
            fromDate: payload.fromDate || request.fromDate,
            toDate: payload.toDate || request.toDate,
            durationType: payload.durationType || request.durationType,
            startTime: payload.startTime || request.startTime,
            endTime: payload.endTime || request.endTime,
            requestedHours: payload.requestedHours,
        });

        const { finalCategory, adjustedCalculated } = await this.applyLeaveRules(
            category,
            request.userId,
            calculated,
            request.id
        );

        await request.update({
            categoryId: finalCategory.id,
            fromDate: adjustedCalculated.fromDate,
            toDate: adjustedCalculated.toDate,
            durationType: adjustedCalculated.durationType,
            session: payload.session ? String(payload.session).toUpperCase() : request.session,
            quarterSlot:
                payload.quarterSlot !== undefined
                    ? Number(payload.quarterSlot || 0) || null
                    : request.quarterSlot,
            startTime: payload.startTime !== undefined ? payload.startTime : request.startTime,
            endTime: payload.endTime !== undefined ? payload.endTime : request.endTime,
            requestedDays: adjustedCalculated.requestedDays,
            requestedHours: adjustedCalculated.requestedHours,
            clientName: finalCategory.code === "ON_THE_DUTY" ? clientName : null,
            reason: payload.reason !== undefined ? payload.reason : request.reason,
        });

        return request;
    }

    async deleteRequest(id, actor = {}) {
        const request = await db.LeaveRequest.findByPk(id);
        if (!request) {
            return false;
        }

        const approver = isOrganizationLeaveAdmin(actor) || Number(request.designatedApproverId) === Number(actor.id);
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
        const request = await db.LeaveRequest.findByPk(id);
        if (!request) {
            return null;
        }

        if (Number(request.designatedApproverId) !== Number(actor.id) && !isOrganizationLeaveAdmin(actor)) {
            const error = new Error("Only the employee's designated reporting approver can approve or reject this leave request.");
            error.status = 403;
            throw error;
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
        const targetUserId = isOrganizationLeaveAdmin(actor) && query.userId
            ? Number(query.userId)
            : Number(actor.id);

        if (!targetUserId) {
            throw new Error("User context is required.");
        }

        const [categories, requests, joiningDate] = await Promise.all([
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
            this.getEmployeeJoiningDate(targetUserId, actor),
        ]);
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        const [currentMonthStart, currentMonthEnd] = getMonthDateRange(currentYear, currentMonth);
        const previousMonth = getPreviousMonth(currentYear, currentMonth);
        const [previousMonthStart, previousMonthEnd] = getMonthDateRange(previousMonth.year, previousMonth.month);
        const permissionCategory = categories.find((category) => category.code === "PERMISSION");
        const casualLeaveCategory = categories.find((category) => category.code === "CASUAL_LEAVE");
        const [permissionMonthRequests, casualLeaveMonthRequests] = await Promise.all([
            permissionCategory
                ? db.LeaveRequest.findAll({
                    where: {
                        userId: targetUserId,
                        categoryId: permissionCategory.id,
                        fromDate: { [Op.lte]: currentMonthEnd },
                        toDate: { [Op.gte]: currentMonthStart },
                        status: { [Op.in]: ["PENDING", "APPROVED"] },
                    },
                })
                : [],
            casualLeaveCategory
                ? db.LeaveRequest.findAll({
                    where: {
                        userId: targetUserId,
                        categoryId: casualLeaveCategory.id,
                        fromDate: { [Op.lte]: currentMonthEnd },
                        toDate: { [Op.gte]: previousMonthStart },
                        status: { [Op.in]: ["PENDING", "APPROVED"] },
                    },
                })
                : [],
        ]);
        const permissionMonthBalance = getPermissionMonthBalance(permissionMonthRequests);
        const previousCasualLeaveRequests = joiningDate && joiningDate > previousMonthEnd
            ? []
            : casualLeaveMonthRequests.filter((request) => (
                String(request.fromDate) <= previousMonthEnd && String(request.toDate) >= previousMonthStart
            ));
        const currentCasualLeaveRequests = casualLeaveMonthRequests
            .filter((request) => (
                String(request.fromDate) <= currentMonthEnd && String(request.toDate) >= currentMonthStart
            ))
            .map((request) => ({
                ...(request.toJSON?.() || request),
                requestedDays: getCasualRequestDaysInMonth(request, currentMonthStart, currentMonthEnd),
            }));
        const casualLeaveMonthBalance = getCasualLeaveMonthBalance(
            previousCasualLeaveRequests,
            currentCasualLeaveRequests,
            !joiningDate || joiningDate <= previousMonthEnd
        );

        const byCategory = new Map();
        categories.forEach((category) => {
            let allocated = toNumber(category.allocatedValue);
            
            if (category.code === "CASUAL_LEAVE") {
                if (year === currentYear) {
                    allocated = Math.max(0, 12 - now.getMonth()) + casualLeaveMonthBalance.carryForwardDays;
                } else if (year < currentYear) {
                    allocated = 12;
                } else {
                    allocated = 0;
                }
            } else if (category.code === "PERMISSION") {
                if (year < currentYear) {
                    allocated = 24;
                } else if (year === currentYear) {
                    allocated = Math.max(0, 12 - now.getMonth()) * 2;
                } else {
                    allocated = 0;
                }
            } else if (["LEAVE_WITHOUT_PAY", "ON_THE_DUTY"].includes(category.code)) {
                allocated = 0;
            }

            byCategory.set(category.id, {
                categoryId: category.id,
                code: category.code,
                name: category.name,
                unit: category.unit,
                unlimited: ["LEAVE_WITHOUT_PAY", "ON_THE_DUTY"].includes(category.code),
                allocated,
                booked: 0,
                taken: 0,
                pending: 0,
                available: allocated,
                ...(category.code === "PERMISSION" ? { monthlyBalance: permissionMonthBalance } : {}),
                ...(category.code === "CASUAL_LEAVE"
                    ? {
                        carryForwardDays: year === currentYear ? casualLeaveMonthBalance.carryForwardDays : 0,
                        monthlyBalance: year === currentYear ? casualLeaveMonthBalance : null,
                    }
                    : {}),
            });
        });

        requests.forEach((request) => {
            const entry = byCategory.get(request.categoryId);
            if (!entry) return;

            if (
                entry.code === "CASUAL_LEAVE" &&
                year === new Date().getFullYear() &&
                Number(String(request.fromDate).slice(5, 7)) < new Date().getMonth() + 1
            ) {
                return;
            }

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
            if (!entry.unlimited) {
                entry.available = Number((entry.allocated - entry.booked).toFixed(2));
            }
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
            joiningDate,
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
