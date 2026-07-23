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
                    mobile: data.mobile,
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
    async login(data) {
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
        const tokens = await refreshTokenService.create(user);
        return {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            user
        };
    }

    // Refresh the access token using a valid refresh token
    async refreshToken(refreshToken) {
        logger.info("Refreshing access token.");
        return await refreshTokenService.refresh(refreshToken);
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
}

module.exports = new AuthService();