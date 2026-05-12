const mongoose = require('mongoose');

const userSettingSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    updatedAt: { type: Date, default: Date.now }
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

module.exports = mongoose.model('UserSetting', userSettingSchema);