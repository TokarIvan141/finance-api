const express = require('express');
const router = express.Router();
const SettingController = require('./setting.controller');
const auditLog = require('../../api/middlewares/audit.middleware');
const validate = require('../../api/middlewares/validate.middleware');
const { updateTheme } = require('../../shared/validations/setting.validation');

router.get('/', SettingController.GetSettings);
router.patch('/theme', validate(updateTheme), auditLog('UPDATE_THEME'), SettingController.UpdateTheme);

module.exports = router;