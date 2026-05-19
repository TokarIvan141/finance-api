const settingService = require('./setting.service');
const catchAsync = require('../../shared/utils/catchAsync');

class SettingController {
  GetSettings = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const settings = await settingService.GetSettings(userId);
    return res.json(settings);
  });

  UpdateTheme = catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const { theme } = req.body;
    const settings = await settingService.UpdateTheme(userId, theme);
    return res.json(settings);
  });
}

module.exports = new SettingController();
