const authService = require('./auth.service');
const catchAsync = require('../../shared/utils/catchAsync');
const ApiError = require('../../shared/utils/ApiError');

class AuthController {
    register = catchAsync(async (req, res, next) => {
        const { email, password, name } = req.body;

        const userData = await authService.register(email, password, name);
        res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        res.cookie('accessToken', userData.accessToken, { maxAge: 15 * 60 * 1000, httpOnly: true });
        return res.json({
            user: userData.user,
            accessToken: userData.accessToken
        });
    });

    login = catchAsync(async (req, res, next) => {
        const { email, password } = req.body;

        const userData = await authService.login(email, password);
        res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        res.cookie('accessToken', userData.accessToken, { maxAge: 15 * 60 * 1000, httpOnly: true });
        return res.json({
            user: userData.user,
            accessToken: userData.accessToken
        });
    });

    logout = catchAsync(async (req, res, next) => {
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        return res.status(200).json({ message: 'Logged out successfully' });
    });

    refresh = catchAsync(async (req, res, next) => {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            throw ApiError.Unauthorized('Відсутній токен оновлення сесії');
        }
        const userData = await authService.refresh(refreshToken);
        res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        res.cookie('accessToken', userData.accessToken, { maxAge: 15 * 60 * 1000, httpOnly: true });
        return res.json({
            user: userData.user,
            accessToken: userData.accessToken
        });
    });

    me = catchAsync(async (req, res, next) => {
        const userData = await authService.getUserData(req.user.id);
        return res.json(userData);
    });
}

module.exports = new AuthController();