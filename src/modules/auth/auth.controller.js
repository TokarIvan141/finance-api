const authService = require('./auth.service');

class AuthController {
    async register(req, res, next) {
        try {
            const { email, password, name } = req.body;
            const userData = await authService.register(email, password, name);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            res.cookie('accessToken', userData.accessToken, { maxAge: 15 * 60 * 1000, httpOnly: true });
            return res.json({
                user: userData.user,
                accessToken: userData.accessToken
            });
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await authService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            res.cookie('accessToken', userData.accessToken, { maxAge: 15 * 60 * 1000, httpOnly: true });
            return res.json({
                user: userData.user,
                accessToken: userData.accessToken
            });
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            res.clearCookie('refreshToken');
            res.clearCookie('accessToken');
            return res.status(200).json({ message: 'Logged out successfully' });
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await authService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            res.cookie('accessToken', userData.accessToken, { maxAge: 15 * 60 * 1000, httpOnly: true });
            return res.json({
                user: userData.user,
                accessToken: userData.accessToken
            });
        } catch (e) {
            next(e);
        }
    }

    async me(req, res, next) {
        try {
            const userData = await authService.getUserData(req.user.id);
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new AuthController();