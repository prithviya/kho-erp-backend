const { Lead, ProjectOnboard, sequelize } = require("../model");
const projectAssignmentRepository = require("../repository/projectAssignment.repository");
const projectOnboardRepository = require("../repository/projectOnboard.repository");

class ProjectOnboardService {
    normalizeIdArray(value) {
        if (!Array.isArray(value)) return [];
        return value
            .map((item) => Number(item))
            .filter((id) => Number.isFinite(id) && id > 0);
    }

    mapProjectAssignmentFields(project) {
        const plainProject = typeof project?.toJSON === "function" ? project.toJSON() : project;
        const assignments = Array.isArray(plainProject?.assignments) ? plainProject.assignments : [];

        if (!assignments.length) {
            return {
                ...plainProject,
                assignedToIds: [],
                reportingHeadId: null
            };
        }

        const sortedAssignments = [...assignments].sort((a, b) => {
            const aDate = new Date(a.assignedAt || a.createdAt || 0).getTime();
            const bDate = new Date(b.assignedAt || b.createdAt || 0).getTime();
            return bDate - aDate;
        });

        const latest = sortedAssignments[0];
        const assignedToIds = [...new Set(
            sortedAssignments
                .map((item) => Number(item.assignedToId))
                .filter((id) => Number.isFinite(id) && id > 0)
        )];

        return {
            ...plainProject,
            assignedToIds,
            reportingHeadId: latest?.reportingHeadId ? Number(latest.reportingHeadId) : null
        };
    }

    async createProjectOnboard(data, userId) {
        if (data.leadId) {
            const lead = await Lead.findByPk(data.leadId, { paranoid: false });
            if (!lead) throw new Error("Lead not found.");

            // One project per lead: block a second onboarding from the same lead.
            const existingProject = await ProjectOnboard.findOne({
                where: { leadId: data.leadId },
                attributes: ["id", "projectName"]
            });
            if (existingProject) {
                const error = new Error(
                    "This lead is already onboarded with a project. If needed, create a new lead."
                );
                error.status = 409;
                throw error;
            }
        }

        return await projectOnboardRepository.create({
            leadId: data.leadId || null,
            projectName: data.projectName,
            companyName: data.companyName,
            projectManagerIds: this.normalizeIdArray(data.projectManagerIds),
            spocIds: this.normalizeIdArray(data.spocIds),
            serviceIds: this.normalizeIdArray(data.serviceIds),
            serviceDetails: data.serviceDetails || {},
            createdBy: userId || null
        });
    }

    async listProjectOnboards() {
        const projects = await projectOnboardRepository.listAll();
        return projects.map((project) => this.mapProjectAssignmentFields(project));
    }

    async getProjectOnboardById(id) {
        const project = await projectOnboardRepository.findOneById(id);
        if (!project) throw new Error("Project not found.");
        return this.mapProjectAssignmentFields(project);
    }

    async deleteProjectOnboard(id) {
        const project = await projectOnboardRepository.findOneById(id);
        if (!project) throw new Error("Project not found.");
        await projectOnboardRepository.delete(id);
        return true;
    }

    async updateProjectOnboard(id, data) {
        await this.getProjectOnboardById(id);

        const payload = {
            projectName: data.projectName,
            companyName: data.companyName,
            projectManagerIds: this.normalizeIdArray(data.projectManagerIds),
            spocIds: this.normalizeIdArray(data.spocIds),
            serviceIds: this.normalizeIdArray(data.serviceIds),
            serviceDetails: data.serviceDetails || {}
        };

        const updated = await projectOnboardRepository.updateById(id, payload);
        return this.mapProjectAssignmentFields(updated);
    }

    async assignProjectOnboard(id, data, assignedBy = null) {
        const existing = await this.getProjectOnboardById(id);
        const assignedToIds = this.normalizeIdArray(data.assignedToIds);

        if (!assignedToIds.length) {
            throw new Error("At least one assignee is required.");
        }

        const reportingHeadId = data.reportingHeadId
            ? Number(data.reportingHeadId)
            : existing.reportingHeadId || null;

        const transaction = await sequelize.transaction();

        try {
            await projectAssignmentRepository.clearByProjectOnboardId(id, transaction);

            await projectAssignmentRepository.bulkCreateAssignments(
                assignedToIds.map((assignedToId) => ({
                    projectOnboardId: Number(id),
                    assignedToId,
                    reportingHeadId,
                    assignedBy: assignedBy ? Number(assignedBy) : null,
                    assignedAt: new Date()
                })),
                transaction
            );

            await transaction.commit();

            return this.getProjectOnboardById(id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = new ProjectOnboardService();
