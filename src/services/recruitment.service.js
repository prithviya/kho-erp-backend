const BaseService = require("./base.service");
const repository = require("../repository/recruitment.repository");

class RecruitmentService extends BaseService {
    constructor() {
        super(repository);
    }

    async create(data) {
        if (!data.cifid) {
            throw new Error("CIF ID is required.");
        }

        const existingRecruitment = await repository.findByCifId(data.cifid);

        if (existingRecruitment) {
            return await this.update(existingRecruitment.rid, data);
        }

        return await super.create(data);
    }

    async getAll() {
        return await repository.findAll();
    }

    async getById(id) {
        const recruitment = await repository.findById(id);

        if (!recruitment) {
            throw new Error("Recruitment record not found.");
        }

        return recruitment;
    }

    async getByCifId(cifid) {
        const recruitment = await repository.findByCifId(cifid);

        if (!recruitment) {
            throw new Error("Recruitment record not found for this CIF.");
        }

        return recruitment;
    }

    async update(id, data) {
        const recruitment = await this.getById(id);

        if (data.cifid && data.cifid !== recruitment.cifid) {
            const existingRecruitment = await repository.findByCifId(data.cifid);

            if (existingRecruitment && existingRecruitment.rid !== recruitment.rid) {
                throw new Error("Recruitment already exists for this CIF.");
            }
        }

        return await repository.update(id, data);
    }

    async delete(id) {
        const recruitment = await this.getById(id);

        if (!recruitment) {
            throw new Error("Recruitment record not found.");
        }

        return await repository.delete(id);
    }
}

module.exports = new RecruitmentService();
