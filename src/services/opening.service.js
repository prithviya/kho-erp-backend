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

        // Get count to generate sequence
        const existingOpenings = await repository.findByDepartmentId(data.departmentId);
        const sequence = existingOpenings.length + 1;
        const formattedSequence = String(sequence).padStart(3, "0");
        
        data.code = `${prefix}-${formattedSequence}`;

        const existingOpening = await repository.findByCode(data.code);

        if (existingOpening) {
            throw new Error("Opening code already exists.");
        }

        return await super.create(data);
    }

    async getAll() {
        return await repository.findAll();
    }

    async getById(id) {
        const opening = await repository.findById(id);

        if (!opening) {
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