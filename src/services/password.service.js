const bcrypt = require("bcrypt");
const crypto = require("crypto");

const authRepository = require("../repository/auth.repository");
const passwordResetRepository = require("../repository/passwordReset.repository");
const logger = require("../helpers/logger");

class PasswordService {
    async forgotPassword(email) {
        logger.info(`Initiating forgot password process for email: ${email}`);
        const user = await authRepository.findByEmail(email);
        if (!user) {
            logger.warn(`User not found for email: ${email}`);
            throw new Error("User not found.");
        }
        logger.info(`User found for email: ${email}`);
        await passwordResetRepository.deleteOldTokens(user.id);
        const token = crypto.randomBytes(32).toString("hex");
        await passwordResetRepository.create({
            userId: user.id,
            token,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000)
        });
        logger.info(`Password reset token generated for user: ${user.id}`);
        return { resetToken: token };

    }

    async resetPassword(data) {
        logger.info(`Resetting password for token: ${data.token}`);
        const token = await passwordResetRepository.findByToken(data.token);

        if (!token) {
            logger.warn(`Invalid password reset token: ${data.token}`);
            throw new Error("Invalid token.");
        }

        if (new Date() > token.expiresAt) {
            logger.warn(`Expired password reset token: ${data.token}`);
            throw new Error("Token expired.");
        }

        const password = await bcrypt.hash(data.password, 10);
        logger.info(`Updating password for user: ${token.userId}`);
        await authRepository.updatePassword(
            token.userId,
            password
        );

        logger.info(`Marking password reset token as used: ${token.id}`);
        await passwordResetRepository.markAsUsed(token.id);
        return true;

    }

}

module.exports = new PasswordService();