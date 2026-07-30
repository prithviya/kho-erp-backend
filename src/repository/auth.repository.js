const { User, Role, Permission, RefreshToken, Module } = require("../model");
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
            { isRevoked: true, lastUsedAt: new Date() },
            { where: { userId } }
        );
    }
    async findByEmail(email) {
        return await User.findOne({
            where: { email }
        });
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
    async getProfile(userId) {
        return await User.findByPk(userId, {
            attributes: {
                exclude: ["password"]
            },
            include: [
                {
                    model: Role,
                    as: "roles",
                    attributes: ["id", "name", "code"],
                    through: {
                        attributes: []
                    },
                    include: [
                        {
                            model: Permission,
                            as: "permissions",
                            attributes: [
                                "id",
                                "permissionKey",
                                "action"
                            ],
                            through: {
                                attributes: []
                            }
                        }
                    ]
                }
            ]
        });
    }
    async updateProfile(userId, data) {
        return await User.update(
            data,
            {
                where: {
                    id: userId
                }
            }
        );
    }
    async findByphone(phone, userId) {
        const { Op } = require("sequelize");
        return await User.findOne({
            where: {
                phone,
                id: {
                    [Op.ne]: userId
                }
            }
        });
    }
    async getSessions(userId) {
        return await RefreshToken.findAll({
            where: { userId, isRevoked: false },
            attributes: [
                "id",
                "deviceName",
                "browser",
                "os",
                "ipAddress",
                "lastUsedAt",
                "createdAt",
                "expiresAt"
            ],
            order: [["createdAt", "DESC"]]
        });
    }
    async removeSession(userId, sessionId) {
        const session = await RefreshToken.findOne({
            where: { id: sessionId, userId, isRevoked: false }
        });
        if (!session) {
            throw new Error("Session not found.");
        }
        session.isRevoked = true;
        await session.save();
        return true;
    }
    async getUserPermissions(userId) {
        return await User.findByPk(userId, {
            attributes: [
                "id",
                "firstName",
                "lastName"
            ],
            include: [
                {
                    model: Role,
                    as: "roles",
                    attributes: [
                        "id",
                        "name",
                        "code"
                    ],
                    through: {
                        attributes: []
                    },
                    include: [
                        {
                            model: Permission,
                            as: "permissions",
                            attributes: [
                                "id",
                                "moduleId",
                                "permissionKey",
                                "action",
                                "description"
                            ],
                            through: {
                                attributes: []
                            },
                            include: [
                                {
                                    model: Module,
                                    attributes: [
                                        "id",
                                        "name",
                                        "code"
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });
    }
    async createRefreshToken(data) {
        return await RefreshToken.create(data);
    }
}
module.exports = new AuthRepository();