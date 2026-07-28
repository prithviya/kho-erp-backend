const BaseRepository = require("./base.repository");
const { Service } = require("../model");

class ServiceRepository extends BaseRepository {

    constructor() {
        super(Service);
    }

    // Find service by serviceid
    async findByDept(serviceid) {
        return await Service.findOne({
            where: { serviceid }
        });
    }

    // Find service by name
    async findByName(serviceName) {
        return await Service.findOne({
            where: { serviceName }
        });
    }

    // Find all services by department
    async findAllByDepartment(departmentId) {
        return await Service.findAll({
            where: { departmentId },
            order: [['serviceName', 'ASC']]
        });
    }

    // Find active services
    async findActiveServices() {
        return await Service.findAll({
            where: { status: 'active' },
            order: [['serviceName', 'ASC']]
        });
    }

    // Find services by category
    async findByCategory(category) {
        return await Service.findAll({
            where: { category },
            order: [['serviceName', 'ASC']]
        });
    }

    // Find services with price range
    async findByPriceRange(minPrice, maxPrice) {
        return await Service.findAll({
            where: {
                price: {
                    [Op.between]: [minPrice, maxPrice]
                }
            },
            order: [['price', 'ASC']]
        });
    }

    // Count services by department
    async countByDepartment(departmentId) {
        return await Service.count({
            where: { departmentId }
        });
    }

    // Find services with department details
    async findAllWithDepartment() {
        return await Service.findAll({
            include: [{
                model: Department,
                attributes: ['id', 'departmentName', 'departid']
            }],
            order: [['serviceName', 'ASC']]
        });
    }

    // Add this if you need to check usage before deletion
    // async countServiceUsage(serviceId) {
    //   return await EmployeeService.count({
    //     where: { serviceId }
    //   });
    // }
}

module.exports = new ServiceRepository();