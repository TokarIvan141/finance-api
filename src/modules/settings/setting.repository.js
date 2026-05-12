const UserSetting = require('../../models/nosql/UserSetting');

class SettingRepository {
    async GetSettings(userId) {
        let settings = await UserSetting.findOne({ userId });
        if (!settings) {
            settings = await UserSetting.create({ userId, theme: 'light' });
        }
        return settings;
    }

    async UpdateTheme(userId, theme) {
        return await UserSetting.findOneAndUpdate(
            {userId},
            {theme, updatedAt: Date.now()},
            {returnDocument: 'after', upsert: true}
        );
    }
}

module.exports = new SettingRepository();