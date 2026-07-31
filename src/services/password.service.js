const bcrypt = require("bcrypt");
const crypto = require("crypto");
const authRepository = require("../repository/auth.repository");
const passwordResetRepository = require("../repository/passwordReset.repository");
const logger = require("../helpers/logger");

function hashResetToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
}

class PasswordService {
    async forgotPassword(email) {
        logger.info(`Initiating forgot password process for email: ${email}`);
        const user = await authRepository.findByEmail(email);
        if (!user) {
            logger.warn(`Password reset requested for unknown email: ${email}`);
            return true;
        }
        logger.info(`User found for email: ${email}`);
        await passwordResetRepository.deleteOldTokens(user.id);
        const token = crypto.randomBytes(32).toString("hex");
        await passwordResetRepository.create({
            userId: user.id,
            token: hashResetToken(token),
            expiresAt: new Date(Date.now() + 15 * 60 * 1000)
        });
        logger.info(`Password reset token stored for user: ${user.id}`);

        if (process.env.NODE_ENV !== "production") {
            const resetLinkBase = process.env.PASSWORD_RESET_URL || "http://localhost:5173/reset-password";
            logger.info(`Password reset link generated for ${email}. Configure email delivery to send: ${resetLinkBase}?token=${token}`);
        }

        return true;
    }
    async resetPassword(data) {
        logger.info("Resetting password using stored token hash.");
        const token = await passwordResetRepository.findByToken(hashResetToken(data.token));
        if (!token) {
            logger.warn("Invalid password reset token submitted.");
            throw new Error("Invalid token.");
        }
        if (new Date() > token.expiresAt) {
            logger.warn("Expired password reset token submitted.");
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