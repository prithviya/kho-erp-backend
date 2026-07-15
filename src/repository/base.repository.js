class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        return await this.model.create(data);
    }

    async findAll(options = {}) {
        return await this.model.findAll(options);
    }

    async findOne(options = {}) {
        return await this.model.findOne(options);
    }

    async findById(id, options = {}) {
        return await this.model.findByPk(id, options);
    }

    async update(id, data) {
        await this.model.update(data, {
            where: { id }
        });

        return this.findById(id);
    }

    async delete(id) {
        return await this.model.destroy({
            where: { id }
        });
    }

    async count(where = {}) {
        return await this.model.count({
            where
        });
    }
}

module.exports = BaseRepository;