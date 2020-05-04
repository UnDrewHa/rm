const rateLimit = require('express-rate-limit');

exports.rateLimitMiddleware = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message:
        'Слишком много запросов поступает с вашего IP-адреса, попробуйте через час!',
});
