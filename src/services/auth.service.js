const bcrypt = require("bcrypt");
const { sequelize, User, UserRole, Role, Permission } = require("../model");
const userRepository = require("../repository/user.repository");
const jwt = require("jsonwebtoken");
const authRepository = require("../repository/auth.repository");
const { generateAccessToken, generateRefreshToken } = require("../helpers/jwt");
const { RefreshToken } = require("../model");
const refreshTokenService = require("./refreshToken.service");
const logger = require("../helpers/logger");
class AuthService {
    // Register a new user
    async register(data) {
        logger.info(`Registering new user with email: ${data.email}`);
        const transaction = await sequelize.transaction();
        try {
            // Check email already exists
            const existingUser = await userRepository.findByEmail(data.email);
            if (existingUser) {
                logger.warn(`User registration failed for email: ${data.email}`);
                throw new Error("Email already exists.");
            }
            // Encrypt password
            const hashedPassword = await bcrypt.hash(data.password, 10);
            // Create user
            const user = await User.create(
                {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    password: hashedPassword,
                    phone: data.phone,
                    isActive: true
                },
                { transaction }
            );
            logger.info(`User created successfully: ${user.email}`);
            // Assign Roles
            if (Array.isArray(data.roleIds) && data.roleIds.length > 0) {
                const userRoles = data.roleIds.map(roleId => ({
                    userId: user.id,
                    roleId
                }));
                await UserRole.bulkCreate(userRoles, {
                    transaction
                });
            }
            await transaction.commit();
            return user;
        } catch (error) {
            await transaction.rollback();
            logger.error(`Error during user registration: ${error.message}`);
            throw error;
        }
    }
    // Login a user and generate tokens
    async login(data, sessionInfo) {
        logger.info(`Attempting login for email: ${data.email}`);
        const user = await authRepository.login(data.email);
        if (!user) {
            logger.warn(`Login failed for email: ${data.email}`);
            throw new Error("Invalid email or password.");
        }
        const isPasswordMatched = await bcrypt.compare(
            data.password,
            user.password
        );
        if (!isPasswordMatched) {
            logger.warn(`Login failed for email: ${data.email}`);
            throw new Error("Invalid email or password.");
        }
        logger.info(`Login successful for email: ${data.email}`);
        const tokens = await refreshTokenService.create(user, sessionInfo);
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user
        };
    }
    // Refresh the access token using a valid refresh token
    async refreshToken(refreshToken) {
        logger.info("Refreshing access token.");
        return await refreshTokenService.refreshToken(refreshToken);
    }
    //  Logout a user by revoking the refresh token
    async logout(refreshToken) {
        logger.info("Logging out user.");
        return await refreshTokenService.logout(refreshToken);
    }
    // Logout a user from all devices by revoking all refresh tokens
    async logoutAll(userId) {
        logger.info("Logging out all sessions for user.");
        return await refreshTokenService.logoutAll(userId);
    }
    // Change the password for a user
    async changePassword(userId, data) {
        logger.info(`Changing password for user ID: ${userId}`);
        const user = await authRepository.findUserById(userId);
        logger.info(`User found for password change: ${user ? user.email : 'Not Found'}`);
        if (!user) {
            logger.warn(`User not found for ID: ${userId}`);
            throw new Error("User not found.");
        }
        const isPasswordMatched = await bcrypt.compare(
            data.oldPassword,
            user.password
        );
        logger.info(`Old password match status for user ID ${userId}: ${isPasswordMatched}`);
        if (!isPasswordMatched) {
            logger.warn(`Old password is incorrect for user ID: ${userId}`);
            throw new Error("Old password is incorrect.");
        }
        if (data.newPassword !== data.confirmPassword) {
            logger.warn(`Password confirmation does not match for user ID: ${userId}`);
            throw new Error("Password confirmation does not match.");
        }
        if (data.oldPassword === data.newPassword) {
            logger.warn(`New password is the same as old password for user ID: ${userId}`);
            throw new Error("New password must be different from old password.");
        }
        const hashedPassword = await bcrypt.hash(
            data.newPassword,
            10
        );
        logger.info(`Updating password for user ID: ${userId}`);
        await authRepository.updatePassword(
            user.id,
            hashedPassword
        );
        logger.info(`Password updated for user ID: ${userId}`);
        logger.info(`Revoking all refresh tokens for user ID: ${userId}`);
        await authRepository.revokeAllRefreshTokens(user.id);
        return true;
    }
    // Get user profile
    async getProfile(userId) {
        logger.info(`Fetching profile for user ID: ${userId}`);
        const user = await authRepository.getProfile(userId);
        if (!user) {
            logger.warn(`User not found for ID: ${userId}`);
            throw new Error("User not found.");
        }
        logger.info(`Profile fetched successfully for user ID: ${userId}`);
        return user;
    }
    // Update user profile
    async updateProfile(userId, data) {
        const user = await authRepository.findUserById(userId);
        logger.info(`Updating profile for user ID: ${userId}`);
        if (!user) {
            logger.warn(`User not found for ID: ${userId}`);
            throw new Error("User not found.");
        }
        logger.info(`Profile fetched successfully for user ID: ${userId}`);
        // Check duplicate email
        if (data.email && data.email !== user.email) {
            logger.info(`Checking if email exists for user ID: ${userId}`);
            const emailExists = await authRepository.findByEmail(data.email);
            logger.info(`Email existence check for user ID ${userId}: ${emailExists ? 'Exists' : 'Does not exist'}`);
            if (emailExists) {
                logger.warn(`Email already exists for user ID: ${userId}`);
                throw new Error("Email already exists.");
            }
        }
        // Check duplicate phone
        if (data.phone && data.phone !== user.phone) {
            logger.info(`Checking if phone number exists for user ID: ${userId}`);
            const phoneExists = await authRepository.findByphone(
                data.phone,
                userId
            );
            logger.info(`phone number existence check for user ID ${userId}: ${phoneExists ? 'Exists' : 'Does not exist'}`);
            if (phoneExists) {
                logger.warn(`phone number already exists for user ID: ${userId}`);
                throw new Error("phone number already exists.");
            }
        }
        await authRepository.updateProfile(userId, {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            profileImage: data.profileImage
        });
        logger.info(`Profile updated successfully for user ID: ${userId}`);
        return await authRepository.getProfile(userId);
    }
    // Get all active sessions for a user
    async getSessions(userId) {
        logger.info(`Fetching active sessions for user ID: ${userId}`);
        return await authRepository.getSessions(userId);
    }
    // Remove a specific session for a user
    async removeSession(userId, sessionId) {
        logger.info(`Removing session ID: ${sessionId} for user ID: ${userId}`);
        return await authRepository.removeSession(
            userId,
            sessionId
        );
    }
    // Get user permissions based on roles
    async getUserPermissions(userId) {
        logger.info(`Fetching permissions for user ID: ${userId}`);
        const user = await authRepository.getUserPermissions(userId);
        if (!user) {
            logger.warn(`User not found for ID: ${userId}`);
            throw new Error("User not found.");
        }
        const permissions = [];
        user.roles.forEach(role => {
            role.permissions.forEach(permission => {
                permissions.push({
                    id: permission.id,
                    permissionKey: permission.permissionKey,
                    action: permission.action,
                    module: permission.Module?.name
                });
            });
        });
        logger.info(`Permissions fetched for user ID: ${userId}`);
        return {
            roles: user.roles,
            permissions: permissions
        };
    }
}
module.exports = new AuthService();