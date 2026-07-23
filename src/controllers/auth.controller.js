const authService = require("../services/auth.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");
const logger = require("../helpers/logger");
const passwordService = require("../services/password.service");

exports.register = asyncHandler(async (req, res) => {
    logger.info(`Registering user: ${req.body.username}`);
    const user = await authService.register(req.body);
    logger.info(`User registered: ${user.username}`);
    return ApiResponse.created(
        res,
        "User registered successfully.",
        user
    );
});

exports.login = asyncHandler(async (req, res) => {
    logger.info(`Logging in user: ${req.body.username}`);
    const result = await authService.login(req.body);
    logger.info(`User logged in: ${result.user.username}`);
    return ApiResponse.success(
        res,
        "Login successful.",
        result
    );
});

exports.refreshToken = asyncHandler(async (req, res) => {
    logger.info(`Refreshing token for user: ${req.user.username}`);
    const result = await authService.refreshToken(
        req.body.refreshToken
    );
    logger.info(`Access token generated for user: ${req.user.username}`);
    return ApiResponse.success(
        res,
        "Access token generated successfully.",
        result
    );
});

exports.logout = asyncHandler(async (req, res) => {
    logger.info(`Logging out user: ${req.user.username}`);
    await authService.logout(req.body.refreshToken);
    logger.info(`User logged out: ${req.user.username}`);
    return ApiResponse.success(
        res,
        "Logged out successfully."
    );
});

exports.logoutAll = asyncHandler(async (req, res) => {
    logger.info(`Logging out user from all devices: ${req.user.username}`);
    await authService.logoutAll(req.user.id);
    logger.info(`User logged out from all devices: ${req.user.username}`);
    return ApiResponse.success(
        res,
        "Logged out from all devices successfully."
    );
});

exports.forgotPassword = asyncHandler(async (req, res) => {
    logger.info(`Initiating forgot password process for email: ${req.body.email}`);
    const result = await passwordService.forgotPassword(
        req.body.email
    );
    logger.info(`Password reset link sent to email: ${req.body.email}`);
    return ApiResponse.success(
        res,
        "Password reset link sent successfully.",
        result
    );
});

exports.resetPassword = asyncHandler(async (req, res) => {
    logger.info(`Resetting password for token: ${req.body.token}`);
    await passwordService.resetPassword(req.body);
    logger.info(`Password reset successfully for token: ${req.body.token}`);
    return ApiResponse.success(
        res,
        "Password reset successfully."
    );
});