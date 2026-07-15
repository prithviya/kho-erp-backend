const BaseRepository = require("./base.repository");
const { User, Role } = require("../model");

class UserRepository extends BaseRepository {

    constructor() {
        super(User);
    }

    async findByEmail(email) {
        return await User.findOne({
            where: { email }
        });
    }

    async getUserWithRoles(id) {
        return await User.findByPk(id, {
            include: [{
                model: Role
            }]
        });
    }

}

module.exports = new UserRepository();