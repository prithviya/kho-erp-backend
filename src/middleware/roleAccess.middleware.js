const { User, Role } = require("../model");
const ApiResponse = require("../helpers/apiResponse");

function normalizeRole(value = "") {
    return String(value)
        .trim()
        .toLowerCase()
        .replace(/[\s_-]+/g, "");
}

function buildRoleSet(roles = []) {
    const roleSet = new Set();

    roles.forEach((role) => {
        roleSet.add(normalizeRole(role?.code));
        roleSet.add(normalizeRole(role?.name));
    });

    return roleSet;
}

async function loadUserRoles(req, res, next) {
    try {
        if (!req.user?.id) {
            return ApiResponse.unauthorized(res, "Unauthorized access.");
        }

        const user = await User.findByPk(req.user.id, {
            include: [
                {
                    model: Role,
                    as: "roles",
                    attributes: ["id", "name", "code"],
                    through: { attributes: [] },
                },
            ],
        });

        if (!user) {
            return ApiResponse.unauthorized(res, "User not found.");
        }

        req.user.roles = user.roles || [];
        req.user.roleSet = buildRoleSet(req.user.roles);
        req.user.isSuperAdmin = req.user.roleSet.has("superadmin");

        return next();
    } catch (error) {
        return next(error);
    }
}

function requireAnyRole(allowedRoles = []) {
    const normalizedAllowed = allowedRoles.map(normalizeRole);

    return async (req, res, next) => {
        try {
            if (!req.user?.id) {
                return ApiResponse.unauthorized(res, "Unauthorized access.");
            }

            if (!req.user.roleSet) {
                const user = await User.findByPk(req.user.id, {
                    include: [
                        {
                            model: Role,
                            as: "roles",
                            attributes: ["id", "name", "code"],
                            through: { attributes: [] },
                        },
                    ],
                });

                req.user.roles = user?.roles || [];
                req.user.roleSet = buildRoleSet(req.user.roles);
                req.user.isSuperAdmin = req.user.roleSet.has("superadmin");
            }

            if (req.user.isSuperAdmin) {
                return next();
            }

            const hasAllowedRole = normalizedAllowed.some((role) =>
                req.user.roleSet.has(role)
            );

            if (!hasAllowedRole) {
                return ApiResponse.forbidden(
                    res,
                    "You do not have permission to perform this action."
                );
            }

            return next();
        } catch (error) {
            return next(error);
        }
    };
}

function hasRole(req, role) {
    return Boolean(req.user?.roleSet?.has(normalizeRole(role)));
}

module.exports = {
    normalizeRole,
    loadUserRoles,
    requireAnyRole,
    hasRole,
};
