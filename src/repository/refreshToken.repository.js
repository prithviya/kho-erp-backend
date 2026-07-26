const { RefreshToken } = require("../model");

class RefreshTokenRepository {

    async create(data) {
        return await RefreshToken.create(data);
    }

    async findByToken(token) {
        return await RefreshToken.findOne({
            where: {
                token,
                isRevoked: false
            }
        });
    }

    async revoke(token) {
        return await RefreshToken.update(
            { isRevoked: true },
            { where: { token } }
        );
    }

    async revokeRefreshToken(id) {
        return await RefreshToken.update(
            {
                isRevoked: true,
                lastUsedAt: new Date()
            },
            { where: { id } }
        );
    }
}

module.exports = new RefreshTokenRepository();