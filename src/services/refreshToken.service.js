const { RefreshToken } = require("../model");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../helpers/jwt");
const logger = require("../helpers/logger");
const authRepository = require("../repository/auth.repository");

class RefreshTokenService {

    // Create a new refresh token for a user
    async create(user) {
        logger.info(`Creating refresh token for user: ${user.id}`);
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        await RefreshToken.create({
            userId: user.id,
            token: refreshToken,
            expiresAt: new Date(
                Date.now() + (7 * 24 * 60 * 60 * 1000)
            )
        });
        logger.info(`Refresh token created for user: ${user.id}`);
        return { accessToken, refreshToken };
    }

    // Refresh the access token using a valid refresh token
    async refresh(refreshToken) {
        logger.info(`Attempting to refresh access token with refresh token: ${refreshToken}`);
        verifyRefreshToken(refreshToken);
        const token = await authRepository.findRefreshToken(refreshToken);
        if (!token || token.isRevoked) {
            logger.warn(`Refresh token is invalid or revoked: ${refreshToken}`);
            throw new Error("Invalid refresh token.");
        }
        const user = await authRepository.findUserById(token.userId);
        logger.info(`Refreshing access token for user: ${user.id}`);
        const accessToken = generateAccessToken(user);
        return { accessToken };
    }

    // Revoke a refresh token
    async revoke(refreshToken) {
        logger.info(`Revoking refresh token: ${refreshToken}`);
        const token = await authRepository.findRefreshToken(refreshToken);
        if (token) {
            logger.info(`Revoking refresh token: ${refreshToken}`);
            token.isRevoked = true;
            await token.save();
        }
    }

    // Revoke all refresh tokens for a user
    async logout(refreshToken) {
        logger.info(`Attempting to logout with refresh token: ${refreshToken}`);
        const token = await authRepository.findRefreshToken(refreshToken);
        if (!token) {
            logger.warn(`Attempt to logout with invalid refresh token: ${refreshToken}`);
            throw new Error("Invalid refresh token.");
        }
        logger.info(`Logging out with refresh token: ${refreshToken}`);
        await authRepository.revokeRefreshToken(refreshToken);
        return true;

    }

    // Revoke all refresh tokens for a user
    async logoutAll(userId) {
        logger.info(`Logging out all sessions for user: ${userId}`);
        await authRepository.revokeAllRefreshTokens(userId);
        return true;
    }
}

module.exports = new RefreshTokenService();