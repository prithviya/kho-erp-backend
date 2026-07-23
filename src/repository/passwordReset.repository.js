const { PasswordResetToken } = require("../model");
const logger = require("../helpers/logger");

class PasswordResetRepository {

    create(data) {
        logger.info("Creating password reset token.");
        return PasswordResetToken.create(data);
    }

    findByToken(token) {
        logger.info(`Finding password reset token: ${token}`);
        return PasswordResetToken.findOne({
            where: {
                token,
                isUsed: false
            }
        });
    }

    async markAsUsed(id) {
        logger.info(`Marking password reset token as used: ${id}`);
        return PasswordResetToken.update(
            {
                isUsed: true
            },
            {
                where: { id }
            }
        );
    }

    async deleteOldTokens(userId) {
        logger.info(`Deleting old password reset tokens for user: ${userId}`);
        return PasswordResetToken.destroy({
            where: { userId }
        });
    }

}

module.exports = new PasswordResetRepository();