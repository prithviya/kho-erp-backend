const { Op } = require("sequelize");
const db = require("../model");

function toNumber(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function calculateNetSalary(grossSalary, lopDays, workingDays) {
    const safeWorkingDays = Math.max(toNumber(workingDays, 30), 1);
    const result = Math.max(grossSalary - (grossSalary / safeWorkingDays) * lopDays, 0);
    return Number(result.toFixed(2));
}

class PayrollService {
    buildWhere(filters = {}) {
        const where = {};
        const employeeId = Number(filters.employeeId || 0);
        const month = Number(filters.month || 0);
        const year = Number(filters.year || 0);

        if (employeeId) where.employeeId = employeeId;
        if (month) where.month = month;
        if (year) where.year = year;
        if (filters.status) where.status = String(filters.status);

        if (filters.fromYear && filters.toYear) {
            const fromYear = Number(filters.fromYear);
            const toYear = Number(filters.toYear);
            if (fromYear > 0 && toYear >= fromYear) {
                where.year = { [Op.between]: [fromYear, toYear] };
            }
        }

        return where;
    }

    async list(filters = {}) {
        return db.Payroll.findAll({
            where: this.buildWhere(filters),
            include: [
                {
                    model: db.Employee,
                    as: "employee",
                    attributes: ["id", "employeeCode", "fullName", "email", "jobPosition"],
                },
            ],
            order: [["year", "DESC"], ["month", "DESC"], ["id", "DESC"]],
        });
    }

    async getById(id) {
        return db.Payroll.findByPk(id, {
            include: [
                {
                    model: db.Employee,
                    as: "employee",
                    attributes: ["id", "employeeCode", "fullName", "email", "jobPosition"],
                },
            ],
        });
    }

    async create(payload = {}, actorId = null) {
        const employeeId = Number(payload.employeeId || 0);
        const month = Number(payload.month || 0);
        const year = Number(payload.year || 0);

        if (!employeeId || !month || !year) {
            const error = new Error("employeeId, month and year are required.");
            error.status = 400;
            throw error;
        }

        const employee = await db.Employee.findByPk(employeeId);
        if (!employee) {
            const error = new Error("Employee not found.");
            error.status = 404;
            throw error;
        }

        const existing = await db.Payroll.findOne({ where: { employeeId, month, year } });
        if (existing) {
            const error = new Error("Payroll already exists for this employee, month and year.");
            error.status = 409;
            throw error;
        }

        const grossSalary = toNumber(payload.grossSalary);
        const lopDays = toNumber(payload.lopDays);
        const workingDays = toNumber(payload.workingDays, 30);
        const computedNet = calculateNetSalary(grossSalary, lopDays, workingDays);

        const record = await db.Payroll.create({
            employeeId,
            month,
            year,
            grossSalary,
            lopDays,
            workingDays,
            netSalary: payload.netSalary !== undefined ? toNumber(payload.netSalary) : computedNet,
            status: payload.status || "Draft",
            paidAt: payload.paidAt || null,
            createdBy: actorId || null,
        });

        return this.getById(record.id);
    }

    async update(id, payload = {}) {
        const existing = await db.Payroll.findByPk(id);
        if (!existing) {
            return null;
        }

        const nextEmployeeId = payload.employeeId !== undefined
            ? Number(payload.employeeId || 0)
            : Number(existing.employeeId);
        const nextMonth = payload.month !== undefined
            ? Number(payload.month || 0)
            : Number(existing.month);
        const nextYear = payload.year !== undefined
            ? Number(payload.year || 0)
            : Number(existing.year);

        if (!nextEmployeeId || !nextMonth || !nextYear) {
            const error = new Error("employeeId, month and year must be valid values.");
            error.status = 400;
            throw error;
        }

        const dup = await db.Payroll.findOne({
            where: {
                employeeId: nextEmployeeId,
                month: nextMonth,
                year: nextYear,
                id: { [Op.ne]: existing.id },
            },
        });

        if (dup) {
            const error = new Error("Payroll already exists for this employee, month and year.");
            error.status = 409;
            throw error;
        }

        const grossSalary = payload.grossSalary !== undefined
            ? toNumber(payload.grossSalary)
            : toNumber(existing.grossSalary);
        const lopDays = payload.lopDays !== undefined
            ? toNumber(payload.lopDays)
            : toNumber(existing.lopDays);
        const workingDays = payload.workingDays !== undefined
            ? toNumber(payload.workingDays, 30)
            : toNumber(existing.workingDays, 30);
        const computedNet = calculateNetSalary(grossSalary, lopDays, workingDays);

        await existing.update({
            employeeId: nextEmployeeId,
            month: nextMonth,
            year: nextYear,
            grossSalary,
            lopDays,
            workingDays,
            netSalary: payload.netSalary !== undefined ? toNumber(payload.netSalary) : computedNet,
            status: payload.status !== undefined ? payload.status : existing.status,
            paidAt: payload.paidAt !== undefined ? payload.paidAt : existing.paidAt,
        });

        return this.getById(existing.id);
    }

    async remove(id) {
        const existing = await db.Payroll.findByPk(id);
        if (!existing) {
            return false;
        }

        await existing.destroy();
        return true;
    }
}

module.exports = new PayrollService();
