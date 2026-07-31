const BaseRepository = require("./base.repository");
const { ProjectAssignment } = require("../model");

class ProjectAssignmentRepository extends BaseRepository {
    constructor() {
        super(ProjectAssignment);
    }

    async clearByProjectOnboardId(projectOnboardId, transaction = null) {
        return this.model.destroy({
            where: { projectOnboardId },
            transaction
        });
    }

    async bulkCreateAssignments(assignments, transaction = null) {
        if (!assignments.length) return [];
        return this.model.bulkCreate(assignments, { transaction });
    }
}

module.exports = new ProjectAssignmentRepository();