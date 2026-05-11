class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }

    static BadRequest(message) {
        return new ApiError(400, message);
    }

    static Unauthorized(message = 'Unauthorized') {
        return new ApiError(401, message);
    }

    static Forbidden(message = 'Forbidden') {
        return new ApiError(403, message);
    }

    static NotFound(message) {
        return new ApiError(404, message);
    }

    static Internal(message) {
        return new ApiError(500, message);
    }
}

module.exports = ApiError;