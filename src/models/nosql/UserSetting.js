const mongoose = require('mongoose');

const userSettingSchema = new mongoose.Schema({
    userId: { type: Number, required: true, unique: true },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserSetting', userSettingSchema);