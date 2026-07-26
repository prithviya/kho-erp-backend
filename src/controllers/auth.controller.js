const authService = require("../services/auth.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");
const logger = require("../helpers/logger");
const passwordService = require("../services/password.service");
const UAParser = require("ua-parser-js");

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
    const parser = new UAParser(req.headers["user-agent"]);
    const sessionInfo = {
        deviceName: parser.getDevice().model || "Desktop",
        browser: parser.getBrowser().name,
        os: parser.getOS().name,
        ipAddress: req.ip
    };
    logger.info(`Logging in user: ${req.body.email} from IP: ${sessionInfo.ipAddress}`);
    const result = await authService.login(req.body, sessionInfo);
    logger.info(`User logged in: ${result.user.email}`);
    return ApiResponse.success(
        res,
        "Login successful.",
        result
    );
});

exports.refreshToken = asyncHandler(async (req, res) => {
    logger.info(`Refreshing token for user`);
    const result = await authService.refreshToken(
        req.body.refreshToken
    );
    logger.info(`Access token generated for user `);
    return ApiResponse.success(
        res,
        "Access token generated successfully.",
        result
    );
});

exports.logout = asyncHandler(async (req, res) => {
    logger.info(`Logging out user: ${req.user.email}`);
    await authService.logout(req.body.refreshToken);
    logger.info(`User logged out: ${req.user.email}`);
    return ApiResponse.success(
        res,
        "Logged out successfully."
    );
});

exports.logoutAll = asyncHandler(async (req, res) => {
    logger.info(`Logging out user from all devices: ${req.user.email}`);
    await authService.logoutAll(req.user.id);
    logger.info(`User logged out from all devices: ${req.user.email}`);
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

exports.changePassword = asyncHandler(async (req, res) => {
    logger.info(`Changing password for user: ${req.user.username}`);
    await authService.changePassword(
        req.user.id,
        req.body
    );
    logger.info(`Password changed successfully for user: ${req.user.username}`);
    return ApiResponse.success(
        res,
        "Password changed successfully."
    );
});

exports.getProfile = asyncHandler(async (req, res) => {
    logger.info(`Fetching profile for user ID: ${req.user.id}`);
    const user = await authService.getProfile(req.user.id);
    logger.info(`Profile fetched successfully for user ID: ${req.user.id}`);
    return ApiResponse.success(
        res,
        "Profile fetched successfully.",
        user
    );
});

exports.updateProfile = asyncHandler(async (req, res) => {
    logger.info(`Updating profile for user ID: ${req.user.id}`);
    const user = await authService.updateProfile(
        req.user.id,
        req.body
    );
    logger.info(`Profile updated successfully for user ID: ${req.user.id}`);
    return ApiResponse.success(
        res,
        "Profile updated successfully.",
        user
    );

});

exports.getSessions = asyncHandler(async (req, res) => {
    logger.info(`Fetching sessions for user ID: ${req.user.id}`);
    const sessions = await authService.getSessions(
        req.user.id
    );
    logger.info(`Sessions fetched successfully for user ID: ${req.user.id}`);
    return ApiResponse.success(
        res,
        "Sessions fetched successfully.",
        sessions
    );
});

exports.removeSession = asyncHandler(async (req, res) => {
    logger.info(`Removing session for user ID: ${req.user.id}`);
    await authService.removeSession(
        req.user.id,
        req.params.id
    );
    logger.info(`Session removed successfully for user ID: ${req.user.id}`);
    return ApiResponse.success(
        res,
        "Session removed successfully."
    );
});


exports.getUserPermissions = asyncHandler(async(req,res)=>{
    const permissions = await authService.getUserPermissions(
        req.user.id
    );
    return ApiResponse.success(
        res,
        "Permissions fetched successfully.",
        permissions
    );
});
