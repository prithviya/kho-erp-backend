// Authentication routes for user registration, login, profile management, and password operations
const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const {
    registerValidation,
    loginValidation,
    refreshTokenValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    changePasswordValidation,
    updateProfileValidation
} = require("../validation/auth.validation");
router.post("/register", registerValidation, validate, authController.register);
router.post("/login", loginValidation, validate, authController.login);
router.post("/refresh-token", refreshTokenValidation, validate, authController.refreshToken);
router.post("/logout", authenticate, refreshTokenValidation, validate, authController.logout);
router.post("/logout-all", authenticate, authController.logoutAll);
router.post("/forgot-password", forgotPasswordValidation, validate, authController.forgotPassword);
router.post("/reset-password", resetPasswordValidation, validate, authController.resetPassword);
router.post("/change-password", authenticate, changePasswordValidation, validate, authController.changePassword);
router.get("/profile", authenticate, authController.getProfile);
router.put("/profile", authenticate, updateProfileValidation, validate, authController.updateProfile);
router.get("/sessions", authenticate, authController.getSessions);
router.delete("/sessions/:id", authenticate, authController.removeSession);
router.get("/permissions", authenticate, authController.getUserPermissions);
module.exports = router;