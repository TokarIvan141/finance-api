const AuditLog = require('../../models/nosql/AuditLog');

const auditLog = (actionName) => {
    return async (req, res, next) => {
        res.on('finish', async () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                try {
                    // TODO: [AUTH] Заменить на req.user.id
                    const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";

                    const details = {
                        method: req.method,
                        url: req.originalUrl
                    };

                    if (Object.keys(req.body).length > 0 && req.method !== 'GET') {
                        details.body = req.body;
                    }
                    if (Object.keys(req.params).length > 0) {
                        details.params = req.params;
                    }

                    await AuditLog.create({
                        userId,
                        action: actionName,
                        details
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