const authService = require('./auth.service');
const catchAsync = require('../../shared/utils/catchAsync');
const ApiError = require('../../shared/utils/ApiError');
const validateEmailDomain = require('../../shared/utils/validateEmail');

class AuthController {
  register = catchAsync(async (req, res, _next) => {
    let { email, password, name } = req.body;

    email = email.trim().toLowerCase();
    validateEmailDomain(email);

    const userData = await authService.register(email, password, name);
    this._setAuthCookies(res, userData);

    return res.json({
      user: userData.user,
      accessToken: userData.accessToken,
    });
  });

  login = catchAsync(async (req, res, _next) => {
    const { email, password } = req.body;
    const userData = await authService.login(email, password);
    this._setAuthCookies(res, userData);

    return res.json({
      user: userData.user,
      accessToken: userData.accessToken,
    });
  });

  logout = catchAsync(async (req, res, _next) => {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    return res.status(200).json({ message: 'Logged out successfully' });
  });

  refresh = catchAsync(async (req, res, _next) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw ApiError.Unauthorized('Refresh token is missing');
    }

    const userData = await authService.refresh(refreshToken);
    this._setAuthCookies(res, userData);

    return res.json({
      user: userData.user,
      accessToken: userData.accessToken,
    });
  });

  me = catchAsync(async (req, res, _next) => {
    const userData = await authService.getUserData(req.user.id);
    return res.json(userData);
  });

  _setAuthCookies(res, userData) {
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.cookie('accessToken', userData.accessToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
    });
  }
}

module.exports = new AuthController();
