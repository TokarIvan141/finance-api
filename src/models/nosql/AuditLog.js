const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    action: { type: String, required: true },
    details: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now }
}, {
    versionKey: false,
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            return ret;
        }
    }
});

auditLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);