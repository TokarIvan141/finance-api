const express = require('express');
const router = express.Router();
const SettingController = require('./setting.controller');
const auditLog = require('../../api/middlewares/audit.middleware');

router.get('/', SettingController.GetSettings);
router.patch('/theme', auditLog('UPDATE_THEME'), SettingController.UpdateTheme);

module.exports = router;