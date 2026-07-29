const BaseRepository = require("./base.repository");
const { Service, ServiceCategory } = require("../model");
class ServiceRepository extends BaseRepository {
    constructor() {
        super(Service);
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
    async getByCategory(categoryId) {
        return await this.model.findAll({
            where: {
                serviceCategoryId: categoryId
            },
            include: [{
                model: ServiceCategory,
                as: "category"
            }],
            order: [["displayOrder", "ASC"]]
        });
    }
}
module.exports = new ServiceRepository();