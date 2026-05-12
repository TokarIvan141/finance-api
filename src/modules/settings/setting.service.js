const settingRepo = require('./setting.repository');
const ApiError = require('../../shared/utils/ApiError');

class SettingService {
    async GetSettings(userId) {
        return await settingRepo.GetSettings(userId);
    }

    async UpdateTheme(userId, theme) {
        if (!['light', 'dark'].includes(theme)) {
            throw ApiError.BadRequest('Theme must be either "light" or "dark"');
        }
        return await settingRepo.UpdateTheme(userId, theme);
    }
}

module.exports = new SettingService();