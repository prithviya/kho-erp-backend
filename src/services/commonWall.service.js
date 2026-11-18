const { Op, QueryTypes } = require("sequelize");
const {
    sequelize,
    Task,
    GroupChat,
    GroupChatMember,
    Opening,
    Department,
    Employee,
    Onboarding,
    OnboardingInfo,
    User,
    Notification,
} = require("../model");

const ANNOUNCEMENT_NOTIFICATION_TYPES = ["ANNOUNCEMENT", "ALERT"];
const ACTIVE_EMPLOYEE_STATUSES = ["ACTIVE", "Active", "active"];

function dateOnly(value) {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return value.toISOString().slice(0, 10);
    }
    const match = String(value || "").match(/^\d{4}-\d{2}-\d{2}/);
    return match ? match[0] : null;
}

function shiftDate(dateKey, days) {
    const [year, month, day] = dateKey.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day + days)).toISOString().slice(0, 10);
}

function anniversaryOccurrence(dateValue, today) {
    const date = dateOnly(dateValue);
    if (!date) return null;

    const [, month, day] = date.split("-").map(Number);
    const year = Number(today.slice(0, 4));
    const start = shiftDate(today, -1);
    const end = shiftDate(today, 1);
    for (let candidateYear = year - 1; candidateYear <= year + 1; candidateYear += 1) {
        const occurrence = `${candidateYear}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        if (occurrence >= start && occurrence <= end) return occurrence;
    }
    return null;
}

function isActiveEmployee(employee) {
    return ACTIVE_EMPLOYEE_STATUSES.includes(String(employee.status || "").trim());
}

function buildEmployeeSections(employees, today) {
    const activeEmployees = employees.filter(isActiveEmployee);
    const birthdays = [];
    const anniversaries = [];
    const newHires = [];
    const newHireEnd = shiftDate(today, 7);

    activeEmployees.forEach((employee) => {
        const birthdayDate = anniversaryOccurrence(employee.dateOfBirth, today);
        if (birthdayDate) birthdays.push({ ...employee, occurrenceDate: birthdayDate });

        const joiningDate = dateOnly(employee.joiningDate);
        const anniversaryDate = anniversaryOccurrence(joiningDate, today);
        if (anniversaryDate) {
            const yearsCompleted = Number(anniversaryDate.slice(0, 4)) - Number(joiningDate.slice(0, 4));
            if (yearsCompleted > 0) {
                anniversaries.push({ ...employee, joiningDate, occurrenceDate: anniversaryDate, yearsCompleted });
            }
        }

        if (joiningDate && joiningDate >= today && joiningDate <= newHireEnd) {
            newHires.push({ ...employee, joiningDate });
        }
    });

    birthdays.sort((a, b) => a.occurrenceDate.localeCompare(b.occurrenceDate) || a.fullName.localeCompare(b.fullName));
    anniversaries.sort((a, b) => a.occurrenceDate.localeCompare(b.occurrenceDate) || a.fullName.localeCompare(b.fullName));
    newHires.sort((a, b) => a.joiningDate.localeCompare(b.joiningDate) || a.fullName.localeCompare(b.fullName));
    return { birthdays, anniversaries, newHires };
}

function userName(user) {
    return `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.email || "KHO teammate";
}

async function getDatabaseDate() {
    const [row] = await sequelize.query("SELECT CURRENT_DATE AS today", { type: QueryTypes.SELECT });
    const today = dateOnly(row?.today);
    if (!today) {
        const error = new Error("Unable to determine the database's current date.");
        error.status = 500;
        throw error;
    }
    return today;
}

async function getEmployeeJoinDates(employeeCodes) {
    if (!employeeCodes.length) return new Map();
    const [onboardingRows, infoRows] = await Promise.all([
        Onboarding.findAll({
            where: { employeeCode: { [Op.in]: employeeCodes }, doj: { [Op.not]: null } },
            attributes: ["employeeCode", "doj", "updatedAt"],
            order: [["updatedAt", "DESC"]],
            raw: true,
        }),
        OnboardingInfo.findAll({
            where: { employeeId: { [Op.in]: employeeCodes }, doj: { [Op.not]: null } },
            attributes: ["employeeId", "doj", "updatedAt"],
            order: [["updatedAt", "DESC"]],
            raw: true,
        }),
    ]);

    const joiningDates = new Map();
    [...onboardingRows, ...infoRows].forEach((row) => {
        const code = String(row.employeeCode || row.employeeId || "").trim().toLowerCase();
        const date = dateOnly(row.doj);
        if (code && date && !joiningDates.has(code)) joiningDates.set(code, date);
    });
    return joiningDates;
}

async function serializeEmployees() {
    const records = await Employee.findAll({
        where: { status: { [Op.in]: ACTIVE_EMPLOYEE_STATUSES } },
        attributes: ["id", "employeeCode", "fullName", "email", "jobPosition", "dateOfBirth", "status"],
        raw: true,
    });
    const employeeCodes = [...new Set(records.map((employee) => String(employee.employeeCode || "").trim()).filter(Boolean))];
    const emails = [...new Set(records.map((employee) => String(employee.email || "").trim()).filter(Boolean))];

    const [joiningDates, users] = await Promise.all([
        getEmployeeJoinDates(employeeCodes),
        employeeCodes.length || emails.length
            ? User.findAll({
                where: {
                    isActive: true,
                    [Op.or]: [
                        ...(employeeCodes.length ? [{ employeeRecord: { [Op.in]: employeeCodes } }] : []),
                        ...(emails.length ? [{ email: { [Op.in]: emails } }] : []),
                    ],
                },
                attributes: ["id", "employeeRecord", "email", "profileImage"],
                raw: true,
            })
            : [],
    ]);

    const userByCode = new Map();
    const userByEmail = new Map();
    users.forEach((user) => {
        const code = String(user.employeeRecord || "").trim().toLowerCase();
        const email = String(user.email || "").trim().toLowerCase();
        if (code) userByCode.set(code, user);
        if (email) userByEmail.set(email, user);
    });

    return records.map((employee) => {
        const code = String(employee.employeeCode || "").trim().toLowerCase();
        const email = String(employee.email || "").trim().toLowerCase();
        const user = userByCode.get(code) || userByEmail.get(email);
        return {
            id: employee.id,
            fullName: employee.fullName,
            designation: employee.jobPosition || "Designation not set",
            avatar: user?.profileImage || null,
            dateOfBirth: dateOnly(employee.dateOfBirth),
            joiningDate: joiningDates.get(code) || null,
            status: employee.status,
        };
    });
}

async function getAnnouncementCount(userId) {
    return Notification.count({
        where: {
            userId: Number(userId),
            type: { [Op.in]: ANNOUNCEMENT_NOTIFICATION_TYPES },
            readAt: null,
        },
    });
}

async function listMyGroups(userId) {
    const memberships = await GroupChatMember.findAll({
        where: { userId: Number(userId) },
        attributes: ["groupId"],
        raw: true,
    });
    const groupIds = [...new Set(memberships.map((membership) => Number(membership.groupId)).filter(Number.isInteger))];
    if (!groupIds.length) return [];

    const groups = await GroupChat.findAll({
        where: { id: { [Op.in]: groupIds } },
        attributes: ["id", "name", "profileImage", "createdBy", "createdAt", "updatedAt"],
        include: [
            { model: User, as: "creator", attributes: ["id", "firstName", "lastName", "email"], required: false },
            { model: GroupChatMember, as: "members", attributes: ["id"], required: false },
        ],
        order: [["updatedAt", "DESC"]],
    });
    return groups.map((group) => ({
        id: group.id,
        name: group.name,
        profileImage: group.profileImage,
        creatorName: userName(group.creator),
        memberCount: (group.members || []).length,
    }));
}

async function getCommonWall(user) {
    const userId = Number(user?.id);
    if (!Number.isInteger(userId) || userId < 1) {
        const error = new Error("A signed-in user is required.");
        error.status = 401;
        throw error;
    }

    const today = await getDatabaseDate();
    const [tasks, groups, openings, employees, announcementCount] = await Promise.all([
        Task.findAll({
            where: { assignedToId: userId, dueDate: today },
            attributes: ["id", "title", "dueDate", "dueTime", "status"],
            order: [["dueTime", "ASC"], ["id", "ASC"]],
        }),
        listMyGroups(userId),
        Opening.findAll({
            where: { isActive: true },
            attributes: ["jobid", "jobTitle", "openingCount", "createdAt"],
            include: [{ model: Department, as: "department", attributes: ["name"], required: false }],
            order: [["createdAt", "DESC"]],
        }),
        serializeEmployees(),
        getAnnouncementCount(userId),
    ]);

    const employeeSections = buildEmployeeSections(employees, today);
    return {
        today,
        tasks: tasks.map((task) => task.toJSON()),
        groups,
        openings: openings.map((opening) => ({
            id: opening.jobid,
            jobTitle: opening.jobTitle,
            department: opening.department?.name || "Department not set",
            openingCount: opening.openingCount,
        })),
        ...employeeSections,
        announcementCount,
    };
}

module.exports = { getCommonWall, getAnnouncementCount, buildEmployeeSections };
