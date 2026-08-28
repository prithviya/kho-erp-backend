const { User, Lead, LeadStatus, Role, Opening } = require("../model");

class DashboardService {
    async getOverview() {
        const statuses = await LeadStatus.findAll({
            attributes: ["id", "name", "code"]
        });

        const convertedStatusIds = statuses
            .filter((status) => {
                const code = String(status.code || "").toLowerCase();
                const name = String(status.name || "").toLowerCase();
                return code === "converted" || name === "converted";
            })
            .map((status) => status.id);

        const [activeUsers, recentLeads, totalLeads, activeUsersCount, openings] = await Promise.all([
            User.findAll({
                where: { isActive: true },
                attributes: ["id", "firstName", "lastName", "email", "isActive", "updatedAt"],
                include: [
                    {
                        model: Role,
                        as: "roles",
                        attributes: ["id", "name"]
                    }
                ],
                order: [["updatedAt", "DESC"]],
                limit: 5
            }),
            Lead.findAll({
                where: { isActive: true },
                attributes: ["id", "companyName", "contactPerson", "budget", "createdAt"],
                include: [
                    {
                        model: LeadStatus,
                        as: "leadStatus",
                        attributes: ["id", "name", "code", "color"]
                    }
                ],
                order: [["createdAt", "DESC"]],
                limit: 5
            }),
            Lead.count({ where: { isActive: true } }),
            User.count({ where: { isActive: true } }),
            Opening.findAll({
                where: { isActive: true },
                attributes: ["jobid", "jobTitle", "requiredSkills", "minExperience", "openingCount"],
                limit: 5,
                order: [["createdAt", "DESC"]]
            })
        ]);

        const convertedDeals = convertedStatusIds.length
            ? await Lead.count({
                where: {
                    isActive: true,
                    leadStatusId: convertedStatusIds
                }
            })
            : 0;

        return {
            stats: {
                totalLeads,
                recentLeads: recentLeads.length,
                convertedDeals,
                activeUsers: activeUsersCount
            },
            activeUsers: activeUsers.map((user) => ({
                id: user.id,
                name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
                email: user.email,
                role: user.roles && user.roles.length > 0 ? user.roles[0].name : "N/A",
                status: user.isActive ? "Active" : "Inactive"
            })),
            recentLeads: recentLeads.map((lead) => ({
                id: lead.id,
                company: lead.companyName,
                client: lead.contactPerson,
                budget: lead.budget ? Number(lead.budget) : 0,
                status: lead.leadStatus?.name || "",
                statusColor: lead.leadStatus?.color || ""
            })),
            hiring: openings.map((op) => ({
                id: op.jobid,
                jobTitle: op.jobTitle,
                experience: op.requiredSkills,
                minExp: op.minExperience,
                openingCount: op.openingCount
            }))
        };
    }
}

module.exports = new DashboardService();
