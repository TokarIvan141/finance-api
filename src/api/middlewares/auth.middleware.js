const ApiError = require('../../shared/utils/ApiError');
const authService = require('../../modules/auth/auth.service');

module.exports = function (req, res, next) {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return next(ApiError.Unauthorized());
        }

        const userData = authService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.Unauthorized());
        }

        req.user = userData;
        next();
    } catch (e) {
        return next(ApiError.Unauthorized());
    }
};