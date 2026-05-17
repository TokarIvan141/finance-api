const settingService = require('./setting.service');

class SettingController {
  async GetSettings(req, res, next) {
    try {
      const userId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      const settings = await settingService.GetSettings(userId);
      res.json(settings);
    } catch (error) {
      next(error);
    }
  }

  async UpdateTheme(req, res, next) {
    try {
      const userId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';
      const { theme } = req.body;
      const settings = await settingService.UpdateTheme(userId, theme);
      res.json(settings);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SettingController();
