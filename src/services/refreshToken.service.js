const { RefreshToken } = require("../model");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../helpers/jwt");
const logger = require("../helpers/logger");
const authRepository = require("../repository/auth.repository");
const refreshTokenRepository = require("../repository/refreshToken.repository");

class RefreshTokenService {

    // Create a new refresh token for a user
    async create(user, sessionInfo = {}) {
        logger.info(`Creating refresh token for user: ${user.id}`);
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        const refreshExpiry = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        );
        await refreshTokenRepository.create({
            userId: user.id,
            token: refreshToken,
            deviceName: sessionInfo.deviceName || "Unknown Device",
            browser: sessionInfo.browser || null,
            os: sessionInfo.os || null,
            ipAddress: sessionInfo.ipAddress || null,
            expiresAt: refreshExpiry,
            lastUsedAt: new Date()
        });
        logger.info(`Refresh token created for user: ${user.id}`);
        return { accessToken, refreshToken };
    }

    // Refresh the access token using a valid refresh token
    async refreshToken(refreshToken) {

        const tokenRecord = await authRepository.findRefreshToken(refreshToken);

        if (!tokenRecord) {
            throw new Error("Invalid refresh token.");
        }

        if (new Date() > tokenRecord.expiresAt) {
            throw new Error("Refresh token expired.");
        }

        const user = await authRepository.findUserById(tokenRecord.userId);

        if (!user) {
            throw new Error("User not found.");
        }

        // 1. Revoke current refresh token
        await authRepository.revokeRefreshToken(tokenRecord.id);

        // 2. Generate new tokens
        const accessToken = generateAccessToken(user);

        const newRefreshToken = generateRefreshToken(user);

        // 3. Save new refresh token
        await authRepository.createRefreshToken({

            userId: user.id,

            token: newRefreshToken,

            expiresAt: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
            ),

            rotatedFromTokenId: tokenRecord.id

        });

        return {

            accessToken,

            refreshToken: newRefreshToken

        };

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