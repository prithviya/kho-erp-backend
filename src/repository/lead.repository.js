const BaseRepository = require("./base.repository");
const {
    Lead,
    LeadSource,
    LeadStatus,
    User,
    Service,
    ServiceCategory,
    LeadHistory
} = require("../model");
class LeadRepository extends BaseRepository {
    constructor() {
        super(Lead);
    }
    async getAll(filters = {}) {
        const where = {};
        if (filters.search) {
            where.companyName = {
                [require("sequelize").Op.like]: `%${filters.search}%`
            };
        }
        if (filters.leadStatusId)
            where.leadStatusId = filters.leadStatusId;
        if (filters.leadSourceId)
            where.leadSourceId = filters.leadSourceId;
        if (filters.assignedTo)
            where.assignedTo = filters.assignedTo;
        return await this.model.findAll({
            where,
            include: [
                {
                    model: LeadSource,
                    as: "leadSource"
                },
                {
                    model: LeadStatus,
                    as: "leadStatus"
                },
                {
                    model: User,
                    as: "assignedUser",
                    attributes: [
                        "id",
                        "firstName",
                        "lastName",
                        "email"
                    ]
                },
                {
                    model: Service,
                    as: "services",
                    through: {
                        attributes: []
                    },
                    include: [{
                        model: ServiceCategory,
                        as: "category"
                    }]
                }
            ],
            order: [["createdAt", "DESC"]]
        });
    }
    async getById(id) {
        return await this.model.findByPk(id, {
            include: [
                {
                    model: LeadSource,
                    as: "leadSource"
                },
                {
                    model: LeadStatus,
                    as: "leadStatus"
                },
                {
                    model: User,
                    as: "assignedUser",
                    attributes: [
                        "id",
                        "firstName",
                        "lastName",
                        "email"
                    ]
                },
                {
                    model: Service,
                    as: "services",
                    through: {
                        attributes: []
                    },
                    include: [
                        {
                            model: ServiceCategory,
                            as: "category"
                        }
                    ]
                },
                {
                    model: LeadHistory,
                    as: "history",
                    include: [
                        {
                            model: User,
                            as: "changedUser",
                            attributes: [
                                "id",
                                "firstName",
                                "lastName"
                            ]
                        }
                    ]
                }
            ]
        });
    }
    async updateLead(id, data) {
        await this.model.update(data, {
            where: { id }
        });
        return this.getById(id);
    }
    async assignServices(lead, serviceIds) {
        await lead.setServices(serviceIds);
    }
    async deleteLead(id) {
        return await this.model.destroy({
            where: { id }
        });
    }
}
module.exports = new LeadRepository();