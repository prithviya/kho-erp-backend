const router = require("express").Router();
const authMiddleware = require("../middleware/auth.middleware");
const { requireAnyRole } = require("../middleware/roleAccess.middleware");
const controller = require("../controllers/onboarding.controller");

const onboardingDocumentViewerRoles = ["super_admin", "manager", "ceo", "hr"];

router.get(
    "/",
    authMiddleware,
    requireAnyRole(onboardingDocumentViewerRoles),
    controller.getOnboardingDocuments
);
router.post(
    "/archive",
    authMiddleware,
    requireAnyRole(onboardingDocumentViewerRoles),
    controller.downloadOnboardingDocuments
);

module.exports = router;
