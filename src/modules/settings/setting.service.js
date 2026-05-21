const settingRepo = require('./setting.repository');

class SettingService {
  async GetSettings(userId) {
    return await settingRepo.GetSettings(userId);
  }

  async UpdateTheme(userId, theme) {
    return await settingRepo.UpdateTheme(userId, theme);
  }
}

module.exports = new SettingService();
