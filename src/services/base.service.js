class BaseService {

    constructor(repository) {
        this.repository = repository;
    }

    
    async create(data) {
        return await this.repository.create(data);
    }

    async findAll(options = {}) {
        return await this.repository.findAll(options);
    }

    async findById(id) {
        return await this.repository.findById(id);
    }

    async update(id, data) {

        const record = await this.findById(id);

        if (!record) {
            throw new Error("Record not found.");
        }

        await record.update(data);

        return record;
    }

    async delete(id) {

        const record = await this.findById(id);

        if (!record) {
            throw new Error("Record not found.");
        }

        await record.destroy();

        return true;
    }

}

module.exports = BaseService;