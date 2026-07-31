const { User, Role } = require("../model");
const ApiResponse = require("../helpers/apiResponse");

function normalizeRole(value = "") {
    return String(value).toLowerCase().replace(/[\s_]+/g, "");
}

module.exports = async (req, res, next) => {
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
                    through: { attributes: [] }
                }
            ]
        });

        const roles = user?.roles || [];
        const hasSuperAdmin = roles.some((role) => {
            const roleCode = normalizeRole(role.code);
            const roleName = normalizeRole(role.name);
            return roleCode === "superadmin" || roleName === "superadmin";
        });

        if (!hasSuperAdmin) {
            return ApiResponse.forbidden(res, "Only Super Admin can perform this action.");
        }

        next();
    } catch (error) {
        next(error);
    }
};