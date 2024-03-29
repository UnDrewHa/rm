/**
 * Получить настройки для кук токена.
 */
exports.getTokenCookieOptions = () => {
    const cookieOptions = {
        expires: new Date(
            Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRES_IN, 10),
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    return cookieOptions;
};

/**
 * Получить объект с данными из тела запроса.
 *
 * @param {object} obj Тело запроса.
 * @param {String[]} [keys] Список ключей, которые нужно считать из тела запроса.
 *
 * @returns {object} Объект с данными из тела запроса.
 */
exports.getFieldsFromObject = function (obj = {}, keys = []) {
    const result = {};

    keys.forEach((key) => {
        if (key in obj) {
            result[key] = obj[key];
        }
    });

    return result;
};

/**
 * Добавляет .catch переданной функции-обработчику мидлвара роутера.
 *
 * @param {function} fn Функция-обработчик мидлвара роутера.
 *
 * @returns {function} Функцию-обработчик с .catch.
 */
exports.catchAsync = function (fn) {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
