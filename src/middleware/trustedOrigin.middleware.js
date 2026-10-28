const ApiResponse = require("../helpers/apiResponse");

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function allowedOrigins() {
    const configured = [process.env.FRONTEND_URL, process.env.BACKEND_URL].filter(Boolean);
    const defaults = process.env.NODE_ENV === "production"
        ? ["https://will.khosocial.com"]
        : ["http://localhost:5173"];
    return new Set([...configured, ...defaults].map((value) => {
        try {
            return new URL(value).origin;
        } catch {
            return value;
        }
    }));
}

// CSRF defence for cookie-authenticated, state-changing admin requests: a browser
// always sends Origin on cross-site writes, so reject any that is not our own.
function requireTrustedOrigin(req, res, next) {
    if (SAFE_METHODS.has(req.method)) {
        return next();
    }
    const origin = req.headers.origin;
    if (origin && !allowedOrigins().has(origin)) {
        return ApiResponse.forbidden(res, "Request origin is not allowed.");
    }
    return next();
}

module.exports = requireTrustedOrigin;
