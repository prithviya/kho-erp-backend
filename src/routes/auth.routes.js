// Authentication routes for user registration, login, profile management, and password operations
const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const {
    changePasswordValidation,
    updateProfileValidation
} = require("../validation/auth.validation");
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);
router.post("/logout-all", authenticate, authController.logoutAll);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/change-password", authenticate, changePasswordValidation, validate, authController.changePassword);
router.get("/profile", authenticate, authController.getProfile);
router.put("/profile", authenticate, updateProfileValidation, validate, authController.updateProfile);
router.get("/sessions", authenticate, authController.getSessions);
router.delete("/sessions/:id", authenticate, authController.removeSession);
router.get("/permissions", authenticate, authController.getUserPermissions);
module.exports = router;