const BaseRepository = require("./base.repository");
const { User, Role } = require("../model");
const { Op } = require("sequelize");
class UserRepository extends BaseRepository {
    constructor() {
        super(User);
    }

    async findByEmail(email, excludeId = null) {
        const where = { email };
        if (excludeId) {
            where.id = { [Op.ne]: excludeId };
        }
        return await User.findOne({ where, paranoid: false });
    }

    async findByUsername(username, excludeId = null) {
        const where = { username };
        if (excludeId) {
            where.id = { [Op.ne]: excludeId };
        }
        return await User.findOne({ where, paranoid: false });
    }

    async getUsers() {
        return await User.findAll({
            paranoid: false,
            attributes: { exclude: ["password"] },
            include: [
                {
                    model: Role,
                    as: "roles",
                    attributes: ["id", "name", "code"],
                    through: { attributes: [] }
                }
            ],
            order: [["createdAt", "DESC"]]
        });
    }

    async getUserWithRoles(id) {
        return await User.findByPk(id, {
            paranoid: false,
            attributes: { exclude: ["password"] },
            include: [
                {
                    model: Role,
                    as: "roles",
                    attributes: ["id", "name", "code"],
                    through: { attributes: [] }
                }
            ]
        });
    }

    async updateStatus(id, isActive) {
        await User.update({ isActive }, { where: { id }, paranoid: false });
        return await this.getUserWithRoles(id);
    }

    async softDelete(id) {
        return await User.destroy({ where: { id } });
    }
}
module.exports = new UserRepository();