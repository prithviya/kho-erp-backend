const path = require("path");
const {
    Employee,
    User,
    Onboarding,
    OnboardingInfo,
    OnboardingRecord,
    LeaveRequest,
} = require("../model");
const repository = require("../repository/employee.repository");
const { normalizeEmployeeCode } = require("../helpers/employeeCode");

class EmployeeService {
    parseJsonArray(value) {
        if (Array.isArray(value)) return value;
        if (!value) return [];

        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    normalizeString(value) {
        return typeof value === "string" ? value.trim() : "";
    }

    normalizePayload(data, file) {
        return {
            employeeCode: normalizeEmployeeCode(data.employeeCode),
            jobPosition: this.normalizeString(data.jobPosition),
            fullName: this.normalizeString(data.fullName),
            email: this.normalizeString(data.email).toLowerCase(),
            phone: this.normalizeString(data.phone),
            dateOfBirth: data.dateOfBirth || null,
            city: this.normalizeString(data.city) || null,
            pinCode: this.normalizeString(data.pinCode) || null,
            gender: this.normalizeString(data.gender) || null,
            portfolioLink: this.normalizeString(data.portfolioLink) || null,
            education: this.parseJsonArray(data.education),
            workExperience: this.parseJsonArray(data.workExperience),
            skills: this.parseJsonArray(data.skills),
            softwareTools: this.parseJsonArray(data.softwareTools),
            languages: this.parseJsonArray(data.languages),
            references: this.parseJsonArray(data.references),
            consent: String(data.consent) === "true" || data.consent === true,
            status: this.normalizeString(data.status) || "Onboarding",
            resumeOriginalName: file?.originalname || null,
            resumeStoredName: file?.filename || null,
            resumeMimeType: file?.mimetype || null,
            resumeSize: file?.size || null,
        };
    }

    async generateEmployeeCode() {
        const [employees, onboardings, onboardingInfos] = await Promise.all([
            Employee.findAll({ attributes: ["employeeCode"], paranoid: false }),
            Onboarding.findAll({ attributes: ["employeeCode"], paranoid: false }),
            OnboardingInfo.findAll({ attributes: ["employeeId"], paranoid: false }),
        ]);
        const maxNumber = [
            ...employees.map((employee) => employee.employeeCode),
            ...onboardings.map((onboarding) => onboarding.employeeCode),
            ...onboardingInfos.map((info) => info.employeeId),
        ].reduce((maxValue, rawCode) => {
            const match = String(rawCode || "")
                .trim()
                .toUpperCase()
                .match(/^KHO-?(\d+)$/);
            const number = match ? Number.parseInt(match[1], 10) : 0;
            return Number.isSafeInteger(number) ? Math.max(maxValue, number) : maxValue;
        }, 0);

        return `KHO${String(maxNumber + 1).padStart(3, "0")}`;
    }

    toResponse(employee) {
        const plain = typeof employee?.toJSON === "function" ? employee.toJSON() : employee;
        return {
            ...plain,
            resumeUrl: plain?.resumeStoredName ? `/uploads/${plain.resumeStoredName}` : null,
        };
    }

    async createEmployee(data, file, userId = null) {
        const payload = this.normalizePayload(data, file);

        if (!payload.fullName) throw new Error("Full name is required.");
        if (!payload.email) throw new Error("Email is required.");
        if (!payload.phone) throw new Error("Phone number is required.");
        if (!payload.jobPosition) throw new Error("Job position is required.");
        if (!payload.consent) throw new Error("Consent is required.");

        const existingEmail = await repository.findByEmail(payload.email);
        if (existingEmail) throw new Error("Employee email already exists.");

        let created;
        for (let attempt = 0; attempt < 3; attempt += 1) {
            const employeeCode = await this.generateEmployeeCode();
            try {
                created = await repository.create({
                    ...payload,
                    employeeCode,
                    createdBy: userId || null,
                });
                break;
            } catch (error) {
                const isDuplicateCode = error?.name === "SequelizeUniqueConstraintError"
                    || error?.parent?.code === "ER_DUP_ENTRY"
                    || error?.original?.code === "ER_DUP_ENTRY"
                    || error?.parent?.code === "23505"
                    || error?.original?.code === "23505";
                if (!isDuplicateCode || attempt === 2) {
                    throw error;
                }
            }
        }

        return this.toResponse(created);
    }

    async getEmployees(search = "") {
        const employees = await repository.getEmployees(search);
        return employees.map((employee) => this.toResponse(employee));
    }

    async getEmployeeProfile(user) {
        const employee = await repository.findForUser({
            email: this.normalizeString(user?.email).toLowerCase(),
            employeeCode: normalizeEmployeeCode(this.normalizeString(user?.employeeRecord)),
        });

        return employee ? this.toResponse(employee) : null;
    }

    async getEmployeeById(id) {
        const employee = await repository.getEmployeeById(id);
        if (!employee) throw new Error("Employee not found.");
        return this.toResponse(employee);
    }

    async updateEmployee(id, data, file) {
        const employee = await repository.getEmployeeById(id);
        if (!employee) throw new Error("Employee not found.");

        const payload = this.normalizePayload(data, file);
        if (!payload.employeeCode) throw new Error("Employee ID is required.");
        if (!payload.fullName) throw new Error("Full name is required.");
        if (!payload.email) throw new Error("Email is required.");
        if (!payload.phone) throw new Error("Phone number is required.");
        if (!payload.jobPosition) throw new Error("Job position is required.");

        const existingEmployeeCode = await repository.findByEmployeeCodeExcluding(
            payload.employeeCode,
            id
        );
        if (existingEmployeeCode) {
            const error = new Error("Employee ID already exists.");
            error.status = 409;
            throw error;
        }

        const existingEmail = await repository.findByEmail(payload.email, id);
        if (existingEmail) {
            const error = new Error("Employee email already exists.");
            error.status = 409;
            throw error;
        }

        const updatePayload = {
            employeeCode: payload.employeeCode,
            jobPosition: payload.jobPosition,
            fullName: payload.fullName,
            email: payload.email,
            phone: payload.phone,
            dateOfBirth: payload.dateOfBirth,
            city: payload.city,
            pinCode: payload.pinCode,
            gender: payload.gender,
            portfolioLink: payload.portfolioLink,
            education: payload.education,
            workExperience: payload.workExperience,
            skills: payload.skills,
            softwareTools: payload.softwareTools,
            languages: payload.languages,
            references: payload.references,
            consent: payload.consent,
            status: payload.status,
        };

        if (file) {
            updatePayload.resumeOriginalName = payload.resumeOriginalName;
            updatePayload.resumeStoredName = payload.resumeStoredName;
            updatePayload.resumeMimeType = payload.resumeMimeType;
            updatePayload.resumeSize = payload.resumeSize;
        }

        const updated = await repository.update(id, updatePayload);

        const onboardingInfo = await OnboardingInfo.findOne({
            where: { employeeId: employee.employeeCode },
        });
        if (onboardingInfo) {
            const onboardingUpdate = { employeeId: payload.employeeCode };
            if (data.joiningDate !== undefined) onboardingUpdate.doj = data.joiningDate || null;
            if (data.salary !== undefined) onboardingUpdate.salary = this.normalizeString(data.salary) || null;
            if (data.designation !== undefined) onboardingUpdate.designation = this.normalizeString(data.designation) || null;
            if (data.departmentId !== undefined && data.departmentId !== "") {
                const departmentId = Number(data.departmentId);
                if (Number.isInteger(departmentId) && departmentId > 0) {
                    onboardingUpdate.department = departmentId;
                }
            }
            await onboardingInfo.update(onboardingUpdate);
        }

        if (employee.employeeCode !== payload.employeeCode) {
            await Promise.all([
                User.update(
                    { employeeRecord: payload.employeeCode },
                    { where: { employeeRecord: employee.employeeCode } }
                ),
                Onboarding.update(
                    { employeeCode: payload.employeeCode },
                    { where: { employeeCode: employee.employeeCode } }
                ),
                LeaveRequest.update(
                    { employeeCode: payload.employeeCode },
                    { where: { employeeCode: employee.employeeCode } }
                ),
            ]);

            const records = await OnboardingRecord.findAll();
            for (const record of records) {
                const updates = {};
                for (const column of ["formData", "experienceDetails", "educationDetails"]) {
                    if (record[column] === null || record[column] === undefined) continue;
                    const parsed = typeof record[column] === "string"
                        ? JSON.parse(record[column])
                        : record[column];
                    const normalized = this.replaceEmployeeCodeReferences(
                        parsed,
                        employee.employeeCode,
                        payload.employeeCode
                    );
                    if (JSON.stringify(normalized) !== JSON.stringify(parsed)) {
                        updates[column] = JSON.stringify(normalized);
                    }
                }
                if (Object.keys(updates).length > 0) {
                    await record.update(updates);
                }
            }
        }

        return this.toResponse(updated);
    }

    replaceEmployeeCodeReferences(value, oldCode, newCode) {
        if (Array.isArray(value)) {
            return value.map((item) => this.replaceEmployeeCodeReferences(item, oldCode, newCode));
        }
        if (!value || typeof value !== "object") {
            return value;
        }

        return Object.fromEntries(
            Object.entries(value).map(([key, item]) => {
                if (
                    ["employeeId", "employeeID", "employeeCode", "employeeRecord"].includes(key)
                    && item === oldCode
                ) {
                    return [key, newCode];
                }
                return [key, this.replaceEmployeeCodeReferences(item, oldCode, newCode)];
            })
        );
    }

    async deleteEmployee(id) {
        const employee = await repository.getEmployeeById(id);
        if (!employee) throw new Error("Employee not found.");
        await repository.delete(id);
        return true;
    }
}

module.exports = new EmployeeService();