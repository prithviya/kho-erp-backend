class ApiResponse {
    static success(res, message = "Success", data = null, statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }

    static created(res, message = "Created Successfully", data = null) {
        return res.status(201).json({
            success: true,
            message,
            data
        });
    }

    static error(res, message = "Something went wrong", errors = null, statusCode = 500) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors
        });
    }

    static unauthorized(res, message = "Unauthorized") {
        return res.status(401).json({
            success: false,
            message
        });
    }

    static forbidden(res, message = "Forbidden") {
        return res.status(403).json({
            success: false,
            message
        });
    }

    static notFound(res, message = "Resource Not Found") {
        return res.status(404).json({
            success: false,
            message
        });
    }
}

module.exports = ApiResponse;