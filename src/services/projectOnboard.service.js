const { Lead, sequelize } = require("../model");
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
                reportingHeadId: null,
                status: plainProject?.status || "Pending"
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
            reportingHeadId: latest?.reportingHeadId ? Number(latest.reportingHeadId) : null,
            status: latest?.status || plainProject?.status || "Pending"
        };
    }

    async createProjectOnboard(data, userId) {
        if (data.leadId) {
            const lead = await Lead.findByPk(data.leadId, { paranoid: false });
            if (!lead) throw new Error("Lead not found.");
        }

        return await projectOnboardRepository.create({
            leadId: data.leadId || null,
            projectName: data.projectName,
            companyName: data.companyName,
            projectManagerIds: this.normalizeIdArray(data.projectManagerIds),
            spocIds: this.normalizeIdArray(data.spocIds),
            serviceIds: this.normalizeIdArray(data.serviceIds),
            serviceDetails: data.serviceDetails || {},
            status: data.status || "Pending",
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

        const status = data.status || "In Progress";

        const transaction = await sequelize.transaction();

        try {
            await projectAssignmentRepository.clearByProjectOnboardId(id, transaction);

            await projectAssignmentRepository.bulkCreateAssignments(
                assignedToIds.map((assignedToId) => ({
                    projectOnboardId: Number(id),
                    assignedToId,
                    reportingHeadId,
                    status,
                    assignedBy: assignedBy ? Number(assignedBy) : null,
                    assignedAt: new Date()
                })),
                transaction
            );

            await projectOnboardRepository.updateById(id, { status });

            await transaction.commit();

            return this.getProjectOnboardById(id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}

module.exports = new ProjectOnboardService();
