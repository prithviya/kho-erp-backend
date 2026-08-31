const BaseService = require("./base.service");
const repository = require("../repository/cifPersonal.repository");

class CifPersonalService extends BaseService {
    constructor() {
        super(repository);
    }

    async create(data) {
        if (!data.fullName) {
            throw new Error("Full name is required.");
        }

        if (!data.email) {
            throw new Error("Email is required.");
        }

        if (!data.phoneNumber) {
            throw new Error("Phone number is required.");
        }

        const existingEmail = await repository.findByEmail(data.email);

        if (existingEmail) {
            throw new Error("Email already exists.");
        }

        const existingPhone = await repository.findByPhoneNumber(
            data.phoneNumber
        );

        if (existingPhone) {
            throw new Error("Phone number already exists.");
        }

        return await super.create(data);
    }

    async getAll() {
        return await repository.findAll();
    }

    async getById(id) {
        const cifPersonal = await repository.findById(id);

        if (!cifPersonal) {
            throw new Error("CIF Personal not found.");
        }

        return cifPersonal;
    }

    async update(id, data) {
        const cifPersonal = await repository.findById(id);

        if (!cifPersonal) {
            throw new Error("CIF Personal not found.");
        }

        if (data.email && data.email !== cifPersonal.email) {
            const existingEmail = await repository.findByEmail(
                data.email
            );

            if (existingEmail) {
                throw new Error("Email already exists.");
            }
        }

        if (
            data.phoneNumber &&
            data.phoneNumber !== cifPersonal.phoneNumber
        ) {
            const existingPhone =
                await repository.findByPhoneNumber(
                    data.phoneNumber
                );

            if (existingPhone) {
                throw new Error("Phone number already exists.");
            }
        }

        return await repository.update(id, data);
    }

    async delete(id) {
        const cifPersonal = await repository.findById(id);

        if (!cifPersonal) {
            throw new Error("CIF Personal not found.");
        }

        return await repository.delete(id);
    }
}

module.exports = new CifPersonalService();