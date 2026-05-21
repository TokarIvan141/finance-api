const ApiError = require('./ApiError');

const validateEmailDomain = (email) => {
  const domain = email.split('@')[1].toLowerCase();

  // 1. Block Russian and associated domains
  const blockedTLDs = ['.ru', '.su', '.рф', '.by'];
  const blockedProviders = ['yandex', 'mail.ru', 'rambler', 'vk.com'];

  if (
    blockedTLDs.some((tld) => domain.endsWith(tld)) ||
    blockedProviders.some((p) => domain.includes(p))
  ) {
    throw ApiError.BadRequest('Реєстрація з російських поштових доменів не підтримується');
  }

  // 2. Catch common typos
  const typos = {
    'gmsil.com': 'gmail.com',
    'gmal.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'yaho.com': 'yahoo.com',
    'icloud.con': 'icloud.com',
    'outlook.con': 'outlook.com',
  };

  if (typos[domain]) {
    throw ApiError.BadRequest(
      `Некоректний домен пошти: можливо, ви мали на увазі ${typos[domain]}?`
    );
  }
};

module.exports = validateEmailDomain;
