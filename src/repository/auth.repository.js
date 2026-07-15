const { User, Role, Permission } = require("../model");

class AuthRepository {

    async login(email) {

        return await User.findOne({

            where: {
                email
            },

            include: [{
                model: Role,
                include: [Permission]
            }]
        });

    }

}

module.exports = new AuthRepository();