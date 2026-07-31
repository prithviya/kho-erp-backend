const BaseRepository = require("./base.repository");
const { ProjectOnboard, ProjectAssignment } = require("../model");

class ProjectOnboardRepository extends BaseRepository {
    constructor() {
        super(ProjectOnboard);
    }

    async listAll() {
        return this.findAll({
            include: [
                {
                    model: ProjectAssignment,
                    as: "assignments",
                    required: false,
                    attributes: [
                        "id",
                        "projectOnboardId",
                        "assignedToId",
                        "reportingHeadId",
                        "status",
                        "assignedBy",
                        "assignedAt",
                        "createdAt"
                    ]
                }
            ],
            order: [["createdAt", "DESC"]]
        });
    }

    async findOneById(id) {
        return this.findById(id, {
            include: [
                {
                    model: ProjectAssignment,
                    as: "assignments",
                    required: false,
                    attributes: [
                        "id",
                        "projectOnboardId",
                        "assignedToId",
                        "reportingHeadId",
                        "status",
                        "assignedBy",
                        "assignedAt",
                        "createdAt"
                    ]
                }
            ]
        });
    }

    async updateById(id, data) {
        return this.update(id, data);
    }
}

module.exports = new ProjectOnboardRepository();
