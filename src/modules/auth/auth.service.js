const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepository = require('./auth.repository');
const ApiError = require('../../shared/utils/ApiError');

class AuthService {
    async register(email, password, name) {
        const candidate = await authRepository.findByEmail(email);
        if (candidate) {
            throw ApiError.BadRequest(`User with email ${email} already exists`);
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const user = await authRepository.create({ email, password: hashPassword, name });

        const tokens = this.generateTokens({ id: user.id, email: user.email });
        return { ...tokens, user: { id: user.id, email: user.email, name: user.name } };
    }

    async login(email, password) {
        const user = await authRepository.findByEmail(email);
        if (!user) {
            throw ApiError.BadRequest('User with this email not found');
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Invalid password');
        }

        const tokens = this.generateTokens({ id: user.id, email: user.email });
        return { ...tokens, user: { id: user.id, email: user.email, name: user.name } };
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.Unauthorized();
        }
        const userData = this.validateRefreshToken(refreshToken);
        if (!userData) {
            throw ApiError.Unauthorized();
        }

        const user = await authRepository.findById(userData.id);
        if (!user) {
            throw ApiError.Unauthorized();
        }

        const tokens = this.generateTokens({ id: user.id, email: user.email });
        return { ...tokens, user: { id: user.id, email: user.email, name: user.name } };
    }

    async getUserData(userId) {
        const user = await authRepository.findById(userId);
        if (!user) {
            throw ApiError.NotFound('User not found');
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