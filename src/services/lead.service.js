const { sequelize, Lead, LeadHistory } = require("../model");
const leadRepository = require("../repository/lead.repository");

function normalizePhone(phone, phoneCountryCode) {
    const phoneDigits = String(phone || "").replace(/\D/g, "");
    const countryCodeDigits = String(phoneCountryCode || "").replace(/\D/g, "");
    const nationalDigits = countryCodeDigits && phoneDigits.startsWith(countryCodeDigits)
        ? phoneDigits.slice(countryCodeDigits.length)
        : phoneDigits;

    return {
        phone: nationalDigits,
        phoneCountryCode: countryCodeDigits ? `+${countryCodeDigits}` : null,
    };
}

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
            const phone = normalizePhone(data.phone, data.phoneCountryCode);
            // Create Lead
            const lead = await Lead.create({
                companyName: data.companyName,
                salutation: data.salutation,
                contactPerson: data.contactPerson,
                phone: phone.phone,
                phoneCountryCode: phone.phoneCountryCode,
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
                newStatusId: data.leadStatusId || 1,
                newFollowupDate: data.nextFollowupDate || null,
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

            const phone = data.phone !== undefined
                ? normalizePhone(data.phone, data.phoneCountryCode)
                : null;
            const oldStatusId = lead.leadStatusId;
            const nextStatusId = data.leadStatusId ?? oldStatusId;
            const oldFollowupDate = lead.nextFollowupDate ? String(lead.nextFollowupDate) : "";
            const nextFollowupDate = data.nextFollowupDate !== undefined
                ? (data.nextFollowupDate ? String(data.nextFollowupDate) : "")
                : oldFollowupDate;
            const statusChanged = Number(oldStatusId) !== Number(nextStatusId);
            const followupChanged = oldFollowupDate !== nextFollowupDate;
            const changeReason = String(data.changeReason || "").trim();

            if (access.requireAssignedUser) {
                this.assertLeadOwnership(lead, access.userId);
            }

            // Update Lead
            await lead.update({
                companyName: data.companyName,
                salutation: data.salutation,
                contactPerson: data.contactPerson,
                ...(phone || {}),
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
            if (statusChanged || followupChanged || changeReason) {
                await LeadHistory.create({
                    leadId: lead.id,
                    oldStatusId,
                    newStatusId: nextStatusId,
                    oldFollowupDate: followupChanged ? (oldFollowupDate || null) : null,
                    newFollowupDate: followupChanged ? (nextFollowupDate || null) : null,
                    notes: changeReason || (statusChanged
                        ? "Lead status changed"
                        : followupChanged
                            ? "Next follow-up date changed"
                            : "Lead details updated"),
                    changedBy: userId
                }, { transaction });
            }

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