const jwt = require("jsonwebtoken");
const { User } = require("../model");
const ApiResponse = require("../helpers/apiResponse");

const authenticate = async (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return ApiResponse.unauthorized(
                res,
                "Access token is required."
            );
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findByPk(decoded.id);

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

        req.user = {
            id: user.id,
            email: user.email,
            firstName: user.firstName
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