const AuditLog = require('../../models/nosql/AuditLog');

const auditLog = (actionName) => {
  return async (req, res, next) => {
    res.on('finish', async () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const userId = req.user ? req.user.id : 'anonymous';

          const details = {
            method: req.method,
            url: req.originalUrl,
          };

          if (req.body && Object.keys(req.body).length > 0 && req.method !== 'GET') {
            details.body = req.body;
          }
          if (req.params && Object.keys(req.params).length > 0) {
            details.params = req.params;
          }

          AuditLog.create({
            userId,
            action: actionName,
            details,
          }).catch((err) => {
            console.error('Audit Log Error:', err.message);
          });
        } catch (err) {
          console.error('Audit Log Error:', err.message);
        }
      }
    });
    next();
  };
};

module.exports = auditLog;
