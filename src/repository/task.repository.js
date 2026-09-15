const BaseRepository = require("./base.repository");
const { Task, ProjectOnboard, Service, User } = require("../model");

const USER_ATTRIBUTES = ["id", "firstName", "lastName", "email"];

const TASK_INCLUDES = [
    {
        model: ProjectOnboard,
        as: "project",
        attributes: ["id", "projectName", "companyName", "projectManagerIds", "spocIds"],
        paranoid: false
    },
    {
        model: Service,
        as: "service",
        attributes: ["id", "name"],
        required: false
    },
    {
        model: User,
        as: "assignee",
        attributes: USER_ATTRIBUTES
    },
    {
        model: User,
        as: "reportingHead",
        attributes: USER_ATTRIBUTES,
        required: false
    },
    {
        model: User,
        as: "creator",
        attributes: USER_ATTRIBUTES,
        required: false
    }
];

class TaskRepository extends BaseRepository {
    constructor() {
        super(Task);
    }

    async listTasks(where = {}) {
        return this.findAll({
            where,
            include: TASK_INCLUDES,
            order: [
                ["status", "ASC"],
                ["dueDate", "ASC"],
                ["createdAt", "DESC"]
            ]
        });
    }

    async findOneById(id) {
        return this.findById(id, { include: TASK_INCLUDES });
    }
}

module.exports = new TaskRepository();
