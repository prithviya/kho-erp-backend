// Authentication routes for user registration, login, profile management, and password operations
const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const multer = require("multer");
const ApiResponse = require("../helpers/apiResponse");
const {
    registerValidation,
    loginValidation,
    refreshTokenValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    changePasswordValidation,
    updateProfileValidation
} = require("../validation/auth.validation");

const ensureRegistrationEnabled = (req, res, next) => {
    if (String(process.env.ALLOW_PUBLIC_REGISTRATION || "false").toLowerCase() === "true") {
        return next();
    }

    return ApiResponse.forbidden(res, "Public registration is disabled.");
};
const profileImageUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    fileFilter: (req, file, callback) => {
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
            return callback(new Error("Only JPEG, PNG, and WebP images are allowed."));
        }
        return callback(null, true);
    },
});

router.post("/register", ensureRegistrationEnabled, registerValidation, validate, authController.register);
router.post("/login", loginValidation, validate, authController.login);
router.post("/refresh-token", refreshTokenValidation, validate, authController.refreshToken);
router.post("/logout", authenticate, refreshTokenValidation, validate, authController.logout);
router.post("/logout-all", authenticate, authController.logoutAll);
router.post("/forgot-password", forgotPasswordValidation, validate, authController.forgotPassword);
router.post("/reset-password", resetPasswordValidation, validate, authController.resetPassword);
router.post("/change-password", authenticate, changePasswordValidation, validate, authController.changePassword);
router.get("/profile", authenticate, authController.getProfile);
router.put("/profile", authenticate, updateProfileValidation, validate, authController.updateProfile);
router.post(
    "/profile/image",
    authenticate,
    (req, res, next) => {
        profileImageUpload.single("image")(req, res, (error) => {
            if (!error) return next();
            const statusCode = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
            return ApiResponse.error(res, error.message, null, statusCode);
        });
    },
    authController.uploadProfileImage
);
router.get("/sessions", authenticate, authController.getSessions);
router.delete("/sessions/:id", authenticate, authController.removeSession);
router.get("/permissions", authenticate, authController.getUserPermissions);
module.exports = router;