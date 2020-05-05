const rateLimit = require('express-rate-limit');

exports.rateLimitMiddleware = rateLimit({
    max: parseInt(process.env.RATE_MAX, 10),
    windowMs: parseInt(process.env.RATE_WINDOW_IN_MS, 10),
    message:
        'Слишком много запросов поступает с вашего IP-адреса, попробуйте через час!',
});
