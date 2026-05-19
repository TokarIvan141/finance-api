const express = require('express');
const router = express.Router();
const ExportController = require('./export.controller');

router.get('/xlsx', ExportController.DownloadExcel);

module.exports = router;
