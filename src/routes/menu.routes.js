const router = require("express").Router();
const authMiddleware = require("../middleware/auth.middleware");
const { requireAnyRole } = require("../middleware/roleAccess.middleware");
const menuService = require("../services/menu.service");
const ApiResponse = require("../helpers/apiResponse");
const asyncHandler = require("../helpers/asyncHandler");

const superAdminOnly = [authMiddleware, requireAnyRole(["super_admin"])];

// Any signed-in user may read only the menus their own roles permit.
router.get("/my", authMiddleware, asyncHandler(async (req, res) => (
    ApiResponse.success(res, "Menus fetched successfully.", await menuService.getMenusForUser(req.user))
)));

router.get("/", ...superAdminOnly, asyncHandler(async (req, res) => (
    ApiResponse.success(res, "Menus fetched successfully.", await menuService.listMenus())
)));
router.post("/", ...superAdminOnly, asyncHandler(async (req, res) => (
    ApiResponse.created(res, "Menu created successfully.", await menuService.createMenu(req.body))
)));
router.put("/reorder", ...superAdminOnly, asyncHandler(async (req, res) => (
    ApiResponse.success(res, "Menu order saved.", await menuService.reorderMenus(req.body?.items))
)));
router.put("/:id", ...superAdminOnly, asyncHandler(async (req, res) => (
    ApiResponse.success(res, "Menu updated successfully.", await menuService.updateMenu(req.params.id, req.body))
)));
router.delete("/:id", ...superAdminOnly, asyncHandler(async (req, res) => {
    await menuService.deleteMenu(req.params.id);
    return ApiResponse.success(res, "Menu deleted successfully.");
}));
router.post("/:id/actions", ...superAdminOnly, asyncHandler(async (req, res) => (
    ApiResponse.created(res, "Action added.", await menuService.addAction(req.params.id, req.body?.action))
)));
router.delete("/:id/actions/:permissionId", ...superAdminOnly, asyncHandler(async (req, res) => {
    await menuService.removeAction(req.params.id, req.params.permissionId);
    return ApiResponse.success(res, "Action removed.");
}));

module.exports = router;
