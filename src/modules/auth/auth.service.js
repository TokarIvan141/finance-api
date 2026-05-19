const authRepository = require('./auth.repository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ApiError = require('../../shared/utils/ApiError');

class AuthService {
    async register(email, password, name) {
        const candidate = await authRepository.findByEmail(email);
        if (candidate) {
            throw ApiError.BadRequest('Користувач з такою електронною поштою вже зареєстрований');
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = await authRepository.createUser(email, hashPassword, name);

        const tokens = this.generateTokens({ id: user.id, email: user.email });
        return {
            ...tokens,
            user: { id: user.id, email: user.email, name: user.name }
        };
    }

    async login(email, password) {
        const user = await authRepository.findByEmail(email);
        if (!user) {
            throw ApiError.BadRequest('Користувача з таким email не знайдено або пароль невірний');
        }

        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Користувача з таким email не знайдено або пароль невірний');
        }

        const tokens = this.generateTokens({ id: user.id, email: user.email });
        return {
            ...tokens,
            user: { id: user.id, email: user.email, name: user.name }
        };
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.Unauthorized('Відсутній токен оновлення сесії');
        }

        const userData = this.validateRefreshToken(refreshToken);
        if (!userData) {
            throw ApiError.Unauthorized('Сесія застаріла або недійсна');
        }

        const user = await authRepository.findById(userData.id);
        if (!user) {
            throw ApiError.Unauthorized('Користувача не знайдено');
        }

        const tokens = this.generateTokens({ id: user.id, email: user.email });
        return {
            ...tokens,
            user: { id: user.id, email: user.email, name: user.name }
        };
    }

    async getUserData(userId) {
        const user = await authRepository.findById(userId);
        if (!user) {
            throw ApiError.NotFound('Профіль користувача не знайдено');
        }
        return { id: user.id, email: user.email, name: user.name };
    }

    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET || 'access-secret', { expiresIn: '15m' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'refresh-secret', { expiresIn: '30d' });
        return { accessToken, refreshToken };
    }

    validateAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'access-secret');
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refresh-secret');
        } catch (e) {
            return null;
        }
    }
}

module.exports = new AuthService();