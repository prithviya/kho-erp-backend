const ApiResponse = require("../helpers/apiResponse");
const authMiddleware = require("./auth.middleware");

const METHOD_ACTIONS = {
    GET: "view",
    HEAD: "view",
    POST: "create",
    PUT: "edit",
    PATCH: "edit",
    DELETE: "delete",
};

function requireModulePermission(moduleCodes, actionOverride = null) {
    const modules = (Array.isArray(moduleCodes) ? moduleCodes : [moduleCodes])
        .filter(Boolean);

    const authorize = (req, res, next) => {
        if (req.method === "OPTIONS") {
            return next();
        }

        if (!req.user?.id) {
            return ApiResponse.unauthorized(res, "Unauthorized access.");
        }

        const action = actionOverride || METHOD_ACTIONS[req.method];
        if (!action) {
            return ApiResponse.forbidden(res, "No permission is defined for this action.");
        }

        const requiredKeys = typeof moduleCodes === "function"
            ? moduleCodes(req, action)
            : modules.map((moduleCode) => `${moduleCode}.${action}`);
        if (!requiredKeys.length) {
            return ApiResponse.forbidden(res, "No permission is defined for this action.");
        }
        if (req.user.isSuperAdmin) {
            req.permissionAccess = { requiredKeys, granted: true };
            return next();
        }

        const granted = (req.user.roles || []).some((role) => (
            role.isActive !== false
            && Array.isArray(role.permissions)
            && role.permissions.some((permission) => requiredKeys.includes(permission.permissionKey))
        ));

        if (!granted) {
            return ApiResponse.forbidden(
                res,
                `You do not have permission to ${action} this module.`
            );
        }

        req.permissionAccess = { requiredKeys, granted: true };
        return next();
    };

    return (req, res, next) => {
        if (req.method === "OPTIONS") {
            return next();
        }
        if (req.user?.id) {
            return authorize(req, res, next);
        }
        return authMiddleware(req, res, (error) => {
            if (error) {
                return next(error);
            }
            if (res.headersSent) {
                return undefined;
            }
            return authorize(req, res, next);
        });
    };
}

module.exports = requireModulePermission;
