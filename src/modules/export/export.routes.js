const express = require('express');
const router = express.Router();
const ExportController = require('./export.controller');
const validate = require('../../api/middlewares/validate.middleware');
const { exportExcel } = require('../../shared/validations/export.validation');

router.get('/xlsx', validate(exportExcel), ExportController.DownloadExcel);

module.exports = router;