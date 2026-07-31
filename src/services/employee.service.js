const path = require("path");
const { Employee } = require("../model");
const repository = require("../repository/employee.repository");

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
        const count = await Employee.count({ paranoid: false });
        return `EMP-${String(count + 1).padStart(4, "0")}`;
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

        const employeeCode = await this.generateEmployeeCode();
        const created = await repository.create({
            ...payload,
            employeeCode,
            createdBy: userId || null,
        });

        return this.toResponse(created);
    }

    async getEmployees(search = "") {
        const employees = await repository.getEmployees(search);
        return employees.map((employee) => this.toResponse(employee));
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
        const existingEmail = await repository.findByEmail(payload.email, id);
        if (existingEmail) throw new Error("Employee email already exists.");

        const updatePayload = {
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
        return this.toResponse(updated);
    }
}

module.exports = new EmployeeService();