const BaseRepository = require("./base.repository");
const { ServiceCategory, Service } = require("../model");
class ServiceCategoryRepository extends BaseRepository {
    constructor() {
        super(ServiceCategory);
    }
    async findByCode(code) {
        return await this.model.findOne({
            where: { code }
        });
    }
    async findByName(name) {
        return await this.model.findOne({
            where: { name }
        });
    }
    async getWithServices() {
        return await this.model.findAll({
            include: [{
                model: Service,
                as: "services",
                where: {
                    isActive: true
                },
                required: false
            }],
            order: [
                ["displayOrder", "ASC"],
                [{ model: Service, as: "services" }, "displayOrder", "ASC"]
            ]
        });
    }
}
module.exports = new ServiceCategoryRepository();