// Authentication middleware to verify JWT tokens and user status
const jwt = require("jsonwebtoken");
const { User, Role } = require("../model");
const ApiResponse = require("../helpers/apiResponse");
const { normalizeRole } = require("./roleAccess.middleware");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const bearerToken = authHeader && authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;
        const token = bearerToken || req.cookies?.erp_access_token;

        if (!token) {
            return ApiResponse.unauthorized(
                res,
                "Access token is required."
            );
        }
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        const user = await User.findByPk(decoded.id, {
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
            return ApiResponse.unauthorized(
                res,
                "User not found."
            );
        }
        if (!user.isActive) {
            return ApiResponse.forbidden(
                res,
                "User account is inactive."
            );
        }
        const roleSet = new Set();
        (user.roles || []).forEach((role) => {
            roleSet.add(normalizeRole(role.code));
            roleSet.add(normalizeRole(role.name));
        });

        req.user = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            roles: user.roles || [],
            roleSet,
            isSuperAdmin: roleSet.has("superadmin"),
        };
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return ApiResponse.unauthorized(
                res,
                "Access token expired."
            );
        }
        if (error.name === "JsonWebTokenError") {
            return ApiResponse.unauthorized(
                res,
                "Invalid access token."
            );
        }
        return next(error);
    }
};
module.exports = authenticate;