const authService = require("../services/auth.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");
const logger = require("../helpers/logger");
const passwordService = require("../services/password.service");
const UAParser = require("ua-parser-js");

const ACCESS_COOKIE_NAME = "erp_access_token";
const REFRESH_COOKIE_NAME = "erp_refresh_token";

function getCookieOptions(maxAge) {
    const secure = process.env.COOKIE_SECURE === "true" || process.env.NODE_ENV === "production";

    return {
        httpOnly: true,
        secure,
        sameSite: process.env.COOKIE_SAME_SITE || "Lax",
        path: "/",
        maxAge,
    };
}

function setAuthCookies(res, accessToken, refreshToken) {
    res.cookie(ACCESS_COOKIE_NAME, accessToken, getCookieOptions(24 * 60 * 60 * 1000));
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
}

function clearAuthCookies(res) {
    res.clearCookie(ACCESS_COOKIE_NAME, getCookieOptions(24 * 60 * 60 * 1000));
    res.clearCookie(REFRESH_COOKIE_NAME, getCookieOptions(7 * 24 * 60 * 60 * 1000));
}

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
    setAuthCookies(res, result.accessToken, result.refreshToken);
    logger.info(`User logged in: ${result.user.email}`);
    return ApiResponse.success(
        res,
        "Login successful.",
        {
            user: result.user
        }
    );
});

exports.refreshToken = asyncHandler(async (req, res) => {
    logger.info(`Refreshing token for user`);
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME] || req.body.refreshToken;
    const result = await authService.refreshToken(
        refreshToken
    );
    setAuthCookies(res, result.accessToken, result.refreshToken);
    logger.info(`Access token generated for user `);
    return ApiResponse.success(
        res,
        "Access token generated successfully.",
        null
    );
});

exports.logout = asyncHandler(async (req, res) => {
    logger.info(`Logging out user: ${req.user.email}`);
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME] || req.body.refreshToken;
    await authService.logout(refreshToken);
    clearAuthCookies(res);
    logger.info(`User logged out: ${req.user.email}`);
    return ApiResponse.success(
        res,
        "Logged out successfully."
    );
});

exports.logoutAll = asyncHandler(async (req, res) => {
    logger.info(`Logging out user from all devices: ${req.user.email}`);
    await authService.logoutAll(req.user.id);
    clearAuthCookies(res);
    logger.info(`User logged out from all devices: ${req.user.email}`);
    return ApiResponse.success(
        res,
        "Logged out from all devices successfully."
    );
});

exports.forgotPassword = asyncHandler(async (req, res) => {
    logger.info(`Initiating forgot password process for email: ${req.body.email}`);
    await passwordService.forgotPassword(
        req.body.email
    );
    logger.info(`Password reset link sent to email: ${req.body.email}`);
    return ApiResponse.success(
        res,
        "If the email exists, password reset instructions have been sent.",
        null
    );
});

exports.resetPassword = asyncHandler(async (req, res) => {
    logger.info("Resetting password using password reset flow.");
    await passwordService.resetPassword(req.body);
    logger.info("Password reset completed successfully.");
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
