const BaseService = require("./base.service");
const repository = require("../repository/opening.repository");
const departmentRepository = require("../repository/department.repository");

class OpeningService extends BaseService {
    constructor() {
        super(repository);
    }

    async create(data) {
        if (!data.jobTitle) {
            throw new Error("Job title is required.");
        }

        if (!data.departmentId) {
            throw new Error("Department is required.");
        }

        const department = await departmentRepository.getById(data.departmentId);
        if (!department) {
            throw new Error("Department not found.");
        }

        // Generate Prefix
        const deptName = department.name.trim();
        const words = deptName.split(/\s+/);
        let prefix = "";
        if (words.length >= 2) {
            prefix = (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
        } else if (words.length === 1) {
            prefix = words[0].substring(0, 2).toUpperCase();
        }

        // Include soft-deleted openings so a unique code is never reused.
        const existingOpenings = await repository.findByDepartmentId(
            data.departmentId,
            { paranoid: false }
        );
        const highestSequence = existingOpenings.reduce((highest, opening) => {
            const match = opening.code && opening.code.match(/^.+-(\d+)$/);
            return match ? Math.max(highest, Number(match[1])) : highest;
        }, 0);

        let opening;
        for (let sequence = highestSequence + 1; sequence < highestSequence + 1000; sequence += 1) {
            data.code = `${prefix}-${String(sequence).padStart(3, "0")}`;

            try {
                opening = await super.create(data);
                break;
            } catch (error) {
                if (error.name !== "SequelizeUniqueConstraintError" || error.fields?.code === undefined) {
                    throw error;
                }
            }
        }

        if (!opening) {
            const error = new Error("Unable to generate a unique opening code.");
            error.status = 409;
            throw error;
        }

        const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");

        opening.jobOpeningUrl = `${frontendUrl}/cif-form?jobid=${opening.jobid}`;
        await opening.save();

        return opening;
    }

    async getAll() {
        return await repository.findAll();
    }

    async getPublicAll() {
        return await repository.findActive();
    }

    async getById(id) {
        const opening = await repository.findById(id);

        if (!opening) {
            throw new Error("Opening not found.");
        }

        return opening;
    }

    async getPublicById(id) {
        const opening = await repository.findById(id);

        if (!opening || !opening.isActive) {
            throw new Error("Opening not found.");
        }

        return opening;
    }

    async update(id, data) {
        const opening = await repository.findById(id);

        if (!opening) {
            throw new Error("Opening not found.");
        }

        if (data.code && data.code !== opening.code) {
            const existingOpening = await repository.findByCode(
                data.code
            );

            if (existingOpening) {
                throw new Error("Opening code already exists.");
            }
        }

        return await repository.update(id, data);
    }

    async delete(id) {
        const opening = await repository.findById(id);

        if (!opening) {
            throw new Error("Opening not found.");
        }

        return await repository.delete(id);
    }

    // ✅ ADD THIS METHOD
    async updateStatus(id, isActive) {
        const opening = await repository.findById(id);

        if (!opening) {
            throw new Error("Opening not found.");
        }

        return await repository.update(id, { isActive });
    }
}

module.exports = new OpeningService();