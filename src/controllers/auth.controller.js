const authService = require("../services/auth.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");
const logger = require("../helpers/logger");
const passwordService = require("../services/password.service");
const activityLogService = require("../services/activityLog.service");
const UAParser = require("ua-parser-js");
const fs = require("fs/promises");
const path = require("path");
const { randomUUID } = require("crypto");

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
    let result;
    try {
        result = await authService.login(req.body, sessionInfo);
    } catch (error) {
        const identifier = String(req.body?.identifier || req.body?.employeeCode || req.body?.email || "").trim().slice(0, 120);
        await activityLogService.log({
            actorName: identifier || "Unknown",
            module: "auth",
            action: "LOGIN_FAILED",
            description: `Failed login attempt for "${identifier}"`,
            method: req.method,
            route: "/auth/login",
            statusCode: error.status || 401,
            ipAddress: req.ip
        });
        throw error;
    }
    setAuthCookies(res, result.accessToken, result.refreshToken);
    logger.info(`User logged in: ${result.user.email}`);
    await activityLogService.log({
        actorId: result.user.id,
        module: "auth",
        action: "LOGIN",
        description: `Logged in from ${sessionInfo.browser || "browser"} on ${sessionInfo.os || "unknown OS"}`,
        method: req.method,
        route: "/auth/login",
        statusCode: 200,
        ipAddress: sessionInfo.ipAddress,
        metadata: { device: sessionInfo.deviceName, browser: sessionInfo.browser, os: sessionInfo.os }
    });
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
    await activityLogService.log({
        actorId: req.user.id,
        module: "auth",
        action: "LOGOUT",
        description: "Logged out",
        method: req.method,
        route: "/auth/logout",
        statusCode: 200,
        ipAddress: req.ip
    });
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
    await activityLogService.log({
        actorId: req.user.id,
        module: "auth",
        action: "LOGOUT",
        description: "Logged out from all devices",
        method: req.method,
        route: "/auth/logout-all",
        statusCode: 200,
        ipAddress: req.ip
    });
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

exports.uploadProfileImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        return ApiResponse.error(res, "An image file is required.", null, 400);
    }

    const { buffer } = req.file;
    let extension;
    if (
        buffer.length >= 3 &&
        buffer[0] === 0xff &&
        buffer[1] === 0xd8 &&
        buffer[2] === 0xff
    ) {
        extension = "jpg";
    } else if (
        buffer.length >= 8 &&
        buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    ) {
        extension = "png";
    } else if (
        buffer.length >= 12 &&
        buffer.toString("ascii", 0, 4) === "RIFF" &&
        buffer.toString("ascii", 8, 12) === "WEBP"
    ) {
        extension = "webp";
    } else {
        return ApiResponse.error(res, "The uploaded file is not a supported image.", null, 400);
    }

    const uploadsRoot = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, "../../uploads"));
    const imageDirectory = path.join(uploadsRoot, "profile-images");
    await fs.mkdir(imageDirectory, { recursive: true });
    const currentUser = await authService.getProfile(req.user.id);

    const filename = `${req.user.id}-${randomUUID()}.${extension}`;
    const imagePath = path.join(imageDirectory, filename);
    const profileImage = `/uploads/profile-images/${filename}`;
    await fs.writeFile(imagePath, buffer, { flag: "wx" });

    try {
        await authService.updateProfileImage(req.user.id, profileImage);
    } catch (error) {
        await fs.unlink(imagePath).catch((cleanupError) => {
            if (cleanupError.code !== "ENOENT") {
                logger.error(`Unable to remove failed profile photo upload: ${cleanupError.message}`);
            }
        });
        throw error;
    }

    const previousImage = currentUser?.profileImage;
    if (typeof previousImage === "string" && previousImage.startsWith("/uploads/profile-images/")) {
        const previousFilename = path.basename(previousImage);
        if (previousFilename === previousImage.slice("/uploads/profile-images/".length)) {
            await fs.unlink(path.join(imageDirectory, previousFilename)).catch((error) => {
                if (error.code !== "ENOENT") {
                    logger.error(`Unable to remove replaced profile photo: ${error.message}`);
                }
            });
        }
    }

    return ApiResponse.success(res, "Profile photo updated successfully.", { profileImage });
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
