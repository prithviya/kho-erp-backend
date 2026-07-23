const { User, Role, Permission, RefreshToken } = require("../model");

class AuthRepository {

    async login(email) {
        return await User.findOne({
            where: { email },
            include: [
                {
                    model: Role,
                    as: "roles",
                    through: {
                        attributes: []
                    },
                    include: [
                        {
                            model: Permission,
                            as: "permissions",
                            through: {
                                attributes: []
                            }
                        }
                    ]
                }
            ]
        });
    }

    async findRefreshToken(token) {
        return await RefreshToken.findOne({
            where: {
                token,
                isRevoked: false
            }
        });

    }

    async findUserById(id) {
        return await User.findByPk(id, {
            include: [
                {
                    model: Role,
                    as: "roles",
                    through: { attributes: [] },
                    include: [
                        {
                            model: Permission,
                            as: "permissions",
                            through: { attributes: [] }
                        }
                    ]
                }
            ]
        });

    }

    async revokeRefreshToken(token) {
        return await RefreshToken.update(
            {
                isRevoked: true
            },
            {
                where: {
                    token
                }
            }
        );

    }

    async revokeAllRefreshTokens(userId) {

        return await RefreshToken.update(
            {
                isRevoked: true
            },
            {
                where: {
                    userId,
                    isRevoked: false
                }
            }
        );
    }

    async updatePassword(userId, password) {

        return await User.update(
            {
                password
            },
            {
                where: {
                    id: userId
                }
            }
        );
    }
}

module.exports = new AuthRepository();