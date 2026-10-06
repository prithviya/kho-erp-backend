const { Lead, ProjectOnboard, User, Vendor, Role, sequelize } = require("../model");
const projectAssignmentRepository = require("../repository/projectAssignment.repository");
const projectOnboardRepository = require("../repository/projectOnboard.repository");

class ProjectOnboardService {
    normalizeIdArray(value) {
        if (!Array.isArray(value)) return [];
        return value
            .map((item) => Number(item))
            .filter((id) => Number.isFinite(id) && id > 0);
    }

    parseIdArray(value) {
        if (Array.isArray(value)) return value;
        if (typeof value === "string") {
            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed : parsed ? [parsed] : [];
            } catch {
                return value.trim() ? [value] : [];
            }
        }
        return value === null || value === undefined || value === "" ? [] : [value];
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

    async attachAssignmentUsers(projects) {
        const records = Array.isArray(projects) ? projects : [projects];
        const ids = [...new Set(records.flatMap((project) => [
            ...this.parseIdArray(project.spocIds),
            ...this.parseIdArray(project.projectManagerIds),
            ...this.parseIdArray(project.assignedToIds),
            project.reportingHeadId
        ]).map(Number).filter(Number.isFinite))];
        const users = ids.length ? await User.findAll({
            where: { id: ids },
            attributes: ["id", "firstName", "lastName", "email"],
            include: [{ model: Role, as: "roles", attributes: ["code", "name"], through: { attributes: [] } }]
        }) : [];
        const userMap = new Map(users.map((user) => [Number(user.id), user.toJSON()]));
        const vendorIds = [...new Set(records.flatMap((project) => this.parseIdArray(project.assignedVendorIds)).map(Number).filter(Number.isFinite))];
        const vendors = vendorIds.length ? await Vendor.findAll({ where: { vendorId: vendorIds } }) : [];
        const vendorMap = new Map(vendors.map((vendor) => [Number(vendor.vendorId), vendor.toJSON()]));

        return records.map((project) => ({
            ...project,
            spocUsers: this.parseIdArray(project.spocIds).map((id) => userMap.get(Number(id))).filter(Boolean),
            reportingHeadUser: userMap.get(Number(project.reportingHeadId))
                || this.parseIdArray(project.projectManagerIds).map((id) => userMap.get(Number(id))).find(Boolean)
                || null,
            assignedUsers: this.parseIdArray(project.assignedToIds).map((id) => userMap.get(Number(id))).filter(Boolean)
            , assignedVendorUsers: this.parseIdArray(project.assignedVendorIds).map((id) => vendorMap.get(Number(id))).filter(Boolean)
        }));
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

    async listProjectOnboards(actor = {}) {
        const projects = await projectOnboardRepository.listAll();
        const mapped = await this.attachAssignmentUsers(projects.map((project) => this.mapProjectAssignmentFields(project)));
        if (actor.isSuperAdmin || actor.roleSet?.has("manager")) return mapped;

        const userId = Number(actor.id);
        return mapped.filter((project) => [
            ...this.parseIdArray(project.spocIds),
            ...this.parseIdArray(project.assignedToIds)
            , ...this.parseIdArray(project.assignedVendorIds)
        ].some((id) => Number(id) === userId));
    }

    async getProjectOnboardById(id) {
        const project = await projectOnboardRepository.findOneById(id);
        if (!project) throw new Error("Project not found.");
        const [mapped] = await this.attachAssignmentUsers([this.mapProjectAssignmentFields(project)]);
        return mapped;
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
        const assignedVendorIds = this.normalizeIdArray(data.assignedVendorIds);

        if (!assignedToIds.length && !assignedVendorIds.length) {
            throw new Error("At least one employee or vendor is required.");
        }

        const validUsers = await User.findAll({
            where: { id: assignedToIds },
            attributes: ["id"]
        });
        if (validUsers.length !== new Set(assignedToIds).size) {
            const error = new Error("One or more assignees are not valid users.");
            error.status = 400;
            throw error;
        }
        const validVendors = await Vendor.findAll({ where: { vendorId: assignedVendorIds }, attributes: ["vendorId"] });
        if (validVendors.length !== new Set(assignedVendorIds).size) {
            const error = new Error("One or more vendors are not valid.");
            error.status = 400;
            throw error;
        }

        const reportingHeadId = data.reportingHeadId
            ? Number(data.reportingHeadId)
            : existing.reportingHeadId || null;

        const transaction = await sequelize.transaction();

        try {
            if (assignedToIds.length) {
                await projectAssignmentRepository.clearByProjectOnboardId(id, transaction);
            }

            await ProjectOnboard.update(
                { assignedVendorIds },
                { where: { id }, transaction }
            );

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
