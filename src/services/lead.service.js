const { sequelize, Lead, LeadHistory } = require("../model");
const leadRepository = require("../repository/lead.repository");
class LeadService {
    async getAll(filters = {}) {
        return await leadRepository.getAll(filters);
    }
    assertLeadOwnership(lead, userId) {
        if (!lead || Number(lead.assignedTo) !== Number(userId)) {
            const error = new Error("You can only access leads assigned to you.");
            error.status = 403;
            throw error;
        }
    }

    async getById(id, access = {}) {
        const lead = await leadRepository.getById(id);
        if (!lead) throw new Error("Lead not found.");

        if (access.requireAssignedUser) {
            this.assertLeadOwnership(lead, access.userId);
        }

        return lead;
    }
    async createLead(data, userId) {
        const transaction = await sequelize.transaction();
        try {
            // Create Lead
            const lead = await Lead.create({
                companyName: data.companyName,
                contactPerson: data.contactPerson,
                phone: data.phone,
                email: data.email,
                requirement: data.requirement,
                budget: data.budget,
                leadSourceId: data.leadSourceId,
                leadStatusId: 1,
                assignedTo: data.assignedTo,
                referralName: data.referralName,
                notes: data.notes,
                nextFollowupDate: data.nextFollowupDate
            }, { transaction });
            // Map Services
            if (data.serviceIds?.length > 0) {
                await lead.setServices(data.serviceIds, {
                    transaction
                });
            }
            // Lead History
            await LeadHistory.create({
                leadId: lead.id,
                oldStatusId: null,
                newStatusId: data.leadStatusId,
                notes: "Lead Created",
                changedBy: userId
            }, { transaction });
            await transaction.commit();
            return await leadRepository.getById(lead.id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async updateLead(id, data, userId, access = {}) {
        const transaction = await sequelize.transaction();
        try {
            const lead = await Lead.findByPk(id, { transaction });
            if (!lead) throw new Error("Lead not found.");

            if (access.requireAssignedUser) {
                this.assertLeadOwnership(lead, access.userId);
            }

            // Update Lead
            await lead.update({
                companyName: data.companyName,
                contactPerson: data.contactPerson,
                phone: data.phone,
                email: data.email,
                requirement: data.requirement,
                budget: data.budget,
                leadSourceId: data.leadSourceId,
                leadStatusId: data.leadStatusId,
                assignedTo: data.assignedTo,
                referralName: data.referralName,
                notes: data.notes,
                nextFollowupDate: data.nextFollowupDate
            }, { transaction });

            // Map Services
            if (data.serviceIds?.length > 0) {
                await lead.setServices(data.serviceIds, {
                    transaction
                });
            }

            // Lead History
            await LeadHistory.create({
                leadId: lead.id,
                oldStatusId: lead._previousDataValues.leadStatusId,
                newStatusId: data.leadStatusId,
                notes: "Lead Updated",
                changedBy: userId
            }, { transaction });

            await transaction.commit();
            return await leadRepository.getById(lead.id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async deleteLead(id) {
        return await leadRepository.deleteLead(id);
    }

}
module.exports = new LeadService();